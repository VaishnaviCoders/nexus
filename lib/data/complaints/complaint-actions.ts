'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import type { ComplaintStatus, Severity } from '@/app/generated/prisma/enums';
import { getOrganizationId } from '@/lib/organization';
import { getCurrentAcademicYearId } from '@/lib/academicYear';
import { Prisma } from '@/app/generated/prisma/client';

interface ComplaintFilters {
  status?: string;
  severity?: string;
  category?: string;
  search?: string;
  page: number;
  sort: string;
  order: 'asc' | 'desc';
}

export async function getComplaintsWithFilters(filters: ComplaintFilters) {
  const organizationId = await getOrganizationId();
  const academicYearData = await getCurrentAcademicYearId();

  if (!academicYearData) {
    // Handle the missing academic year here
    // You can redirect, show a message, throw an error, etc.
    throw new Error('No current academic year is set.');
  }

  const { academicYearId } = academicYearData;

  try {
    const {
      status,
      severity,
      category,
      search,
      page = 1,
      sort = 'submittedAt',
      order = 'desc',
    } = filters;

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Prisma.AnonymousComplaintWhereInput = {
      organizationId,
      academicYearId,
    };

    if (status && status !== 'all') {
      where.currentStatus = status as ComplaintStatus;
    }

    if (severity && severity !== 'all') {
      where.severity = severity as Severity;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { trackingId: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get complaints with pagination
    const [complaints, totalCount] = await Promise.all([
      prisma.anonymousComplaint.findMany({
        where,
        include: {
          ComplaintStatusTimeline: {
            orderBy: { createdAt: 'desc' },
            take: 5, // Limit timeline entries for list view
          },
        },
        orderBy: {
          [sort]: order,
        },
        skip,
        take: pageSize,
      }),
      prisma.anonymousComplaint.count({ where }),
    ]);

    const baseWhere = { organizationId, academicYearId };

    // Get analytics data
    const [
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      criticalComplaints,
      categoryBreakdown,
      severityBreakdown,
      statusBreakdown,
    ] = await Promise.all([
      prisma.anonymousComplaint.count({ where }),
      prisma.anonymousComplaint.count({
        where: { ...baseWhere, currentStatus: 'PENDING' },
      }),
      prisma.anonymousComplaint.count({
        where: { ...baseWhere, currentStatus: 'RESOLVED' },
      }),
      prisma.anonymousComplaint.count({
        where: { ...baseWhere, severity: 'CRITICAL' },
      }),

      // Category breakdown
      prisma.anonymousComplaint.groupBy({
        by: ['category'],
        where,
        _count: { category: true },
      }),

      // Severity breakdown
      prisma.anonymousComplaint.groupBy({
        by: ['severity'],
        where,
        _count: { severity: true },
      }),

      // Status breakdown
      prisma.anonymousComplaint.groupBy({
        by: ['currentStatus'],
        where,
        _count: { currentStatus: true },
      }),
    ]);

    // Calculate average resolution time
    const resolvedComplaintsWithTimeline =
      await prisma.anonymousComplaint.findMany({
        where: { currentStatus: 'RESOLVED', organizationId, academicYearId },
        include: {
          ComplaintStatusTimeline: {
            where: { status: 'RESOLVED' },
            orderBy: { createdAt: 'asc' },
            take: 1,
          },
        },
      });

    const resolutionTimes = resolvedComplaintsWithTimeline
      .filter((complaint) => complaint.ComplaintStatusTimeline.length > 0)
      .map((complaint) => {
        const resolvedDate = complaint.ComplaintStatusTimeline[0].createdAt;
        const submittedDate = complaint.submittedAt;
        return Math.floor(
          (resolvedDate.getTime() - submittedDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );
      });

    const averageResolutionTime = Math.round(
      resolutionTimes.reduce((sum, t) => sum + t, 0) / resolutionTimes.length ||
        0
    );

    // Get monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await prisma.anonymousComplaint.findMany({
      where: {
        submittedAt: {
          gte: sixMonthsAgo,
        },
        organizationId,
        academicYearId,
      },

      select: {
        submittedAt: true,
        currentStatus: true,
      },
    });

    const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
      const targetDate = new Date();
      targetDate.setMonth(sixMonthsAgo.getMonth() + i);

      const monthKey = targetDate.toISOString().slice(0, 7);
      const monthName = targetDate.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });

      const monthComplaints = monthlyData.filter(
        (complaint) =>
          complaint.submittedAt.toISOString().slice(0, 7) === monthKey
      );

      const resolvedInMonth = monthComplaints.filter(
        (complaint) => complaint.currentStatus === 'RESOLVED'
      ).length;

      return {
        month: monthName,
        count: monthComplaints.length,
        resolved: resolvedInMonth,
      };
    });

    // Format breakdown data
    const categoryBreakdownObj = categoryBreakdown.reduce(
      (acc, item) => {
        acc[item.category] = item._count.category;
        return acc;
      },
      {} as Record<string, number>
    );

    const severityBreakdownObj = severityBreakdown.reduce(
      (acc, item) => {
        acc[item.severity] = item._count.severity;
        return acc;
      },
      {} as Record<string, number>
    );

    const statusBreakdownObj = statusBreakdown.reduce(
      (acc, item) => {
        acc[item.currentStatus] = item._count.currentStatus;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      complaints,
      totalCount,
      analytics: {
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        criticalComplaints,
        averageResolutionTime,
        categoryBreakdown: categoryBreakdownObj,
        severityBreakdown: severityBreakdownObj,
        statusBreakdown: statusBreakdownObj,
        monthlyTrends,
      },
      pagination: {
        page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw new Error('Failed to fetch complaints data');
  }
}

export async function updateComplaintStatus(
  complaintId: string,
  status: string,
  note?: string
) {
  try {
    // Start a transaction to update both complaint and timeline
    const result = await prisma.$transaction(async (tx) => {
      // Update the complaint status
      const updatedComplaint = await tx.anonymousComplaint.update({
        where: { id: complaintId },
        data: {
          currentStatus: status as ComplaintStatus,
          updatedAt: new Date(),
        },
      });

      // Add timeline entry
      await tx.complaintStatusTimeline.create({
        data: {
          complaintId,
          status: status as ComplaintStatus,
          note: note || null,
          changedBy: 'Admin', // In a real app, this would be the current user
          createdAt: new Date(),
        },
      });

      return updatedComplaint;
    });

    // Revalidate the page to show updated data
    revalidatePath('/complaints/manage');

    return {
      success: true,
      complaint: result,
    };
  } catch (error) {
    console.error('Error updating complaint status:', error);
    return {
      success: false,
      error: 'Failed to update complaint status',
    };
  }
}

export async function getComplaintById(complaintId: string) {
  try {
    const complaint = await prisma.anonymousComplaint.findUnique({
      where: { id: complaintId },
      include: {
        ComplaintStatusTimeline: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return complaint;
  } catch (error) {
    console.error('Error fetching complaint:', error);
    throw new Error('Failed to fetch complaint');
  }
}

export async function getComplaintByTrackingId(trackingId: string) {
  try {
    const complaint = await prisma.anonymousComplaint.findUnique({
      where: { trackingId },
      include: {
        ComplaintStatusTimeline: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return complaint;
  } catch (error) {
    console.error('Error fetching complaint by tracking ID:', error);
    throw new Error('Failed to fetch complaint');
  }
}

export async function bulkUpdateComplaintStatus(
  complaintIds: string[],
  status: string,
  note?: string
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Update all complaints
      const updatedComplaints = await tx.anonymousComplaint.updateMany({
        where: {
          id: {
            in: complaintIds,
          },
        },
        data: {
          currentStatus: status as ComplaintStatus,
          updatedAt: new Date(),
        },
      });

      // Create timeline entries for all complaints
      const timelineEntries = complaintIds.map((complaintId) => ({
        complaintId,
        status: status as ComplaintStatus,
        note: note || null,
        changedBy: 'Admin',
        createdAt: new Date(),
      }));

      await tx.complaintStatusTimeline.createMany({
        data: timelineEntries,
      });

      return updatedComplaints;
    });

    revalidatePath('/complaints/manage');

    return {
      success: true,
      updatedCount: result.count,
    };
  } catch (error) {
    console.error('Error bulk updating complaint status:', error);
    return {
      success: false,
      error: 'Failed to update complaint statuses',
    };
  }
}
