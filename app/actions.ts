'use server';

import { auth, currentUser, User } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import prisma from '../lib/db';
import {
  DocumentUploadFormData,
  documentUploadSchema,
  feeCategorySchema,
  gradeSchema,
  sectionSchema,
  TeacherProfileFormData,
  teacherProfileSchema,
} from '../lib/schemas';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { NoticeEmailTemplate } from '@/components/email-templates/noticeMail';
import { Knock } from '@knocklabs/node';
import { redirect } from 'next/navigation';
import { parseWithZod } from '@conform-to/zod';

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { performance } from 'perf_hooks';
import { getOrganizationId } from '@/lib/organization';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// export const syncOrganization = async () => {
//   const { orgId, orgSlug } = await auth();

//   if (!orgId) throw new Error('No organization found during Clerk sync');
//   await prisma.organization.upsert({
//     where: {
//       id: orgId,
//     },
//     update: {},
//     create: {
//       id: orgId,
//       name: orgSlug || '',
//       organizationSlug: orgSlug || '',
//       isActive: true,
//       isPaid: false,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//   });
// };

//  * NOTICE

export const deleteNotice = async (noticeId: string) => {
  await prisma.notice.delete({
    where: {
      id: noticeId,
    },
  });

  revalidatePath('/dashboard/notice');
};

const mapTargetAudienceToRole = (audience: string): Role | null => {
  const audienceMap: { [key: string]: Role } = {
    admins: Role.ADMIN,
    students: Role.STUDENT,
    teachers: Role.TEACHER,
    parents: Role.PARENT,
    staff: Role.TEACHER, // Assuming staff maps to TEACHER role
  };
  return audienceMap[audience.toLowerCase()] || null;
};

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

// const getRecipientEmails = async (
//   organizationId: string,
//   targetAudience: string[]
// ): Promise<string[]> => {
//   let rolesToInclude: Role[] = [];

//   if (targetAudience.includes('all')) {
//     rolesToInclude = [Role.STUDENT, Role.TEACHER, Role.PARENT, Role.ADMIN];
//   } else {
//     rolesToInclude = targetAudience
//       .map(mapTargetAudienceToRole)
//       .filter((role): role is Role => role !== null);
//   }

//   const recipients = await prisma.user.findMany({
//     where: {
//       organizationId,
//       role: {
//         in: rolesToInclude,
//       },
//     },
//     select: {
//       email: true,
//     },
//   });

//   return recipients.map((user) => user.email);
// };

// const sendNotifications = async (
//   notice: any,
//   recipientEmails: string[],
//   user: User
// ) => {
//   const resend = new Resend(process.env.RESEND_API_KEY);
//   const knock = new Knock(process.env.KNOCK_API_SECRET);
//   const [knockResponse, resendResponse] = await Promise.all([
//     knock.workflows.trigger('notice-created', {
//       recipients: recipientEmails.map((email) => ({
//         id: user.id,
//         email,
//         name: user.firstName || '',
//       })),
//       data: {
//         title: notice.title,
//         email: user.emailAddresses[0].emailAddress,
//         name: user.firstName,
//       },
//     }),
//     resend.emails.send({
//       from: 'onboarding@resend.dev',
//       to: recipientEmails,
//       subject: `Notice: ${notice.title}`,
//       react: NoticeEmailTemplate({
//         title: notice.title,
//         organizationImage:
//           notice.Organization?.organizationLogo ||
//           'https://supabase.com/dashboard/img/supabase-logo.svg',
//         content: notice.content,
//         noticeType: notice.noticeType,
//         startDate: notice.startDate,
//         endDate: notice.endDate,
//         targetAudience: notice.targetAudience,
//         organizationName: notice.Organization?.name || '',
//         publishedBy: notice.publishedBy,
//         noticeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/notices/${notice.id}`,
//       }),
//     }),
//   ]);
//   console.log('Notifications sent:', { knockResponse, resendResponse });
// };
export const toggleNoticeApproval = async (
  noticeId: string,
  currentStatus: boolean
) => {
  console.log('clicked toggleNoticeApproval', noticeId);

  const user = await currentUser();
  if (!user) return;
  const notice = await prisma.notice.update({
    where: {
      id: noticeId,
    },
    data: {
      isNoticeApproved: !currentStatus,
    },
    include: {
      Organization: true,
    },
  });

  // Check can we send emails
  // if (!currentStatus && notice.isNoticeApproved && notice.emailNotification) {
  //   const recipientEmails = await getRecipientEmails(
  //     notice.organizationId,
  //     notice.targetAudience
  //   );
  //   if (recipientEmails.length > 0) {
  //     await sendNotifications(notice, recipientEmails, user);
  //   }
  // }
  revalidatePath('/dashboard/notice');
};

export const approveOrRejectNotice = async (
  noticeId: string,
  approve: boolean
) => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error('Authentication required');
    }

    const notice = await prisma.notice.update({
      where: {
        id: noticeId,
      },
      data: {
        isNoticeApproved: approve,
      },
      include: {
        Organization: true,
      },
    });

    // If notice is approved and email notifications are enabled,
    // we could trigger email sending here
    // This is commented out as per the original code
    /*
    if (approve && notice.emailNotification) {
      const recipientEmails = await getRecipientEmails(
        notice.organizationId,
        notice.targetAudience
      );
      
      if (recipientEmails.length > 0) {
        await sendNotifications(notice, recipientEmails, user);
      }
    }
    */

    revalidatePath('/dashboard/notices');
    return notice;
  } catch (error) {
    console.error('Failed to update notice approval status:', error);
    return undefined;
  }
};

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

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export async function markAttendance(
  sectionId: string,
  selectedDate: Date,
  attendanceData: {
    studentId: string;
    status: AttendanceStatus;
    note?: string;
  }[]
) {
  console.log('Marking attendance:', attendanceData);
  const [{ orgId }, user] = await Promise.all([auth(), currentUser()]);

  if (!orgId) throw new Error('Organization ID is required');
  if (!user) throw new Error('User Not Found Please Logout And Log In');
  if (!attendanceData.length)
    throw new Error('Attendance data cannot be empty');

  const section = await prisma.section.findUnique({
    where: { id: sectionId, organizationId: orgId },
    select: { id: true },
  });

  if (!section) {
    throw new Error(
      'Invalid sectionId: The referenced Section does not exist.'
    );
  }

  // Optional: Add validation if you want to restrict date range
  // const today = new Date();
  // today.setHours(0, 0, 0, 0);
  // const maxPastDays = 7; // Allow marking up to 7 days ago
  // const minDate = new Date(today.getTime() - (maxPastDays * 24 * 60 * 60 * 1000));

  // if (attendanceDate < minDate || attendanceDate > today) {
  //   throw new Error(`Attendance can only be marked within ${maxPastDays} days.`);
  // }

  //   if (new Date().setHours(0, 0, 0, 0) !== today.getTime()) {
  // throw new Error('Attendance can only be marked for today.');
  // }

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

  console.log('Attendance data updated:', data);

  // redirect('/dashboard/attendance/analytics');
}

export async function getPreviousDayAttendance(
  studentId: string,
  targetDate: Date
): Promise<StudentAttendance | null> {
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
  const start = performance.now();
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

  const end = performance.now();

  console.log('getDashboardStats took', end - start, 'ms');

  return {
    totalRevenue: totalRevenue._sum.paidAmount || 0,
    pendingFees: totalPending._sum.pendingAmount || 0,
    totalStudents: studentCount,
    feeCategoryCount,
  };
}

import FilterStudents from '@/lib/data/student/FilterStudents';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { Role, StudentAttendance } from '@/lib/generated/prisma';

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
  const user = await currentUser();
  const validatedData = documentUploadSchema.parse(data);

  const document = await prisma.studentDocument.create({
    data: {
      documentUrl: documentUrl,
      uploadedBy: user?.id,
      uploadedAt: new Date(),
      note: validatedData.note || '',
      type: validatedData.type,
      fileName: validatedData.file.name,
      fileSize: validatedData.file.size,
      fileType: validatedData.file.type,
      studentId: studentId,
      createdAt: new Date(),
      updatedAt: new Date(),
      verified: false,
    },
  });

  revalidatePath('/dashboard/documents');

  console.log('Document created:', document);
  return document;
}

export async function studentDocumentsDelete(documentId: string) {
  // const user = await currentUser();
  const deletedDocument = await prisma.studentDocument.delete({
    where: { id: documentId },
  });

  revalidatePath('/dashboard/documents');

  return deletedDocument;
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
