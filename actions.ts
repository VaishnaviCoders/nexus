'use server';

import prisma from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { Role } from '@prisma/client';

export const syncClerk = async () => {
  const user = await currentUser();

  if (!user) {
    console.error('No user found during Clerk sync');
    return null;
  }

  const UserPublicMetadataRole =
    (user.publicMetadata.role as Role) || 'STUDENT';

  try {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        profileImage: user.imageUrl,
        role: UserPublicMetadataRole,
      },
      create: {
        id: user.id,
        clerkId: user.id,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.emailAddresses[0].emailAddress,
        profileImage: user?.imageUrl,
        role: UserPublicMetadataRole,
        createdAt: new Date(user.createdAt),
      },
    });
    console.log(`User synced: ${user.id}`);
  } catch (error) {
    console.error('Error syncing Clerk user to DB:', error);
    throw new Error('Failed to sync Clerk user');
  }
};
