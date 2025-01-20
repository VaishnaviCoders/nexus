'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '../lib/db';
import { CreateNoticeFormSchema } from '../lib/schemas';
import { z } from 'zod';

export const syncOrganization = async () => {
  const { orgId, orgSlug } = await auth();

  if (!orgId) throw new Error('No organization found during Clerk sync');
  await prisma.organization.upsert({
    where: {
      id: orgId,
    },
    update: {},
    create: {
      id: orgId,
      name: orgSlug || '',
      organizationSlug: orgSlug || '',
      isActive: true,
      isPaid: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

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
      inAppNotification: data.inAppNotification,

      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};
