'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

// Validation Schema
const classTeacherSchema = z.object({
  sectionId: z.string().min(1, 'Section ID is required'),
  teacherId: z.string().optional().nullable(),
  action: z.enum(['assign', 'remove']),
});

type ClassTeacherInput = z.infer<typeof classTeacherSchema>;

export async function manageClassTeacher(data: ClassTeacherInput) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validate input
    const validatedData = classTeacherSchema.parse(data);

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { organizationId: true, role: true },
    });

    if (!user?.organizationId) {
      return { success: false, error: 'Organization not found' };
    }

    // Check if user has permission (admin or super admin)
    if (user.role !== 'ADMIN') {
      return { success: false, error: 'Insufficient permissions' };
    }

    // Verify section belongs to organization
    const section = await prisma.section.findUnique({
      where: { id: validatedData.sectionId },
      select: { organizationId: true, gradeId: true },
    });

    if (!section || section.organizationId !== user.organizationId) {
      return { success: false, error: 'Section not found or access denied' };
    }

    if (validatedData.action === 'assign') {
      // Validate teacher exists and belongs to organization
      if (!validatedData.teacherId) {
        return {
          success: false,
          error: 'Teacher ID is required for assignment',
        };
      }

      const teacher = await prisma.teacher.findFirst({
        where: {
          id: validatedData.teacherId,
          organizationId: user.organizationId,
          isActive: true,
          employmentStatus: 'ACTIVE',
        },
      });

      if (!teacher) {
        return { success: false, error: 'Teacher not found or inactive' };
      }

      // Check if teacher is already assigned to another section in the same grade
      const existingAssignment = await prisma.section.findFirst({
        where: {
          classTeacherId: validatedData.teacherId,
          gradeId: section.gradeId,
          id: { not: validatedData.sectionId },
        },
        include: {
          grade: true,
        },
      });

      if (existingAssignment) {
        return {
          success: false,
          error: `Teacher is already assigned as class teacher to ${existingAssignment.grade.grade} - ${existingAssignment.name}`,
        };
      }

      // Assign class teacher
      await prisma.section.update({
        where: { id: validatedData.sectionId },
        data: { classTeacherId: validatedData.teacherId },
      });

      revalidatePath('/dashboard/grades');
      return { success: true, message: 'Class teacher assigned successfully' };
    } else {
      // Remove class teacher
      await prisma.section.update({
        where: { id: validatedData.sectionId },
        data: { classTeacherId: null },
      });

      revalidatePath('/dashboard/grades');
      return { success: true, message: 'Class teacher removed successfully' };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error('Class teacher management error:', error);
    return { success: false, error: 'Failed to manage class teacher' };
  }
}

// Get available teachers for a section
export async function getAvailableTeachers(sectionId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized', teachers: [] };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { organizationId: true },
    });

    if (!user?.organizationId) {
      return { success: false, error: 'Organization not found', teachers: [] };
    }

    const teachers = await prisma.teacher.findMany({
      where: {
        organizationId: user.organizationId,
        isActive: true,
        employmentStatus: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        Section: {
          include: {
            grade: true,
          },
        },
      },
      orderBy: {
        user: {
          firstName: 'asc',
        },
      },
    });

    return { success: true, teachers };
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return { success: false, error: 'Failed to fetch teachers', teachers: [] };
  }
}
