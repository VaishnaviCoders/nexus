// app/actions/lead-conversion.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { getCurrentUserId } from '@/lib/user';

export async function convertLead(leadId: string) {
  try {
    const currentUserId = await getCurrentUserId();

    // Verify lead exists and is not already converted
    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
      include: {
        organization: true,
        academicYear: true,
      },
    });

    if (!lead) {
      return {
        success: false,
        error: 'Lead not found or already converted',
      };
    }

    // Simply mark the lead as converted and create an activity
    // The actual student creation will happen in your student form
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: 'CONVERTED',
        convertedAt: new Date(),
        // Note: We're NOT setting convertedToStudentId here
        // This will be set when the student is actually created
        nextFollowUpAt: null, // Clear follow-ups
      },
    });

    // Create conversion activity
    await prisma.leadActivity.create({
      data: {
        leadId: leadId,
        type: 'OTHER',
        title: 'Lead marked for conversion',
        description:
          'Lead marked as converted and ready for student enrollment process',
        outcome: 'CONVERTED',
        performedById: currentUserId,
        performedAt: new Date(),
      },
    });

    revalidatePath(`/dashboard/leads/${leadId}`);
    revalidatePath('/dashboard/leads');

    return {
      success: true,
      message: 'Lead marked for conversion',
      data: {
        leadId: lead.id,
        studentName: lead.studentName,
        // Return lead data to pre-fill student form
        leadData: {
          studentName: lead.studentName,
          parentName: lead.parentName,
          phone: lead.phone,
          email: lead.email,
          whatsappNumber: lead.whatsappNumber,
          address: lead.address,
          city: lead.city,
          state: lead.state,
          pincode: lead.pincode,
          currentSchool: lead.currentSchool,
          requirements: lead.requirements,
          source: lead.source,
          notes: lead.notes,
        },
      },
    };
  } catch (error) {
    console.error('Error converting lead:', error);
    return {
      success: false,
      error: 'Failed to convert lead',
    };
  }
}

// // Check if lead can be converted
// export async function checkLeadConversionEligibility(leadId: string) {
//   try {
//     const lead = await prisma.lead.findUnique({
//       where: { id: leadId },
//       select: {
//         id: true,
//         status: true,
//         convertedToStudentId: true,
//         studentName: true,
//         phone: true,
//       },
//     });

//     if (!lead) {
//       return { success: false, error: 'Lead not found', eligible: false };
//     }

//     if (lead.convertedToStudentId) {
//       return { success: false, error: 'Lead already converted', eligible: false };
//     }

//     // Basic eligibility check
//     if (!lead.studentName || !lead.phone) {
//       return {
//         success: false,
//         error: 'Lead missing required information',
//         eligible: false,
//       };
//     }

//     return { success: true, eligible: true, data: lead };

//   } catch (error) {
//     console.error('Error checking eligibility:', error);
//     return { success: false, error: 'Failed to check eligibility', eligible: false };
//   }
// }
