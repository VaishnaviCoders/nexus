'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

interface FeeCategoryData {
  name: string;
  description?: string;
}

export async function createFeeCategory(data: FeeCategoryData) {
  const { orgId } = await auth();

  try {
    const result = await prisma.feeCategory.create({
      data: {
        name: data.name,
        description: data.description,
        organizationId: orgId,
      },
    });

    revalidatePath('/dashboard/fees/admin/fee-categories');
    revalidatePath('/dashboard/fees/admin/assign');
    return result;
  } catch (error) {
    console.error('Failed to create fee category:', error);
    throw new Error('Failed to create fee category');
  }
}

export async function updateFeeCategory(id: string, data: FeeCategoryData) {
  try {
    const result = await prisma.feeCategory.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    revalidatePath('/fee-categories');
    return result;
  } catch (error) {
    console.error('Failed to update fee category:', error);
    throw new Error('Failed to update fee category');
  }
}

export async function deleteFeeCategory(id: string) {
  try {
    await prisma.feeCategory.delete({
      where: { id },
    });

    revalidatePath('/fee-categories');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete fee category:', error);
    throw new Error('Failed to delete fee category');
  }
}
