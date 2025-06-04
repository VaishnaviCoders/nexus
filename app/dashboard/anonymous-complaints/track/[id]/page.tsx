import AnonymousComplaintTracker from '@/components/dashboard/anonymousComplaints/anonymous-complaint-tracker';
import prisma from '@/lib/db';
import React from 'react';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const complaint = await prisma.anonymousComplaint.findUnique({
    where: { trackingId: id },
    include: {
      ComplaintStatusTimeline: {
        orderBy: { id: 'asc' },
        select: {
          id: true,
          complaintId: true,
          status: true,
          changedBy: true,
          createdAt: true,
          note: true,
        },
      },
    },
  });

  console.log('complaint', complaint);

  return (
    <>
      <AnonymousComplaintTracker complaint={complaint} />
    </>
  );
};

export default page;
