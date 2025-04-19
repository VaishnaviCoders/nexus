'use server';

import { auth, currentUser, User } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import prisma from '../lib/db';
import {
  CreateNoticeFormSchema,
  feeCategorySchema,
  gradeSchema,
  sectionSchema,
  studentSchema,
} from '../lib/schemas';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { NoticeEmailTemplate } from '@/components/email-templates/noticeMail';
import { Role } from '@prisma/client';
import { Knock } from '@knocklabs/node';
import { redirect } from 'next/navigation';
import { parseWithZod } from '@conform-to/zod';

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

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
export const createNotice = async (
  data: z.infer<typeof CreateNoticeFormSchema>
) => {
  const { orgId } = await auth();
  const user = await currentUser();

  // console.log('Backend Action data', data);

  const processedAttachments = data.attachments.map((file: any) => {
    return {
      name: file.name, // File name
      url: file.url, // File URL
      type: file.type, // File type
      size: file.size, // File size
    };
  });
  // console.log('Processed Attachments', processedAttachments);

  await prisma.notice.create({
    data: {
      noticeType: data.noticeType,
      title: data.title,
      content: data.content,

      attachments: processedAttachments,
      targetAudience: data.targetAudience,

      isDraft: data.isDraft,
      isPublished: data.isPublished,
      isNoticeApproved: false,

      publishedBy: user?.fullName || '',
      organizationId: orgId || '',
      startDate: data.startDate,
      endDate: data.endDate,

      emailNotification: data.emailNotification,
      pushNotification: data.pushNotification,
      WhatsAppNotification: data.WhatsAppNotification,

      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  redirect('/dashboard/notices');
};

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

const getRecipientEmails = async (
  organizationId: string,
  targetAudience: string[]
): Promise<string[]> => {
  let rolesToInclude: Role[] = [];

  if (targetAudience.includes('all')) {
    rolesToInclude = [Role.STUDENT, Role.TEACHER, Role.PARENT, Role.ADMIN];
  } else {
    rolesToInclude = targetAudience
      .map(mapTargetAudienceToRole)
      .filter((role): role is Role => role !== null);
  }

  const recipients = await prisma.user.findMany({
    where: {
      organizationId,
      role: {
        in: rolesToInclude,
      },
    },
    select: {
      email: true,
    },
  });

  return recipients.map((user) => user.email);
};
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

  // // Check can we send emails
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

export async function createStudent(data: z.infer<typeof studentSchema>) {
  const { orgId } = await auth();
  const client = await clerkClient();

  if (!orgId) throw new Error('Organization ID is required');

  const validateData = studentSchema.parse(data);
  // console.log('Student data', validateData);

  try {
    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { email: validateData.email },
          { rollNumber: validateData.rollNumber },
          { phoneNumber: validateData.phoneNumber },
        ],
      },
    });
    if (existingStudent) {
      throw new Error(
        '❌ Student with this email, roll number, or phone number already exists.'
      );
    }
    const existingClerkUser = await client.users.getUserList({
      emailAddress: [validateData.email],
    });

    let clerkUser;
    if (existingClerkUser.data.length > 0) {
      clerkUser = existingClerkUser.data[0];
    } else {
      // ✅ Create Clerk User if not found
      clerkUser = await client.users.createUser({
        emailAddress: [validateData.email],
        firstName: validateData.firstName,
        lastName: validateData.lastName,
        password: validateData.phoneNumber,
        skipPasswordChecks: true,
        externalId: `student_${validateData.rollNumber}`,
        privateMetadata: {
          role: 'STUDENT',
          organizationId: orgId,
        },
      });
    }

    try {
      const organization = await client.organizations.getOrganization({
        organizationId: orgId,
      });
      // console.log('Verified organization:', organization);
    } catch (error) {
      console.error('❌ Organization verification failed:', error);
      throw new Error('Organization not found in Clerk system');
    }
    // console.log('Clerk User Response:', JSON.stringify(clerkUser, null, 2));
    // console.log('Adding to Organization ID:', orgId);
    try {
      await client.organizations.createOrganizationMembership({
        organizationId: orgId,
        userId: clerkUser.id,
        role: 'org:student',
      });
      // console.log(`✅ Added student ${validateData.email} to organization`);
    } catch (orgError) {
      console.error('❌ Failed to add student to organization:', orgError);
    }

    // const imageFile = validateData.profileImage as File | null;

    // if (!imageFile || imageFile.name === 'undefined') {
    //   return console.log('File is not proper');
    // }

    // const arrayBuffer = await imageFile.arrayBuffer();

    // console.log('arrayBuffer', arrayBuffer);

    // const buffer = Buffer.from(arrayBuffer);

    // const uploadResponse: UploadApiResponse | undefined = await new Promise(
    //   (resolve, reject) => {
    //     const uploadStream = cloudinary.uploader.upload_stream(
    //       { resource_type: 'auto' },
    //       (error, result) => {
    //         if (error) {
    //           reject(error);
    //         } else {
    //           resolve(result);
    //         }
    //       }
    //     );
    //     uploadStream.end(buffer);
    //   }
    // );

    // const imageUrl = uploadResponse?.secure_url;

    // if (!imageUrl) {
    //   return console.log('Image URL Failed');
    // }

    const result = await prisma.$transaction(async (tx) => {
      const student = await tx.student.create({
        data: {
          clerkId: clerkUser.id,
          organizationId: orgId,
          rollNumber: validateData.rollNumber,
          firstName: validateData.firstName,
          lastName: validateData.lastName,
          email: validateData.email,
          phoneNumber: validateData.phoneNumber,
          whatsAppNumber: validateData.whatsAppNumber,
          middleName: validateData.middleName,
          fullName: `${validateData.firstName} ${
            validateData.middleName ?? ''
          } ${validateData.lastName}`.trim(),
          motherName:
            validateData.parent?.relationship === 'MOTHER'
              ? `${validateData.parent.firstName} ${validateData.parent.lastName}`.trim()
              : null,
          sectionId: validateData.sectionId,
          gradeId: validateData.gradeId,
          gender: validateData.gender,
          profileImage: validateData.profileImage,
          dateOfBirth: new Date(validateData.dateOfBirth),
          emergencyContact: validateData.emergencyContact,

          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      // await tx.user.create({
      //   data: {
      //     clerkId: clerkUser.id,
      //     organizationId: orgId,
      //     role: 'STUDENT',
      //     firstName: validateData.firstName,
      //     lastName: validateData.lastName,
      //     email: validateData.email,
      //     studentId: student.id,
      //     createdAt: new Date(),
      //     updatedAt: new Date(),
      //     profileImage: validateData.profileImage || '',
      //     password: validateData.phoneNumber,
      //   },
      // });

      if (validateData.parent) {
        const parent = await tx.parent.upsert({
          where: {
            email: validateData.parent.email,
          },
          update: {
            phoneNumber: validateData.parent.phoneNumber,
            whatsAppNumber: validateData.parent.whatsAppNumber || '',
          },
          create: {
            firstName: validateData.parent.firstName,
            lastName: validateData.parent.lastName,
            email: validateData.parent.email,
            phoneNumber: validateData.parent.phoneNumber,
            whatsAppNumber: validateData.parent.whatsAppNumber || '',
          },
        });
        await tx.parentStudent.create({
          data: {
            relationship: validateData.parent.relationship,
            studentId: student.id,
            parentId: parent.id,
          },
        });
      }
      return student;
    });
    return result;
  } catch (error) {
    console.error('❌ Error in createStudent:', JSON.stringify(error, null, 2));
    throw new Error(
      `❌ Failed to create student: ${JSON.stringify(error, null, 2)}`
    );
  }
}

// # Student Attendance

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export async function markAttendance(
  sectionId: string,
  attendanceData: { studentId: string; status: AttendanceStatus }[]
) {
  const { orgId } = await auth();
  const user = await currentUser();

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (new Date().setHours(0, 0, 0, 0) !== today.getTime()) {
    throw new Error('Attendance can only be marked for today.');
  }

  const recordedBy = `${user.firstName} ${user.lastName}`.trim() || 'Unknown';

  const attendanceUpdates = attendanceData.map((record) => ({
    where: {
      studentId_date: {
        studentId: record.studentId,
        date: today,
      },
    },
    update: {
      status: record.status,
      present: record.status === 'PRESENT',
      updatedAt: new Date(),
      recordedBy,
    },
    create: {
      studentId: record.studentId,
      present: record.status === 'PRESENT',
      date: today,
      status: record.status,
      notes: null,
      recordedBy,
      sectionId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }));

  await prisma.$transaction(
    attendanceUpdates.map((update) => prisma.studentAttendance.upsert(update))
  );

  console.log('Attendance data updated:', attendanceUpdates);
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
  const monthlyAttendance = allMonths.reduce((acc, month) => {
    acc[month] = { month, attendance: 0 };
    return acc;
  }, {} as Record<string, { month: string; attendance: number }>);

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
