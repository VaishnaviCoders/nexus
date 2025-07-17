'use server';

import { getCurrentAcademicYear } from '@/lib/academicYear';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { CreateNoticeFormSchema } from '@/lib/schemas';
import { currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';

export const createNotice = async (
  data: z.infer<typeof CreateNoticeFormSchema>
) => {
  try {
    const validatedData = CreateNoticeFormSchema.parse(data);
    const [organizationId, user, currentYear] = await Promise.all([
      getOrganizationId(),
      currentUser(),
      getCurrentAcademicYear(),
    ]);
    // console.log('Backend Action data', data);

    const processedAttachments = data.attachments.map((file: any) => {
      return {
        name: file.name || 'Unnamed file',
        url: file.url,
        type: file.type || 'application/octet-stream',
        size: file.size || 0,
      };
    });

    await prisma.notice.create({
      data: {
        noticeType: validatedData.noticeType,
        title: validatedData.title,
        content: validatedData.content,
        academicYearId: currentYear.id,

        attachments: processedAttachments,
        targetAudience: validatedData.targetAudience,

        isDraft: validatedData.isDraft ?? false,
        isPublished: validatedData.isPublished ?? false,
        isNoticeApproved: false,

        publishedBy: user?.fullName || user?.firstName || 'Unknown User',
        organizationId,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,

        emailNotification: validatedData.emailNotification,
        pushNotification: validatedData.pushNotification,
        WhatsAppNotification: validatedData.WhatsAppNotification,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error creating notice:', error);
    // Don't redirect on error, let the error bubble up
    // throw error instanceof Error ? error : new Error('Failed to create notice');
    return { error: true };
  }
};
