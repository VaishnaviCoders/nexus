'use server';

import prisma from '@/lib/db';
import { type createLeadFormData, createLeadSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createLead(data: createLeadFormData) {
  try {
    const validatedData = createLeadSchema.parse(data);

    await prisma.lead.create({
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
        organizationId: validatedData.organizationId,
        academicYearId: validatedData.academicYearId,
      },
    });

    revalidatePath('/dashboard/leads');

    // Return success instead of redirecting
    return { success: true, message: 'Lead created successfully' };
  } catch (error) {
    console.error('Error creating lead:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create lead',
    };
  }
}
