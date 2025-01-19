'use server';

import { auth } from '@clerk/nextjs/server';
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

  await prisma.notice.create({
    data: {
      noticeType: data.noticeType,
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      content: data.content,
      isDraft: data.isDraft,
      isPublished: data.isPublished,
      emailNotification: data.emailNotification,
      pushNotification: data.pushNotification,
      inAppNotification: data.inAppNotification,
      targetAudience: data.targetAudience || [],
      attachments: data.attachments || [],
      isNoticeApproved: false,
      organizationId: orgId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};
