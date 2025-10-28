'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteLeads(leadIds: string[]) {
  try {
    if (!leadIds || leadIds.length === 0) {
      throw new Error('No lead IDs provided');
    }

    // Delete the leads
    await prisma.lead.deleteMany({
      where: {
        id: {
          in: leadIds,
        },
      },
    });

    revalidatePath('/dashboard/leads');

    const leadCount = leadIds.length;

    return {
      success: true,
      message: `Successfully deleted ${leadCount} ${leadCount === 1 ? 'lead' : 'leads'}`,
    };
  } catch (error) {
    console.error('Error deleting leads:', error);

    const leadCount = leadIds?.length || 0;
    const errorMessage =
      error instanceof Error
        ? error.message
        : `Failed to delete ${leadCount === 1 ? 'lead' : 'leads'}`;

    return {
      success: false,
      message: errorMessage,
    };
  }
}
