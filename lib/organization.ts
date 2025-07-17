'use server';

import { auth } from '@clerk/nextjs/server';

export async function getOrganizationId() {
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('No organization ID found');
  }

  return orgId;
}

export async function getOrganization() {
  const { orgId, orgRole, orgSlug } = await auth();
  if (!orgId) {
    throw new Error('No organization ID found');
  }

  if (!orgRole) {
    throw new Error('No organization role found');
  }

  if (!orgSlug) {
    throw new Error('No organization slug found');
  }

  return {
    orgId,
    orgRole,
    orgSlug,
  };
}

// export async function getDbOrganization({
//   organizationId,
// }: {
//   organizationId: string;
// }) {
//   const org = await prisma.organization.findFirst({
//     where: {
//       id: organizationId,
//     },
//     select: {
//       id: true,
//       name: true,
//       organizationSlug: true,
//       organizationLogo: true,
//       contactEmail: true,
//       contactPhone: true,
//       website: true,
//       organizationType: true,
//       plan: true,
//       planStartedAt: true,
//       planExpiresAt: true,
//       maxStudents: true,
//       isActive: true,
//       isPaid: true,
//     },
//   });
// }

export async function getOrganizationUserRole() {
  const { orgRole } = await auth();
  if (!orgRole) {
    throw new Error('No organization role found');
  }
  return { orgRole };
}
