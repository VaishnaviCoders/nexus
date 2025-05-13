import { auth } from '@clerk/nextjs/server';
import { performance } from 'perf_hooks';

export async function getOrganizationId() {
  const start = performance.now();
  const { orgId } = await auth();

  if (!orgId) {
    throw new Error('No organization ID found');
  }

  const end = performance.now();

  console.log(`Organization ID fetched in ${end - start} ms`);

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
