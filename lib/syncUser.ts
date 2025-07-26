import prisma from '@/lib/db';
import { User } from '@clerk/nextjs/server';
import { Role } from '@/generated/prisma/enums';

// Map Clerk org roles to Prisma roles
const roleMap: Record<string, Role> = {
  'org:admin': 'ADMIN',
  'org:teacher': 'TEACHER',
  'org:student': 'STUDENT',
  'org:parent': 'PARENT',
};

const orgCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  valid: boolean;
  timestamp: number;
}

const isValidOrganization = async (orgId: string): Promise<boolean> => {
  const now = Date.now();
  const cached = orgCache.get(orgId);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.valid;
  }

  try {
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { id: true },
    });

    const valid = !!org;
    orgCache.set(orgId, { valid, timestamp: now });
    return valid;
  } catch (error) {
    console.error('Error checking organization:', error);
    return false;
  }
};

export const syncUser = async (
  user: User,
  orgId: string,
  orgRole: string
): Promise<void> => {
  const role = roleMap[orgRole] ?? 'STUDENT';

  if (!orgId) throw new Error('Missing orgId');
  const isOrgValid = await isValidOrganization(orgId);
  if (!isOrgValid) throw new Error(`Invalid organization: ${orgId}`);

  const clerkId = user.id;
  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    null;

  if (!email) throw new Error('User email is missing');

  try {
    await prisma.user.upsert({
      where: { clerkId },
      update: {
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email,
        profileImage: user.imageUrl,
        organizationId: orgId,
        role,
        updatedAt: new Date(),
      },
      create: {
        id: clerkId,
        clerkId,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email,
        profileImage: user.imageUrl,
        role,
        createdAt: new Date(user.createdAt),
        organizationId: orgId,
      },
    });
    console.log(`✅ Synced user ${clerkId} with org ${orgId}`);

    await prisma.teacher.upsert({
      where: { userId: clerkId },
      update: {
        userId: clerkId,
      },
      create: {
        userId: clerkId,
        organizationId: orgId,
        isActive: true,
      },
    });

    console.log(`✅ Teacher sync  ${clerkId} with org ${orgId}`);
  } catch (error) {
    console.error('❌ Error syncing user to DB:', error);
    throw new Error('Failed to sync user');
  }
};

export const syncUserAsync = async (
  user: User,
  orgId: string,
  orgRole: string
): Promise<void> => {
  try {
    await syncUser(user, orgId, orgRole);
  } catch (err) {
    console.error('Background sync failed:', err);
  }
};

export const getCurrentUser = async (clerkId: string) => {
  try {
    return await prisma.user.findUnique({
      where: { clerkId },
      include: {
        organization: {
          select: { id: true, name: true },
        },
      },
    });
  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
};

export const syncUsersInBatch = async (
  users: Array<{ user: User; orgId: string; orgRole: string }>
): Promise<void> => {
  const batchSize = 10;
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    await Promise.allSettled(
      batch.map(({ user, orgId, orgRole }) =>
        syncUserAsync(user, orgId, orgRole)
      )
    );
  }
};

export const clearOrgCache = (): void => {
  orgCache.clear();
};
