import { auth, currentUser } from '@clerk/nextjs/server';
import { redis } from '@/lib/redis';
import { cache } from 'react';

const TTL = 60 * 5; // cache for 5 mins

// export const getCurrentUserId = async () => {
//   const start = performance.now();

//   const user = await currentUser();
//   if (!user || !user.id) {
//     throw new Error('No user found');
//   }

//   const cacheKey = `currentUser:${user.id}`;

//   try {
//     const cached = await redis.get(cacheKey);

//     if (cached && typeof cached === 'string') {
//       const parsed = JSON.parse(cached);
//       const end = performance.now();
//       console.log(
//         `🟢 Redis HIT – getCurrentUserId took ${(end - start).toFixed(2)} ms`
//       );
//       return parsed;
//     }
//   } catch (err) {
//     console.warn('⚠️ Redis parse error:', err);
//   }

//   const end = performance.now();
//   console.log(
//     `🟡 Redis MISS – getCurrentUserId took ${(end - start).toFixed(2)} ms`
//   );

//   // Only store specific data if you don't need the entire user object
//   const userData = {
//     id: user.id,
//     email: user.emailAddresses?.[0]?.emailAddress,
//     firstName: user.firstName,
//     lastName: user.lastName,
//   };

//   await redis.set(cacheKey, JSON.stringify(userData), { ex: TTL });

//   return userData;
// };

export const getCurrentUserId = cache(async () => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error('No user found');
  }

  return user.id;
});

type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

const roleMap: Record<string, Role> = {
  'org:admin': 'ADMIN',
  'org:teacher': 'TEACHER',
  'org:student': 'STUDENT',
  'org:parent': 'PARENT',
};

export const getCurrentUser = async () => {
  const user = await currentUser();
  const { orgRole } = await auth();

  if (!user || !user.id) {
    throw new Error('No user found');
  }

  // Map Clerk's orgRole (can be undefined!)
  const role: Role =
    orgRole && orgRole in roleMap ? roleMap[orgRole] : 'STUDENT';

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses?.[0]?.emailAddress ?? null,
    imageUrl: user.imageUrl,
    username: user.username,
    role, // <- your resolved Role here!
    metadata: user.publicMetadata,
  };
};

export const getAuthContext = cache(async () => {
  const { userId, orgId, orgRole, orgSlug } = await auth();
  if (!userId) throw new Error('Not authenticated');
  if (!orgId) throw new Error('No organization ID found');

  const user = await currentUser();
  if (!user) throw new Error('User not found');

  const role: Role =
    orgRole && orgRole in roleMap ? roleMap[orgRole] : 'STUDENT';

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses?.[0]?.emailAddress ?? null,
      imageUrl: user.imageUrl,
      username: user.username,
      metadata: user.publicMetadata,
    },
    org: {
      id: orgId,
      role,
      slug: orgSlug,
    },
  };
});
