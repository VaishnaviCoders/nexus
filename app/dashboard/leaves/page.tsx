import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/db';
import { LeaveForm } from '@/components/dashboard/leaves/leave-form';
import { getOrganizationId } from '@/lib/organization';
import { EmptyState } from '@/components/ui/empty-state';
import { CalendarDays, User, Volleyball } from 'lucide-react';
import { getCurrentAcademicYearId } from '@/lib/academicYear';
import { getCurrentUserId } from '@/lib/user';

import LeaveCard from '@/components/dashboard/leaves/leave-card';

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
              section: {
                select: {
                  name: true,
                  grade: {
                    select: {
                      grade: true,
                    },
                  },
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
    <section aria-labelledby="Leaves" className="grid gap-4 px-2">
      <Card className="py-4 px-2 flex items-center justify-between   ">
        <div>
          <CardTitle className="text-lg">Leaves</CardTitle>
          <CardDescription className="text-sm">
            Apply for leaves or see own leaves.
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
              label: 'Go Back to Dashboard',
              href: '/dashboard',
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
          {leaves.map((leave) => (
            <LeaveCard leave={leave} key={leave.id} />
          ))}
        </div>
      )}
    </section>
  );
}
