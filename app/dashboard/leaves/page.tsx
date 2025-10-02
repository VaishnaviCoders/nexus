import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { LeaveTimeline } from "@/components/leaves/leave-timeline"
import prisma from '@/lib/db';
import { LeaveForm } from '@/components/dashboard/leaves/leave-form';
import { getOrganizationId } from '@/lib/organization';
import { EmptyState } from '@/components/EmptyState';
import { CalendarDays, User, Volleyball } from 'lucide-react';

import { getCurrentAcademicYearId } from '@/lib/academicYear';
import { getCurrentUserId } from '@/lib/user';
import { formatDateIN } from '@/lib/utils';
import { OwnLeaves } from '@/components/dashboard/leaves/own-leaves';

export default async function LeavesPage() {
  const organizationId = await getOrganizationId();
  const currentAcademicYearId = await getCurrentAcademicYearId();
  const userId = await getCurrentUserId();

  const leaves = await prisma.leave.findMany({
    where: {
      organizationId,
      userId,
    },
    include: {
      appliedBy: {
        select: {
          firstName: true,
          lastName: true,
          profileImage: true,
          role: true,
          student: {
            select: {
              grade: {
                select: {
                  grade: true,
                },
              },
            },
          },
        },
      },
      statusTimeline: { orderBy: { changedAt: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <section aria-labelledby="history-heading" className="grid gap-4 px-2">
      <Card className="py-4 px-2 flex items-center justify-between   ">
        <div>
          <CardTitle className="text-lg">Admin Dashboard</CardTitle>
          <CardDescription className="text-sm">
            Dashboard for admin to manage the system
          </CardDescription>
        </div>
        <LeaveForm currentAcademicYearId={currentAcademicYearId} />
      </Card>

      {leaves.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <EmptyState
            title="No Leaves Records Yet"
            description="No leaves have been applied yet.
            Please contact the administration office for more information."
            icons={[CalendarDays, User, Volleyball]}
            action={{
              label: 'Apply for Leave',
              href: '/dashboard/leaves',
            }}
          />
        </div>
      ) : (
        <OwnLeaves leaves={leaves} />
      )}
    </section>
  );
}
