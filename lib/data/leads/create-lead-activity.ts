'use server';

import prisma from '@/lib/db';
import {
  type createLeadActivityFormData,
  createLeadActivitySchema,
} from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function createLeadActivity(data: createLeadActivityFormData) {
  try {
    const validatedData = createLeadActivitySchema.parse(data);
    const leadId = validatedData.leadId;

    // Verify that the lead exists
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true },
    });

    if (!lead) {
      return {
        success: false,
        message: 'Lead not found',
      };
    }

    console.log('fo', validatedData);

    // Create the lead activity
    await prisma.leadActivity.create({
      data: {
        leadId: validatedData.leadId,
        type: validatedData.type,
        title: validatedData.title,
        description: validatedData.description,
        outcome: validatedData.outcome,
        performedAt: validatedData.performedAt,
        followUpDate: validatedData.followUpDate,
        followUpNote: validatedData.followUpNote,
      },
    });

    // Update lead's tracking fields
    const updateData: any = {
      lastContactedAt: new Date(), // Always update last contacted
    };

    // If activity has a follow-up date, update nextFollowUpAt
    if (validatedData.followUpDate) {
      updateData.nextFollowUpAt = validatedData.followUpDate;
    }

    // Increment follow-up count for communication activities
    const isFollowUpActivity = [
      'CALL',
      'EMAIL',
      'SMS',
      'WHATSAPP',
      'MEETING',
      'VISIT',
      'SCHOOL_TOUR',
      'DEMO_CLASS',
      'FOLLOW_UP',
    ].includes(validatedData.type);

    if (isFollowUpActivity) {
      updateData.followUpCount = {
        increment: 1,
      };
    }

    await prisma.lead.update({
      where: { id: leadId },
      data: updateData,
    });
    revalidatePath(`/dashboard/leads/${leadId}`);
    revalidatePath('/dashboard/leads');

    // Return success instead of redirecting
    return { success: true, message: 'Lead activity created successfully' };
  } catch (error) {
    console.error('Error creating LeadActivity:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to create Lead activity',
    };
  }
}
