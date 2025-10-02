'use server';

import { auth, currentUser, User, clerkClient } from '@clerk/nextjs/server';
import {
  AcademicYearFormData,
  academicYearSchema,
  AcademicYearUpdateFormData,
  academicYearUpdateSchema,
  CreateTeacherFormData,
  createTeacherSchema,
  DocumentUploadFormData,
  documentUploadSchema,
  gradeSchema,
  sectionSchema,
  TeacherProfileFormData,
  teacherProfileSchema,
} from '../lib/schemas';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { parseWithZod } from '@conform-to/zod';
import FilterStudents from '@/lib/data/student/FilterStudents';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { AttendanceStatus, Role } from '@/generated/prisma/enums';
import { getCurrentUser, getCurrentUserId } from '@/lib/user';
import { DocumentVerificationAction } from '@/types/document';
import prisma from '@/lib/db';

import { getOrganizationId } from '@/lib/organization';
import { redis } from '@/lib/redis';
import { SupportFormData } from '@/components/websiteComp/SupportPopup';
import { getCurrentAcademicYearId } from '@/lib/academicYear';

export const syncUserWithOrg = async () => {
  const { orgId, orgRole, orgSlug } = await auth();

  if (!orgId) {
    throw new Error('Missing orgId ');
  }
  if (!orgSlug) {
    throw new Error('Missing orgSlug');
  }
  if (!orgRole) {
    throw new Error('Missing orgRole');
  }
  const user = await currentUser();

  if (!user) {
    throw new Error('No user found');
  }

  const roleMap: Record<string, Role> = {
    'org:admin': 'ADMIN',
    'org:teacher': 'TEACHER',
    'org:student': 'STUDENT',
    'org:parent': 'PARENT',
  };

  const mappedRole: Role = roleMap[orgRole] || 'PARENT';

  // default fallback

  // ✅ Upsert organization
  const organization = await prisma.organization.upsert({
    where: { id: orgId },
    update: {
      name: orgSlug,
      isActive: true,
      isPaid: false,
      updatedAt: new Date(),
    },
    create: {
      id: orgId,
      organizationSlug: orgSlug,
      isActive: true,
      isPaid: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('✅ Synced organization:', organization);
  // ✅ Upsert user with organizationId and role
  const syncedUser = await prisma.user.upsert({
    where: { clerkId: user.id },
    update: {
      organizationId: orgId,
      role: mappedRole,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.emailAddresses[0]?.emailAddress || '',
      profileImage: user.imageUrl || '',
    },
    create: {
      id: user.id,
      clerkId: user.id,
      organizationId: orgId,
      role: mappedRole,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.emailAddresses[0]?.emailAddress || '',
      profileImage: user.imageUrl || '',
    },
  });

  console.log('✅ Synced user:', syncedUser);
};

const mapTargetAudienceToRole = (audience: string): Role | null => {
  switch (audience.toLowerCase()) {
    case 'students':
      return Role.STUDENT;
    case 'teachers':
      return Role.TEACHER;
    case 'parents':
      return Role.PARENT;
    case 'admins':
      return Role.ADMIN;
    default:
      return null;
  }
};

export async function getNoticeRecipients(
  organizationId: string,
  targetAudience: string[]
): Promise<string[]> {
  const rolesToInclude = targetAudience.includes('all')
    ? [Role.STUDENT, Role.TEACHER, Role.PARENT, Role.ADMIN]
    : targetAudience
        .map(mapTargetAudienceToRole)
        .filter((role): role is Role => role !== null);

  if (rolesToInclude.length === 0) return [];

  const users = await prisma.user.findMany({
    where: {
      organizationId,
      role: { in: rolesToInclude },
    },
    select: { email: true },
  });

  return users.map((u) => u.email!.trim());
}

// * CLASSES && GRADES

export async function createGrade(prevState: any, formData: FormData) {
  const { orgId } = await auth();

  if (!orgId) throw new Error('No organization found during Create Grade');
  const submission = parseWithZod(formData, {
    schema: gradeSchema,
  });
  if (submission.status !== 'success') {
    console.log('Validation failed:', submission.error);
    return submission.reply();
  }

  console.log('Grade creation data:', submission.value);
  await prisma.grade.create({
    data: {
      grade: submission.value.grade,
      organizationId: orgId,
    },
  });

  redirect('/dashboard/grades');
}
export async function fetchGradesAndSections(organizationId: string) {
  const grades = await prisma.grade.findMany({
    where: { organizationId },
    include: { section: true },
  });

  return grades.map((grade) => ({
    id: grade.id,
    name: grade.grade,
    sections: grade.section.map((sec) => ({ id: sec.id, name: sec.name })),
  }));
}
export async function deleteGrade(formData: FormData) {
  const gradeId = formData.get('gradeId') as string;

  await prisma.grade.delete({
    where: { id: gradeId },
  });

  redirect('/dashboard/grades');
}
export async function deleteSection(formData: FormData) {
  const sectionId = formData.get('sectionId')?.toString();

  await prisma.section.delete({
    where: { id: sectionId },
  });

  redirect('/dashboard/grades');
}
export async function createSection(prevState: any, formData: FormData) {
  const { orgId } = await auth();

  if (!orgId) throw new Error('No organization found during Create Grade');

  const gradeId = formData.get('gradeId');
  const submission = parseWithZod(formData, {
    schema: sectionSchema,
  });
  if (submission.status !== 'success') {
    return submission.reply();
  }

  await prisma.section.create({
    data: {
      name: submission.value.name,
      gradeId: submission.value.gradeId,
      organizationId: orgId,
    },
  });

  redirect(`/dashboard/grades/${gradeId}`);
}

// Students Actions

// # Student Attendance

export async function markAttendance(
  sectionId: string,
  selectedDate: Date,
  attendanceData: {
    studentId: string;
    status: AttendanceStatus;
    note?: string;
  }[]
) {
  if (!attendanceData.length) {
    throw new Error('Attendance data cannot be empty');
  }

  const [academicYearId, organizationId, user] = await Promise.all([
    getCurrentAcademicYearId(),
    getOrganizationId(),
    getCurrentUser(),
  ]);

  // Verify section exists and get student IDs in one query
  const section = await prisma.section.findUnique({
    where: { id: sectionId, organizationId },
    select: {
      id: true,
      students: {
        select: { id: true },
      },
    },
  });

  if (!section) {
    throw new Error(
      'Invalid sectionId: The referenced Section does not exist.'
    );
  }

  const attendanceDate = new Date(selectedDate);
  attendanceDate.setHours(0, 0, 0, 0);

  const recordedBy =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown';

  const attendanceUpdates = attendanceData.map((record) => ({
    where: {
      studentId_date: {
        studentId: record.studentId,
        date: attendanceDate,
      },
    },
    update: {
      status: record.status,
      present: record.status === 'PRESENT' || record.status === 'LATE',

      updatedAt: new Date(),
      recordedBy,
      note: record.note,
    },
    create: {
      studentId: record.studentId,
      present: record.status === 'PRESENT' || record.status === 'LATE',
      academicYearId,
      date: attendanceDate,
      status: record.status,
      note: record.note,
      recordedBy,
      sectionId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }));

  const data = await prisma.$transaction(
    attendanceUpdates.map((updateData) =>
      prisma.studentAttendance.upsert(updateData)
    )
  );
}

export async function getPreviousDayAttendance(
  studentId: string,
  targetDate: Date
) {
  try {
    const previousDay = subDays(targetDate, 1);

    const attendanceRecord = await prisma.studentAttendance.findFirst({
      where: {
        studentId,
        date: {
          gte: startOfDay(previousDay),
          lt: endOfDay(previousDay),
        },
      },
      select: {
        academicYear: true,
        id: true,
        studentId: true,
        recordedBy: true,
        note: true,
        date: true,
        status: true,
        present: true,
        sectionId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log('Previous day attendance record:', attendanceRecord);

    return attendanceRecord;
  } catch (error) {
    console.error('Error fetching previous day attendance:', error);
    throw new Error('Failed to fetch previous day attendance');
  }
}
export async function deleteAttendance(ids: string[]) {
  await prisma.studentAttendance.deleteMany({
    where: { id: { in: ids } },
  });
  revalidatePath('/dashboard/attendance');
}

export async function getStudentMonthlyAttendance(studentId: string) {
  const attendanceRecords = await prisma.studentAttendance.findMany({
    where: {
      studentId: studentId,
    },
    select: {
      date: true,
      status: true,
      sectionId: true,
    },
  });

  const allMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Initialize monthly attendance with 0s
  const monthlyAttendance = allMonths.reduce(
    (acc, month) => {
      acc[month] = { month, attendance: 0 };
      return acc;
    },
    {} as Record<string, { month: string; attendance: number }>
  );

  // Process attendance data
  attendanceRecords.forEach((record) => {
    const month = new Date(record.date).toLocaleString('default', {
      month: 'long',
    });
    if (record.status === 'PRESENT') {
      monthlyAttendance[month].attendance += 1;
    }
  });

  // Convert to an array
  return Object.values(monthlyAttendance);
}
export async function WeeklyStudentAttendance(studentId: string) {
  const attendanceRecords = await prisma.studentAttendance.findMany({
    where: { studentId },
    select: { date: true, status: true },
  });

  const weeklyAttendance: Record<number, { week: number; attendance: number }> =
    {};

  attendanceRecords.forEach((record) => {
    const date = new Date(record.date);
    const weekNumber = Math.ceil(date.getDate() / 7); // Week 1-4 in a month

    if (!weeklyAttendance[weekNumber]) {
      weeklyAttendance[weekNumber] = { week: weekNumber, attendance: 0 };
    }

    if (record.status === 'PRESENT') {
      weeklyAttendance[weekNumber].attendance += 1;
    }
  });

  return Object.values(weeklyAttendance);
}
export async function yearlyStudentAttendance(studentId: string) {
  const attendanceRecords = await prisma.studentAttendance.count({
    where: { studentId, status: 'PRESENT' },
  });

  return { year: new Date().getFullYear(), attendance: attendanceRecords };
}
export async function CustomDatesStudentAttendance(
  studentId: string,
  startDate: Date,
  endDate: Date
) {}

export async function getSectionIdMonthlyAttendance(sectionId: string) {}
export async function WeeklySectionAttendance(sectionId: string) {}
export async function yearlySectionAttendance(sectionId: string) {}
export async function CustomDatesSectionAttendance(
  sectionId: string,
  startDate: Date,
  endDate: Date
) {}

// Fees

export async function getDashboardStats(organizationId: string) {
  const [totalRevenue, totalPending, studentCount, feeCategoryCount] =
    await Promise.all([
      prisma.fee.aggregate({
        where: { organizationId },
        _sum: { paidAmount: true },
      }),
      prisma.fee.aggregate({
        where: { organizationId },
        _sum: { pendingAmount: true },
      }),
      prisma.student.count({
        where: { organizationId },
      }),
      prisma.feeCategory.count({
        where: { organizationId },
      }),
    ]);

  return {
    totalRevenue: totalRevenue._sum.paidAmount || 0,
    pendingFees: totalPending._sum.pendingAmount || 0,
    totalStudents: studentCount,
    feeCategoryCount,
  };
}

export async function fetchFilteredStudents({
  search = '',
  gradeId = 'all',
  sectionId = 'all',
}: {
  search?: string;
  gradeId?: string;
  sectionId?: string;
}) {
  return await FilterStudents({ search, gradeId, sectionId });
}

export async function uploadStudentDocuments(
  data: DocumentUploadFormData,
  documentUrl: string,
  studentId: string
) {
  const user = await getCurrentUser();
  const organizationId = await getOrganizationId();

  const validatedData = documentUploadSchema.parse(data);

  const uploadedBy =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown';

  const document = await prisma.studentDocument.create({
    data: {
      organizationId,
      documentUrl,
      uploadedBy,
      uploadedAt: new Date(),
      note: validatedData.note ?? '',
      type: validatedData.type,
      fileName: validatedData.file.name,
      fileSize: validatedData.file.size,
      fileType: validatedData.file.type,
      studentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  revalidatePath('/dashboard/documents');
  revalidatePath('/dashboard/documents/verification');

  return document;
}

export async function studentDocumentsDelete(documentId: string) {
  const deletedDocument = await prisma.studentDocument.delete({
    where: { id: documentId },
  });

  revalidatePath('/dashboard/documents');
  revalidatePath('/dashboard/documents/verification');

  return deletedDocument;
}

interface VerifyDocumentData {
  action: DocumentVerificationAction;
  note?: string;
  rejectionReason?: string;
}
export async function verifyStudentDocument(
  documentId: string,
  data: VerifyDocumentData
) {
  try {
    const user = await currentUser();
    if (!user) throw new Error('User Not Found Please Logout And Log In');

    const verifiedByOrRejectedBy =
      [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown';
    // const organizationId = await getOrganizationId();

    // const document = await prisma.studentDocument.findFirst({
    //   where: {
    //     id: documentId,
    //     student: { organizationId },
    //     isDeleted: false,
    //   },
    // });

    // if (!document) {
    //   return { success: false, error: 'Document not found' };
    // }

    const updateData =
      data.action === 'APPROVE'
        ? {
            verified: true,
            verifiedBy: verifiedByOrRejectedBy || 'System',
            verifiedAt: new Date(),
            rejected: false,
            rejectedBy: null,
            rejectedAt: null,
            note: data.note ?? null,
          }
        : {
            verified: false,
            verifiedBy: null,
            verifiedAt: null,
            rejected: true,
            rejectedBy: verifiedByOrRejectedBy || 'System',
            rejectedAt: new Date(),
            rejectReason: data.rejectionReason,
          };

    await prisma.studentDocument.update({
      where: { id: documentId },
      data: updateData,
    });

    revalidatePath('/dashboard/document/verification');

    return {
      success: true,
      message: `Document ${data.action === 'APPROVE' ? 'approved' : 'rejected'} successfully`,
    };
  } catch (error) {
    console.error('Error verifying document:', error);
    return {
      success: false,
      error: 'Something went wrong while verifying the document.',
    };
  }
}

export async function updateTeacherProfileAction({
  teacherId,
  data,
}: {
  teacherId: string;
  data: TeacherProfileFormData;
}) {
  const validatedData = teacherProfileSchema.parse(data);

  // Convert { title, url }[] → string[]
  const certificateUrls: string[] =
    validatedData.certificateUrls?.map((file) => file.url) || [];

  const existingProfile = await prisma.teacherProfile.findUnique({
    where: { teacherId },
  });

  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: { createdAt: true, userId: true },
  });

  if (!teacher) throw new Error('Teacher not found');

  await prisma.user.update({
    where: { id: teacher.userId },
    data: {
      profileImage: validatedData.profilePhoto,
      lastName: validatedData.lastName,
      firstName: validatedData.firstName,
      updatedAt: new Date(),
    },
  });

  if (!teacher) throw new Error('Teacher not found');

  if (existingProfile) {
    // ✅ Update profile
    await prisma.teacherProfile.update({
      where: { teacherId },
      data: {
        contactEmail: validatedData.contactEmail,
        contactPhone: validatedData.contactPhone,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        dateOfBirth: validatedData.dateOfBirth,
        qualification: validatedData.qualification,
        experienceInYears: validatedData.experienceInYears,
        resumeUrl: validatedData.resumeUrl,
        bio: validatedData.bio,
        teachingPhilosophy: validatedData.teachingPhilosophy,
        specializedSubjects: validatedData.specializedSubjects,
        preferredGrades: validatedData.preferredGrades,
        idProofUrl: validatedData.idProofUrl || '',
        linkedinPortfolio: validatedData.linkedinPortfolio,
        languagesKnown: validatedData.languagesKnown,
        certificateUrls,
      },
    });
  } else {
    // ✅ Create profile using teacher.createdAt as joinedAt
    await prisma.teacherProfile.create({
      data: {
        teacherId,
        contactEmail: validatedData.contactEmail,
        contactPhone: validatedData.contactPhone,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        dateOfBirth: validatedData.dateOfBirth,
        qualification: validatedData.qualification,
        experienceInYears: validatedData.experienceInYears,
        resumeUrl: validatedData.resumeUrl,
        joinedAt: teacher.createdAt,
        bio: validatedData.bio,
        teachingPhilosophy: validatedData.teachingPhilosophy,
        specializedSubjects: validatedData.specializedSubjects,
        preferredGrades: validatedData.preferredGrades,
        idProofUrl: validatedData.idProofUrl || '',
        linkedinPortfolio: validatedData.linkedinPortfolio,
        languagesKnown: validatedData.languagesKnown,
        certificateUrls,
      },
    });
  }
}
export async function createTeacherFormAction(data: CreateTeacherFormData) {
  try {
    const organizationId = await getOrganizationId();
    const inviterUserId = await getCurrentUserId();
    const client = await clerkClient();
    const validatedData = createTeacherSchema.parse(data);

    // 1. Create Clerk User
    const clerkUser = await client.users.createUser({
      emailAddress: [validatedData.email],
      lastName: validatedData.lastName,
      firstName: validatedData.firstName,
      externalId: validatedData.contactPhone,
      skipPasswordRequirement: true,
    });

    // 2. Send Invitation
    await client.organizations.createOrganizationInvitation({
      organizationId,
      inviterUserId,
      emailAddress: validatedData.email,
      role: 'org:teacher',
      redirectUrl: 'https://shiksha.cloud/dashboard',
    });

    // 3. Create records in DB
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: clerkUser.id,
          email: validatedData.email,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          role: 'TEACHER',
          password: validatedData.contactPhone,
          organizationId,
          createdAt: new Date(),
          clerkId: clerkUser.id,
          profileImage: clerkUser.imageUrl,
        },
      });

      await tx.teacher.create({
        data: {
          userId: clerkUser.id,
          employeeCode: validatedData.employeeCode,
          employmentStatus: 'ACTIVE',
          organizationId,
          isActive: true,
          createdAt: new Date(),
          profile: {
            create: {
              idProofUrl: validatedData.idProofUrl || '',
              joinedAt: validatedData.joinedAt,
              contactEmail: validatedData.contactEmail,
              contactPhone: validatedData.contactPhone,
              address: validatedData.address,
              city: validatedData.city,
              state: validatedData.state,
              dateOfBirth: validatedData.dateOfBirth,
              qualification: validatedData.qualification,
              experienceInYears: validatedData.experienceInYears,
              bio: validatedData.bio,
              teachingPhilosophy: validatedData.teachingPhilosophy,
              specializedSubjects: validatedData.specializedSubjects,
              preferredGrades: validatedData.preferredGrades,
              linkedinPortfolio: validatedData.linkedinPortfolio,
              languagesKnown: validatedData.languagesKnown,
            },
          },
        },
      });
    });

    revalidatePath('/dashboard/teachers');
    return { success: true };
  } catch (error: any) {
    console.error('Teacher creation failed:', error);

    // Optional Clerk error log
    if (error?.errors) {
      console.error('Clerk Error:', {
        status: error?.status,
        errors: error.errors,
        traceId: error?.clerkTraceId,
      });
    }

    // Don't throw error, fail silently or log only
    return null;
  }
}

export async function toggleTeacherStatus(teacherId: string) {
  // First get the current status
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: { isActive: true },
  });

  if (!teacher) {
    throw new Error('Teacher not found');
  }

  // Toggle the status
  await prisma.teacher.update({
    where: { id: teacherId },
    data: {
      isActive: !teacher.isActive,
    },
  });

  revalidatePath('/dashboard/teachers');

  console.log('Teacher status toggled');
}

export async function createAcademicYear(data: AcademicYearFormData) {
  try {
    const user = await currentUser();
    const userId = await getCurrentUserId();

    const validatedData = academicYearSchema.parse(data);
    // Check for overlapping academic years
    const overlapping = await prisma.academicYear.findFirst({
      where: {
        organizationId: validatedData.organizationId,
        OR: [
          {
            AND: [
              { startDate: { lte: validatedData.startDate } },
              { endDate: { gte: validatedData.startDate } },
            ],
          },
          {
            AND: [
              { startDate: { lte: validatedData.endDate } },
              { endDate: { gte: validatedData.endDate } },
            ],
          },
          {
            AND: [
              { startDate: { gte: validatedData.startDate } },
              { endDate: { lte: validatedData.endDate } },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      return {
        success: false,
        error:
          'The selected dates overlap with an existing academic year. Please choose different dates.',
      };
    }

    // If this is set as current, unset other currents
    if (validatedData.isCurrent) {
      await prisma.academicYear.updateMany({
        where: {
          organizationId: validatedData.organizationId,
          isCurrent: true,
        },
        data: { isCurrent: false },
      });
    }

    await prisma.academicYear.create({
      data: {
        ...validatedData,
        createdBy: `${user?.firstName} ${user?.lastName}` || userId || 'SYSTEM', // Replace with actual user ID from auth
      },
    });

    revalidatePath('/dashboard/settings');
    return { success: true };
  } catch (error) {
    console.error('Academic year creation error:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Validation failed',
      };
    }
    return {
      success: false,
      error:
        'Something went wrong while creating the academic year. Please try again or contact support.',
    };
  }
}

export async function updateAcademicYear(data: AcademicYearUpdateFormData) {
  try {
    const validatedData = academicYearUpdateSchema.parse(data);

    // Check for overlapping academic years (excluding current one)
    const overlapping = await prisma.academicYear.findFirst({
      where: {
        organizationId: validatedData.organizationId,
        id: { not: validatedData.id },
        OR: [
          {
            AND: [
              { startDate: { lte: validatedData.startDate } },
              { endDate: { gte: validatedData.startDate } },
            ],
          },
          {
            AND: [
              { startDate: { lte: validatedData.endDate } },
              { endDate: { gte: validatedData.endDate } },
            ],
          },
          {
            AND: [
              { startDate: { gte: validatedData.startDate } },
              { endDate: { lte: validatedData.endDate } },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      return {
        success: false,
        error:
          'The selected dates overlap with an existing academic year. Please choose different dates.',
      };
    }

    // If this is set as current, unset other currents
    if (validatedData.isCurrent) {
      await prisma.academicYear.updateMany({
        where: {
          organizationId: validatedData.organizationId,
          isCurrent: true,
          id: { not: validatedData.id },
        },
        data: { isCurrent: false },
      });
    }

    await prisma.academicYear.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        type: validatedData.type,
        description: validatedData.description,
        isCurrent: validatedData.isCurrent,
      },
    });

    revalidatePath('/dashboard/settings');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Validation failed',
      };
    }
    return {
      success: false,
      error:
        'Something went wrong while updating the academic year. Please try again or contact support.',
    };
  }
}

export async function setCurrentAcademicYear(
  yearId: string,
  organizationId: string
) {
  try {
    // Unset all other currents
    await prisma.academicYear.updateMany({
      where: {
        organizationId,
        isCurrent: true,
        id: { not: yearId },
      },
      data: {
        isCurrent: false,
      },
    });

    // Set selected year as current
    await prisma.academicYear.update({
      where: {
        id: yearId,
      },
      data: {
        isCurrent: true,
      },
    });

    revalidatePath('/dashboard/settings');
    return { success: true };
  } catch (error) {
    console.error('Failed to set current academic year:', error);
    return {
      success: false,
      error: 'Unable to set currents academic year',
    };
  }
}

export async function deleteAcademicYear(id: string) {
  try {
    await prisma.academicYear.delete({
      where: { id },
    });

    revalidatePath('/dashboard/settings');
    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to delete academic year:', error);

    let errorMessage = 'Failed to delete academic year';

    // Check for Prisma foreign key error
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as any).code === 'P2003'
    ) {
      errorMessage =
        'Cannot delete. This academic year is linked to other data (e.g., attendance, notices, etc.)';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function submitSupportForm(data: SupportFormData) {
  const submission = {
    ...data,
    id: Date.now().toString(), // simple unique ID
    createdAt: new Date().toISOString(),
  };

  // Append to a Redis list
  await redis.rpush('support-submissions', JSON.stringify(submission));

  return { success: true, submission };
}
