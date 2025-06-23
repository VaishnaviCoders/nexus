import { currentUser } from '@clerk/nextjs/server';
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
