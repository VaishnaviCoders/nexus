'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '../lib/db';
import { CreateNoticeFormSchema } from '../lib/schemas';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { NoticeEmailTemplate } from '@/components/email-templates/noticeMail';
import { Role } from '@prisma/client';
import { Knock } from '@knocklabs/node';

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
  switch (audience.toLowerCase()) {
    case 'admins':
      return 'ADMIN';
    case 'students':
      return 'STUDENT';
    case 'teachers':
      return 'TEACHER';
    case 'parents':
      return 'PARENT';
    case 'staff':
      return 'TEACHER'; // Assuming staff maps to TEACHER role
    default:
      return null;
  }
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
    let rolesToInclude: Role[] = [];

    if (notice.targetAudience.includes('all')) {
      rolesToInclude = ['STUDENT', 'TEACHER', 'PARENT', 'ADMIN'];
    } else {
      // Map each target audience to corresponding roles
      rolesToInclude = notice.targetAudience
        .map(mapTargetAudienceToRole)
        .filter((role): role is Role => role !== null);
    }

    const recipientEmails = await prisma.user.findMany({
      where: {
        organizationId: notice.organizationId,
        role: {
          in: rolesToInclude,
        },
      },
      select: {
        email: true,
      },
    });

    if (recipientEmails.length > 0) {
      // 5. Send emails
      const resend = new Resend(process.env.RESEND_API_KEY);
      const knock = new Knock(process.env.KNOCK_API_SECRET);

      await knock.workflows.trigger('notice-created', {
        recipients: recipientEmails.map((recipient) => ({
          id: user.id,
          email: recipient.email,
          name: user.firstName || '',
        })),
        data: {
          title: notice.title,

          email: user.emailAddresses[0].emailAddress,
          name: user.firstName,
        },
      });

      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: recipientEmails.map((user) => user.email),
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
      });
      console.log('Email sent:', recipientEmails);
    }
  }

  revalidatePath('/dashboard/notice');
};

// export async function sendMail() {
//   const resend = new Resend(process.env.RESEND_API_KEY);

//   const emails = ['vaishnaviraykar768@gmail.com'];

//   const emailPromises = [...new Set(emails)].map((recipientEmail) => {
//     return resend.emails.send({
//       from: 'onboarding@resend.dev',
//       to: recipientEmail,
//       subject: 'Welcome to Resend!',
//       react: NoticeEmailTemp({
//         title: 'John',
//         content: 'John',
//         noticeType: 'holiday',
//         startDate: new Date(),
//         endDate: new Date(),
//         targetAudience: ['all'],
//         organizationName: 'John',
//         publishedBy: 'John',
//         noticeUrl: '/dashboard/notice/9c61423f-449f-4e6e-94cc-463cb42955c7',
//       }),
//     });
//   });
// }
