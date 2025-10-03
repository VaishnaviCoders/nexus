'use server';

import { getCurrentAcademicYearId } from '@/lib/academicYear';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import {
  LeaveCreateFromData,
  LeaveCreateSchema,
  ReviewActionFormData,
  ReviewActionSchema,
} from '@/lib/schemas';
import { getCurrentUser } from '@/lib/user';
import { revalidatePath } from 'next/cache';

function daysBetweenInclusive(start: Date, end: Date) {
  const ms = 1000 * 60 * 60 * 24;
  const startUTC = new Date(
    Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  );
  const endUTC = new Date(
    Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())
  );
  const diff = Math.round((endUTC.getTime() - startUTC.getTime()) / ms);
  return diff + 1;
}

export async function createLeaveAction(formData: LeaveCreateFromData) {
  const user = await getCurrentUser();
  const organizationId = await getOrganizationId();
  const academicYearId = await getCurrentAcademicYearId();

  const validatedData = LeaveCreateSchema.parse(formData);

  const totalDays = daysBetweenInclusive(
    validatedData.startDate,
    validatedData.endDate
  );

  // Wrap in transaction: create leave + initial timeline entry
  const result = await prisma.$transaction(async (tx) => {
    const leave = await tx.leave.create({
      data: {
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        totalDays,
        reason: validatedData.reason,
        type: validatedData.type,
        emergencyContact: validatedData.emergencyContact,
        currentStatus: 'PENDING',
        approvedBy: null,
        approvedAt: null,
        rejectedNote: null,
        userId: user.id,
        academicYearId,
        organizationId,
      },
    });

    await tx.leaveStatusTimeline.create({
      data: {
        leaveId: leave.id,
        status: 'PENDING',
        note: 'Applied',
        changedBy: user.id,
      },
    });

    return leave;
  });

  revalidatePath('/dashboard/leaves');
  revalidatePath('/dashboard/leaves/manage');

  return { id: result.id };
}

export async function approveLeaveAction(formDataData: ReviewActionFormData) {
  const user = await getCurrentUser();

  const parsed = ReviewActionSchema.safeParse(formDataData);
  if (!parsed.success) throw new Error('Invalid input');
  const { leaveId, rejectedNote } = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.leave.update({
      where: { id: leaveId },
      data: {
        currentStatus: 'APPROVED',
        approvedBy: user.id,
        approvedAt: new Date(),
        rejectedNote: null,
      },
    });

    await tx.leaveStatusTimeline.create({
      data: {
        leaveId,
        status: 'APPROVED',
        note: rejectedNote ?? 'Approved',
        changedBy: user.id,
      },
    });
  });

  revalidatePath('/dashboard/leaves');
  revalidatePath('/dashboard/leaves/manage');
  return { ok: true };
}

export async function rejectLeaveAction(formData: ReviewActionFormData) {
  const user = await getCurrentUser();

  const parsed = ReviewActionSchema.safeParse(formData);
  if (!parsed.success) throw new Error('Invalid input');
  const { leaveId, rejectedNote } = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.leave.update({
      where: { id: leaveId },
      data: {
        currentStatus: 'REJECTED',
        approvedBy: null,
        approvedAt: null,
        rejectedNote: rejectedNote ?? null,
      },
    });

    await tx.leaveStatusTimeline.create({
      data: {
        leaveId,
        status: 'REJECTED',
        note: rejectedNote ?? 'Rejected',
        changedBy: user.id,
      },
    });
  });

  revalidatePath('/dashboard/leaves');
  revalidatePath('/dashboard/leaves/manage');
  return { ok: true };
}
