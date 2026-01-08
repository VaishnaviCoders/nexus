import { EditLeadForm } from '@/components/dashboard/leads/edit-lead-form';
import { EmptyState } from '@/components/ui/empty-state';
import prisma from '@/lib/db';
import { Phone, Mail, User } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-screen">
        <EmptyState
          title="Lead not found"
          description="The lead you're trying to edit doesn't exist or may have been removed."
          icons={[User, Mail, Phone]}
        />
      </div>
    );
  }

  return <EditLeadForm {...lead} />;
}
