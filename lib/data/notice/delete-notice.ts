'use server';

import { deleteMultipleFromCloudinary } from '@/lib/cloudinary-server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const deleteNotice = async (noticeId: string) => {
  const notice = await prisma.notice.findUnique({
    where: { id: noticeId },
    include: { attachments: true },
  });
  if (!notice) throw new Error('Notice not found');

  // 1. Delete attachments from Cloudinary
  const publicIds = notice.attachments.map((att) => att.publicId);
  if (publicIds.length) {
    await deleteMultipleFromCloudinary(publicIds);
  }

  // 2. Delete attachments from DB
  await prisma.noticeAttachment.deleteMany({
    where: { noticeId: notice.id },
  });

  // 3. Delete notice
  await prisma.notice.delete({ where: { id: notice.id } });

  revalidatePath('/dashboard/notices');
};
