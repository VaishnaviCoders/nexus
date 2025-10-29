import prisma from '@/lib/db';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import LeadDetails from '@/components/dashboard/leads/lead-details';

export default async function LeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      activities: {
        include: {
          performedBy: {
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
        },
        orderBy: {
          performedAt: 'desc',
        },
      },
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          email: true,
        },
      },
    },
  });

  if (!lead) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lead not found</AlertTitle>
          <AlertDescription>
            The lead you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <LeadDetails lead={lead} />
    </>
  );
}
