'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteLead(leadId: string) {
  try {
    // Delete the leads
    await prisma.lead.delete({
      where: {
        id: leadId,
      },
    });

    revalidatePath('/dashboard/leads');

    return {
      success: true,
      message: 'Lead deleted Successfully',
    };
  } catch (error) {
    console.error('Error deleting leads:', error);
    return {
      success: false,
      message: 'Failed to delete lead. Please try again.',
    };
  }
}
