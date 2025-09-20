'use server';

import { auth } from '@clerk/nextjs/server';
import { cache } from 'react';

export const getOrganizationId = cache(async () => {
  const { orgId } = await auth();
  if (!orgId) throw new Error('No organization ID found');
  return orgId;
});

export const getOrganization = cache(async () => {
  const { orgId, orgRole, orgSlug } = await auth();
  if (!orgId) throw new Error('No organization ID found');
  if (!orgRole) throw new Error('No organization role found');
  if (!orgSlug) throw new Error('No organization slug found');
  return {
    orgId,
    orgRole,
    orgSlug,
  };
});

export const getOrganizationUserRole = cache(async () => {
  const { orgRole } = await auth();
  if (!orgRole) throw new Error('No organization role found');
  return orgRole;
});
