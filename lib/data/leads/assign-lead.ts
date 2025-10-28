// app/actions/lead-assignment.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { AssignLeadFormData, assignLeadSchema } from '@/lib/schemas';
import { getCurrentUserId } from '@/lib/user';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export async function assignLead(data: AssignLeadFormData) {
  try {
    const currentUserId = await getCurrentUserId();

    const validatedData = assignLeadSchema.parse(data);

    // Verify lead exists
    const lead = await prisma.lead.findUnique({
      where: { id: validatedData.leadId },
      select: { id: true, assignedToUserId: true },
    });

    if (!lead) {
      return { success: false, error: 'Lead not found' };
    }

    // Verify assigned user exists
    const assignedUser = await prisma.user.findUnique({
      where: { id: validatedData.assignedToUserId },
      select: { id: true, firstName: true, lastName: true },
    });

    if (!assignedUser) {
      return { success: false, error: 'Assigned user not found' };
    }

    // Update lead assignment
    const updatedLead = await prisma.lead.update({
      where: { id: validatedData.leadId },
      data: {
        assignedToUserId: validatedData.assignedToUserId,
        assignedAt: new Date(),
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });

    // Create an activity for the assignment
    await prisma.leadActivity.create({
      data: {
        leadId: validatedData.leadId,
        type: 'OTHER',
        title: 'Lead assignment updated',
        description: `Lead assigned to ${assignedUser.firstName} ${assignedUser.lastName}`,
        performedById: currentUserId,
        performedAt: new Date(),
      },
    });

    revalidatePath(`/dashboard/leads/${validatedData.leadId}`);
    revalidatePath('/dashboard/leads');

    return {
      success: true,
      message: 'Lead assigned successfully',
      data: updatedLead,
    };
  } catch (error) {
    console.error('Error assigning lead:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.errors,
      };
    }

    return {
      success: false,
      error: 'Failed to assign lead',
    };
  }
}

export async function unassignLead(leadId: string) {
  try {
    const currentUserId = await getCurrentUserId();

    // Verify lead exists
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true, assignedToUserId: true },
    });

    if (!lead) {
      return { success: false, error: 'Lead not found' };
    }
    // Update lead to remove assignment
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        assignedToUserId: null,
        assignedAt: null,
      },
    });

    // Create an activity for the unassignment
    await prisma.leadActivity.create({
      data: {
        leadId: leadId,
        type: 'OTHER',
        title: 'Lead unassigned',
        description: 'Lead removed from current assignment',
        performedById: currentUserId,
        performedAt: new Date(),
      },
    });

    revalidatePath(`/dashboard/leads/${leadId}`);
    revalidatePath('/dashboard/leads');

    return {
      success: true,
      message: 'Lead unassigned successfully',
      data: updatedLead,
    };
  } catch (error) {
    console.error('Error unassigning lead:', error);
    return {
      success: false,
      error: 'Failed to unassign lead',
    };
  }
}

// Get available users for assignment (excluding current user if needed)
export async function getAvailableUsersForLeads() {
  try {
    const organizationId = await getOrganizationId();

    const users = await prisma.user.findMany({
      where: {
        organizationId,
        role: {
          in: ['ADMIN', 'TEACHER'],
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profileImage: true,
        role: true,
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });

    return { success: true, data: users };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      error: 'Failed to fetch users',
    };
  }
}
