'use server';

import { getCurrentAcademicYearId } from '@/lib/academicYear';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export type LeadStatsData = {
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
  highPriorityLeads: number;
  leadsByStatus: { status: string; count: number }[];
  leadsBySource: { source: string; count: number }[];
  recentActivities: Array<{
    id: string;
    studentName: string;
    type: string;
    title: string;
    performedAt: Date;
    performedByName: string;
  }>;
};

export async function getLeadStats(): Promise<LeadStatsData> {
  try {
    const organizationId = await getOrganizationId();
    const academicYearId = await getCurrentAcademicYearId();

    // Get all stats in parallel for better performance
    const [
      totalLeads,
      newLeads,
      convertedLeads,
      highPriorityLeads,
      leadsByStatus,
      leadsBySource,
      recentActivities,
    ] = await Promise.all([
      // Total Leads
      prisma.lead.count({
        where: { organizationId, academicYearId },
      }),

      // New Leads (last 7 days)
      prisma.lead.count({
        where: {
          organizationId,
          academicYearId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),

      // Converted Leads
      prisma.lead.count({
        where: {
          organizationId,
          academicYearId,
          status: 'CONVERTED',
        },
      }),

      // High Priority Leads (HIGH, URGENT, VIP)
      prisma.lead.count({
        where: {
          organizationId,
          academicYearId,
          priority: {
            in: ['HIGH', 'URGENT', 'VIP'],
          },
        },
      }),

      // Leads by Status - FIXED ORDERING
      prisma.lead.groupBy({
        by: ['status'],
        where: { organizationId, academicYearId },
        _count: {
          _all: true,
        },
        orderBy: [
          {
            _count: {
              // Use a specific field for ordering, or use status field itself
              id: 'desc', // or any other field that exists in Lead model
            },
          },
        ],
      }),

      // Leads by Source (Top 5) - FIXED ORDERING
      prisma.lead.groupBy({
        by: ['source'],
        where: { organizationId, academicYearId },
        _count: {
          _all: true,
        },
        orderBy: [
          {
            _count: {
              id: 'desc', // Use id field for ordering
            },
          },
        ],
        take: 5,
      }),

      // Recent Activities (last 10 activities)
      prisma.leadActivity.findMany({
        where: {
          lead: {
            organizationId,
          },
        },
        include: {
          lead: {
            select: {
              studentName: true,
            },
          },
          performedBy: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          performedAt: 'desc',
        },
        take: 10,
      }),
    ]);

    // Transform the data
    const transformedLeadsByStatus = leadsByStatus
      .map((item) => ({
        status: item.status,
        count: item._count._all,
      }))
      .sort((a, b) => b.count - a.count); // Manual sorting as fallback

    const transformedLeadsBySource = leadsBySource
      .map((item) => ({
        source: item.source,
        count: item._count._all,
      }))
      .sort((a, b) => b.count - a.count); // Manual sorting as fallback

    const transformedRecentActivities = recentActivities.map((activity) => ({
      id: activity.id,
      studentName: activity.lead.studentName,
      type: activity.type,
      title: activity.title,
      performedAt: activity.performedAt,
      performedByName: activity.performedBy
        ? `${activity.performedBy.firstName} ${activity.performedBy.lastName}`
        : 'System',
    }));

    return {
      totalLeads,
      newLeads,
      convertedLeads,
      highPriorityLeads,
      leadsByStatus: transformedLeadsByStatus,
      leadsBySource: transformedLeadsBySource,
      recentActivities: transformedRecentActivities,
    };
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    throw new Error('Failed to fetch lead statistics');
  }
}

// Alternative approach using raw SQL for better ordering
export async function getLeadStatsAlternative(): Promise<LeadStatsData> {
  try {
    const organizationId = await getOrganizationId();

    // For complex aggregations, you can use raw SQL
    const leadsByStatus = await prisma.$queryRaw`
      SELECT status, COUNT(*) as count 
      FROM "Lead" 
      WHERE "organizationId" = ${organizationId}
      GROUP BY status 
      ORDER BY count DESC
    `;

    const leadsBySource = await prisma.$queryRaw`
      SELECT source, COUNT(*) as count 
      FROM "Lead" 
      WHERE "organizationId" = ${organizationId}
      GROUP BY source 
      ORDER BY count DESC
      LIMIT 5
    `;

    // Rest of the queries remain the same...
    const [
      totalLeads,
      newLeads,
      convertedLeads,
      highPriorityLeads,
      recentActivities,
    ] = await Promise.all([
      prisma.lead.count({ where: { organizationId } }),
      prisma.lead.count({
        where: {
          organizationId,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.lead.count({
        where: { organizationId, status: 'CONVERTED' },
      }),
      prisma.lead.count({
        where: {
          organizationId,
          priority: { in: ['HIGH', 'URGENT', 'VIP'] },
        },
      }),
      prisma.leadActivity.findMany({
        where: { lead: { organizationId } },
        include: {
          lead: { select: { studentName: true } },
          performedBy: { select: { firstName: true, lastName: true } },
        },
        orderBy: { performedAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      totalLeads,
      newLeads,
      convertedLeads,
      highPriorityLeads,
      leadsByStatus: leadsByStatus as { status: string; count: number }[],
      leadsBySource: leadsBySource as { source: string; count: number }[],
      recentActivities: recentActivities.map((activity) => ({
        id: activity.id,
        studentName: activity.lead.studentName,
        type: activity.type,
        title: activity.title,
        performedAt: activity.performedAt,
        performedByName: activity.performedBy
          ? `${activity.performedBy.firstName} ${activity.performedBy.lastName}`
          : 'System',
      })),
    };
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    throw new Error('Failed to fetch lead statistics');
  }
}

// Simple approach without complex ordering
export async function getLeadStatsSimple(): Promise<LeadStatsData> {
  try {
    const organizationId = await getOrganizationId();

    const [
      totalLeads,
      newLeads,
      convertedLeads,
      highPriorityLeads,
      statusCounts,
      sourceCounts,
      recentActivities,
    ] = await Promise.all([
      prisma.lead.count({ where: { organizationId } }),
      prisma.lead.count({
        where: {
          organizationId,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.lead.count({
        where: { organizationId, status: 'CONVERTED' },
      }),
      prisma.lead.count({
        where: {
          organizationId,
          priority: { in: ['HIGH', 'URGENT', 'VIP'] },
        },
      }),
      // Get counts for each status individually
      Promise.all(
        [
          'NEW',
          'CONTACTED',
          'QUALIFIED',
          'INTERESTED',
          'CONVERTED',
          'LOST',
        ].map((status) =>
          prisma.lead
            .count({
              where: { organizationId, status: status as any },
            })
            .then((count) => ({ status, count }))
        )
      ),
      // Get counts for top sources individually
      Promise.all(
        [
          'WEBSITE',
          'REFERRAL_PROGRAM',
          'SOCIAL_MEDIA',
          'WALK_IN',
          'PHONE_CALL',
        ].map((source) =>
          prisma.lead
            .count({
              where: { organizationId, source: source as any },
            })
            .then((count) => ({ source, count }))
        )
      ),
      prisma.leadActivity.findMany({
        where: { lead: { organizationId } },
        include: {
          lead: { select: { studentName: true } },
          performedBy: { select: { firstName: true, lastName: true } },
        },
        orderBy: { performedAt: 'desc' },
        take: 10,
      }),
    ]);

    // Filter out zero counts and sort
    const leadsByStatus = statusCounts
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);

    const leadsBySource = sourceCounts
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalLeads,
      newLeads,
      convertedLeads,
      highPriorityLeads,
      leadsByStatus,
      leadsBySource,
      recentActivities: recentActivities.map((activity) => ({
        id: activity.id,
        studentName: activity.lead.studentName,
        type: activity.type,
        title: activity.title,
        performedAt: activity.performedAt,
        performedByName: activity.performedBy
          ? `${activity.performedBy.firstName} ${activity.performedBy.lastName}`
          : 'System',
      })),
    };
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    throw new Error('Failed to fetch lead statistics');
  }
}

// Additional server actions for specific stats (unchanged)
export async function getLeadsCountByStatus(status: string): Promise<number> {
  const organizationId = await getOrganizationId();
  const academicYearId = await getCurrentAcademicYearId();

  return prisma.lead.count({
    where: {
      organizationId,
      academicYearId,
      status: status as any,
    },
  });
}

export async function getLeadsRequiringFollowUp(): Promise<number> {
  const organizationId = await getOrganizationId();
  const academicYearId = await getCurrentAcademicYearId();

  return prisma.lead.count({
    where: {
      organizationId,
      academicYearId,
      OR: [
        {
          nextFollowUpAt: {
            lte: new Date(), // Past due follow-ups
          },
        },
        {
          AND: [
            { status: { not: 'CONVERTED' } },
            { status: { not: 'LOST' } },
            { status: { not: 'NOT_INTERESTED' } },
            { lastContactedAt: null },
          ],
        },
      ],
    },
  });
}

export async function getConversionRate(): Promise<number> {
  const organizationId = await getOrganizationId();
  const academicYearId = await getCurrentAcademicYearId();

  const [totalLeads, convertedLeads] = await Promise.all([
    prisma.lead.count({
      where: { organizationId, academicYearId },
    }),
    prisma.lead.count({
      where: {
        organizationId,
        academicYearId,
        status: 'CONVERTED',
      },
    }),
  ]);

  return totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
}

export async function getLeadGrowthThisMonth(): Promise<number> {
  const organizationId = await getOrganizationId();
  const academicYearId = await getCurrentAcademicYearId();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [currentMonthLeads, lastMonthLeads] = await Promise.all([
    prisma.lead.count({
      where: {
        organizationId,
        academicYearId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),
    prisma.lead.count({
      where: {
        organizationId,
        academicYearId,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    }),
  ]);

  if (lastMonthLeads === 0) return currentMonthLeads > 0 ? 100 : 0;

  return Math.round(
    ((currentMonthLeads - lastMonthLeads) / lastMonthLeads) * 100
  );
}
