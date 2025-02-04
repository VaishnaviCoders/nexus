'use server';

import { auth, currentUser, User } from '@clerk/nextjs/server';
import prisma from '../lib/db';
import {
  CreateNoticeFormSchema,
  gradeSchema,
  sectionSchema,
} from '../lib/schemas';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { NoticeEmailTemplate } from '@/components/email-templates/noticeMail';
import { Role } from '@prisma/client';
import { Knock } from '@knocklabs/node';
import { redirect } from 'next/navigation';
import { parseWithZod } from '@conform-to/zod';

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
const sendNotifications = async (
  notice: any,
  recipientEmails: string[],
  user: User
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const knock = new Knock(process.env.KNOCK_API_SECRET);

  const [knockResponse, resendResponse] = await Promise.all([
    knock.workflows.trigger('notice-created', {
      recipients: recipientEmails.map((email) => ({
        id: user.id,
        email,
        name: user.firstName || '',
      })),
      data: {
        title: notice.title,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName,
      },
    }),
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: recipientEmails,
      subject: `Notice: ${notice.title}`,
      react: NoticeEmailTemplate({
        title: notice.title,
        organizationImage:
          notice.Organization?.organizationLogo ||
          'https://supabase.com/dashboard/img/supabase-logo.svg',
        content: notice.content,
        noticeType: notice.noticeType,
        startDate: notice.startDate,
        endDate: notice.endDate,
        targetAudience: notice.targetAudience,
        organizationName: notice.Organization?.name || '',
        publishedBy: notice.publishedBy,
        noticeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/notices/${notice.id}`,
      }),
    }),
  ]);

  console.log('Notifications sent:', { knockResponse, resendResponse });
};
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
  if (!currentStatus && notice.isNoticeApproved && notice.emailNotification) {
    const recipientEmails = await getRecipientEmails(
      notice.organizationId,
      notice.targetAudience
    );
    if (recipientEmails.length > 0) {
      await sendNotifications(notice, recipientEmails, user);
    }
  }
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
