import prisma from '@/lib/db';
import { User } from '@clerk/nextjs/server';
import { Role } from '@prisma/client';

// Role mapping
const roleMap: Record<string, Role> = {
  'org:admin': 'ADMIN',
  'org:teacher': 'TEACHER',
  'org:student': 'STUDENT',
  'org:parent': 'PARENT',
};

// Cache for organization validation to avoid repeated DB calls
const orgCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  valid: boolean;
  timestamp: number;
}

const isValidOrganization = async (orgId: string): Promise<boolean> => {
  const now = Date.now();
  const cached = orgCache.get(orgId) as CacheEntry | undefined;

  // Return cached result if still valid
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.valid;
  }

  try {
    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { id: true }, // Only select id for performance
    });

    const isValid = !!organization;
    orgCache.set(orgId, { valid: isValid, timestamp: now });
    return isValid;
  } catch (error) {
    console.error(`Error validating organization ${orgId}:`, error);
    return false;
  }
};

// Synchronous version - blocks rendering (use sparingly)
export const syncUser = async (
  user: User,
  orgId: string,
  orgRole: string
): Promise<void> => {
  const role = orgRole && roleMap[orgRole] ? roleMap[orgRole] : 'STUDENT';

  if (!orgId) {
    throw new Error('Organization ID is missing.');
  }

  // Validate organization exists
  const isOrgValid = await isValidOrganization(orgId);
  if (!isOrgValid) {
    console.error(`Organization not found with ID: ${orgId}`);
    throw new Error('Organization not found');
  }

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error('User email is missing');
  }

  try {
    await prisma.user.upsert({
      where: { email },
      update: {
        profileImage: user.imageUrl,
        role,
        updatedAt: new Date(),
        organizationId: orgId,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        clerkId: user.id,
      },
      create: {
        id: user.id,
        clerkId: user.id,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email,
        profileImage: user.imageUrl,
        role,
        createdAt: new Date(user.createdAt),
        organizationId: orgId,
      },
    });

    console.log(`User synced: ${user.id} with Organization Id ${orgId}`);
  } catch (error) {
    console.error('Error syncing Clerk user to DB:', error);
    throw new Error('Failed to sync Clerk user');
  }
};

// Asynchronous version - doesn't block rendering
export const syncUserAsync = async (
  user: User,
  orgId: string,
  orgRole: string
): Promise<void> => {
  try {
    await syncUser(user, orgId, orgRole);
  } catch (error) {
    // Log error but don't throw to avoid blocking UI
    console.error('Background user sync failed:', error);

    // Optionally, you could add the sync to a queue for retry
    // await addToSyncQueue({ userId: user.id, orgId, orgRole });
  }
};

// Utility function to get current user from database
export const getCurrentUser = async (clerkId: string) => {
  try {
    return await prisma.user.findUnique({
      where: { clerkId },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

// Batch sync function for multiple users (useful for webhooks)
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

// Clear organization cache (call this when organizations are updated)
export const clearOrgCache = (): void => {
  orgCache.clear();
};
