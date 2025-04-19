'use server';

import { feeAssignmentSchema } from '../schemas';
import prisma from '@/lib/db';
import { z } from 'zod';
import { getOrganizationId } from '../organization';
import { revalidatePath } from 'next/cache';

export async function AssignFeeToStudents(
  data: z.infer<typeof feeAssignmentSchema>
) {
  const orgId = await getOrganizationId();

  const studentIdArray = Array.isArray(data.studentIds)
    ? data.studentIds
    : [data.studentIds];

  try {
    // const fees = await prisma.$transaction(
    //   studentIdArray.map((studentId) =>
    //     prisma.fee.create({
    //       data: {
    //         feeCategoryId: data.feeCategoryId,
    //         totalFee: data.feeAmount,
    //         dueDate: data.dueDate,
    //         status: 'UNPAID',
    //         organizationId: orgId,
    //         studentId,
    //       },
    //     })
    //   )
    // );

    const fees = await prisma.fee.createMany({
      data: studentIdArray.map((id) => ({
        studentId: id,
        feeCategoryId: data.feeCategoryId,
        totalFee: data.feeAmount,
        pendingAmount: data.feeAmount,
        dueDate: data.dueDate,
        status: 'UNPAID',
        organizationId: orgId,
      })),
    });

    revalidatePath('/dashboard/fees/admin/assign');
    return fees;
  } catch (error) {
    console.error('Failed to assign fees to students:', error);
    throw new Error('Failed to assign fees');
  }
}
