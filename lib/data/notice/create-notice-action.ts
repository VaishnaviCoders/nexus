'use server';

import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { getCurrentUser } from '@/lib/user';
import { getCurrentAcademicYearId } from '@/lib/academicYear';
import { createNoticeFormData, createNoticeSchema } from '@/lib/schemas';

export const createNotice = async (data: createNoticeFormData) => {
  try {
    // 1. Validate incoming data
    const validatedData = createNoticeSchema.parse(data);

    // 2. Get context
    const [organizationId, user] = await Promise.all([
      getOrganizationId(),
      getCurrentUser(),
    ]);

    const academicYearId = await getCurrentAcademicYearId();

    // 3. Create notice
    const notice = await prisma.notice.create({
      data: {
        noticeType: validatedData.noticeType,
        title: validatedData.title,
        isUrgent: validatedData.isUrgent,
        summary: validatedData.summary,
        content: validatedData.content,
        targetAudience: validatedData.targetAudience, // string[] or Role[]
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        emailNotification: validatedData.emailNotification,
        pushNotification: validatedData.pushNotification,
        smsNotification: validatedData.smsNotification,
        whatsAppNotification: validatedData.whatsAppNotification,
        priority: validatedData.priority,
        status: 'PENDING_REVIEW',
        organizationId,
        academicYearId,
        createdBy:
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : 'System',
        attachments: {
          createMany: {
            data: (validatedData.attachments || []).map((attachment) => ({
              fileName: attachment.fileName,
              fileType: attachment.fileType,
              fileSize: attachment.fileSize,
              fileUrl: attachment.url,
              publicId: attachment.publicId,
            })),
          },
        },
      },
    });
    return notice;
  } catch (error) {
    console.error('Error creating notice:', error);
    throw error instanceof Error ? error : new Error('Failed to create notice');
  }
};
