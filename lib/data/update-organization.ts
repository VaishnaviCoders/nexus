'use server';
import prisma from '@/lib/db';
import { OrganizationFormData } from '@/lib/schemas';

export async function updateOrganization({
  organizationId,
  data,
}: {
  organizationId: string;
  data: OrganizationFormData;
}) {
  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      organizationType: data.organizationType,
      name: data.name,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      website: data.website,
      organizationSlug: data.organizationSlug,
    },
  });
}
