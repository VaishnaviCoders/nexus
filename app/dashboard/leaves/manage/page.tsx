import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/lib/user';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import ApproveRejectLeave from '@/components/dashboard/leaves/ApproveRejectLeave';
import { getCurrentUserByRole } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LeavesManagePage() {
  const { role } = await getCurrentUserByRole();

  if (role !== 'TEACHER') {
    redirect('/dashboard'); // Better than throwing error
  }
  const organizationId = await getOrganizationId();

  const pendingLeaves = await prisma.leave.findMany({
    where: {
      organizationId,
      currentStatus: 'PENDING',
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
                  section: { select: { name: true } },
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
    <main className="px-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Manage Leaves
          </CardTitle>
          <CardDescription>
            Review and take action on requested leaves.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApproveRejectLeave leaves={pendingLeaves} />
        </CardContent>
      </Card>
    </main>
  );
}
