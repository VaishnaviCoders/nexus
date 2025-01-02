'use server';

import prisma from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

export const syncClerk = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }
  console.log('syncing user', user);

  await prisma.user.upsert({
    where: {
      clerkId: user.id,
    },
    update: {
      profileImage: user.imageUrl,
    },
    create: {
      clerkId: user.id,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.emailAddresses[0].emailAddress,
      profileImage: user?.imageUrl,
      role: 'STUDENT',
      createdAt: new Date(user.createdAt),
    },
  });
};
