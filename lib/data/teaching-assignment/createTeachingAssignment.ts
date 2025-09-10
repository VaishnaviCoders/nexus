'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { getCurrentUserId } from '@/lib/user';

const teachingAssignmentSchema = z.object({
  teacherId: z.string().min(1, 'Teacher is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  gradeId: z.string().min(1, 'Grade is required'),
  sectionId: z.string().min(1, 'Section is required'),
  academicYearId: z.string().optional(),
  notes: z.string().optional(),
});

type TeachingAssignmentFormData = z.infer<typeof teachingAssignmentSchema>;

export async function createTeachingAssignment(
  data: TeachingAssignmentFormData
) {
  try {
    console.log('formData', data);
    const validatedData = teachingAssignmentSchema.safeParse(data);

    const organizationId = await getOrganizationId();

    if (!validatedData.success || !validatedData.data) {
      return { error: 'Invalid form data' };
    }

    const { teacherId, subjectId, gradeId, sectionId, academicYearId } =
      validatedData.data;

    const teacherActive = await prisma.teacher.findFirst({
      where: { id: teacherId, isActive: true, organizationId },
    });
    if (!teacherActive)
      return { error: 'Teacher is not active in this organization' };

    await prisma.teachingAssignment.create({
      // Note: notes field doesn't exist in the schema, so we skip it
      data: {
        teacherId,
        subjectId,
        gradeId,
        sectionId,
        organizationId,
        academicYearId,
        status: 'ASSIGNED',
      },
    });
    revalidatePath('/teaching-assignments');

    return { success: true };
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      return {
        error:
          'This teacher is already assigned to this subject for the selected grade, section, and academic year.',
      };
    }
    throw err;
  }
}

//  Action to update assignment status
export async function updateTeachingAssignmentStatus(
  assignmentId: string,
  status: 'PENDING' | 'ASSIGNED' | 'COMPLETED' | 'INACTIVE'
): Promise<{ success?: boolean; error?: string }> {
  try {
    const userId = await getCurrentUserId();
    const organizationId = await getOrganizationId();

    //  Verify assignment belongs to organization
    const assignment = await prisma.teachingAssignment.findFirst({
      where: {
        id: assignmentId,
        organizationId,
      },
    });

    if (!assignment) {
      return { error: 'Teaching assignment not found.' };
    }

    //  Update the assignment status
    await prisma.teachingAssignment.update({
      where: { id: assignmentId },
      data: { status },
    });

    revalidatePath('/dashboard/teaching-assignments');
    return { success: true };
  } catch (error) {
    console.error('Error updating teaching assignment status:', error);
    return { error: 'Failed to update assignment status.' };
  }
}

//  Action to delete teaching assignment
export async function deleteTeachingAssignment(
  assignmentId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const userId = await getCurrentUserId();

    const organizationId = await getOrganizationId();

    //  Verify assignment belongs to organization
    const assignment = await prisma.teachingAssignment.findFirst({
      where: {
        id: assignmentId,
        organizationId,
      },
    });

    if (!assignment) {
      return { error: 'Teaching assignment not found.' };
    }

    //  Delete the assignment
    await prisma.teachingAssignment.delete({
      where: { id: assignmentId },
    });

    revalidatePath('/teaching-assignments');
    return { success: true };
  } catch (error) {
    console.error('Error deleting teaching assignment:', error);
    return { error: 'Failed to delete assignment.' };
  }
}
