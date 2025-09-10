'use server';

import { Prisma } from '@/generated/prisma';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { revalidatePath } from 'next/cache';

export const deleteExam = async (examId: string) => {
  try {
    const organizationId = await getOrganizationId();

    // Verify the exam exists and belongs to the organization
    const exam = await prisma.exam.findUnique({
      where: {
        id: examId,
        organizationId,
      },
      select: { id: true },
    });

    if (!exam) {
      return {
        error: 'Exam not found or you do not have permission to delete it.',
      };
    }

    await prisma.exam.delete({
      where: {
        id: examId,
      },
    });

    // Revalidate cache for exam-related pages
    revalidatePath('/dashboard/exams');

    return { success: 'Exam deleted successfully' };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return { error: 'Exam not found.' };
      }
      if (error.code === 'P2003') {
        return {
          error:
            'Cannot delete exam because it is referenced by other records (e.g., performance records).',
        };
      }
    }
    console.error('Error deleting exam:', error);
    return { error: 'Failed to delete exam. Please try again.' };
  }
};
