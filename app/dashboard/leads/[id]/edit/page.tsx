import { EditLeadForm } from '@/components/dashboard/leads/edit-lead-form';
import { EmptyState } from '@/components/EmptyState';
import prisma from '@/lib/db';

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
  });

  if (!lead) {
    return (
      <EmptyState
        title="Lead not found"
        description="The lead you're trying to edit doesn't exist or may have been removed."
      />
    );
  }

  return <EditLeadForm {...lead} />;
}
