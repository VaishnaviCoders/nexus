'use server';

import { LeadStatus } from '@/generated/prisma/enums';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  try {
    await prisma.lead.update({
      where: {
        id: leadId,
      },
      data: {
        status: status,
      },
    });

    revalidatePath('/dashboard/leads');
    revalidatePath(`/dashboard/leads/${leadId}/edit`);

    return { success: true, message: 'Lead updated successfully' };
  } catch (error) {
    console.error('Error updating lead:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update lead',
    };
  }
}
