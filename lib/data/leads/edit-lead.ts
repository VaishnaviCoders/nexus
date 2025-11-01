'use server';

import prisma from '@/lib/db';
import { editLeadFormData, editLeadSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function editLead(data: editLeadFormData) {
  try {
    const validatedData = editLeadSchema.parse(data);

    await prisma.lead.update({
      where: {
        id: validatedData.id,
      },
      data: {
        studentName: validatedData.studentName,
        phone: validatedData.phone,
        enquiryFor: validatedData.enquiryFor,
        parentName: validatedData.parentName,
        email: validatedData.email,
        whatsappNumber: validatedData.whatsappNumber,
        currentSchool: validatedData.currentSchool,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        pincode: validatedData.pincode,
        source: validatedData.source,
        status: validatedData.status,
        priority: validatedData.priority,
        notes: validatedData.notes,
        requirements: validatedData.requirements,
        budgetRange: validatedData.budgetRange,
        communicationPreference: validatedData.communicationPreference,
      },
    });

    revalidatePath('/dashboard/leads');
    revalidatePath(`/dashboard/leads/${validatedData.id}/edit`);

    return { success: true, message: 'Lead updated successfully' };
  } catch (error) {
    console.error('Error updating lead:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update lead',
    };
  }
}
