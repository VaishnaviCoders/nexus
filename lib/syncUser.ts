import prisma from '@/lib/db';
import { Role } from '@prisma/client';

export const syncUser = async (user: any, orgId: string, orgRole: string) => {
  // const roleMap: Record<string, 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'> = {
  const roleMap: Record<string, Role> = {
    'org:admin': 'ADMIN',
    'org:teacher': 'TEACHER',
    'org:student': 'STUDENT',
    'org:parent': 'PARENT',
  };

  const role = orgRole && roleMap[orgRole] ? roleMap[orgRole] : 'STUDENT';

  console.log('User Role from Clerk:', role);

  if (!user.organizationId && !orgId) {
    throw new Error('Organization ID is missing.');
  }

  try {
    // const organization = await prisma.organization.findUnique({
    //   where: { id: user.organizationId || orgId },
    // });

    console.log('Environment:', process.env.NODE_ENV);
    console.log('Database URL:', process.env.DATABASE_URL);

    console.log('Finding organization with ID:', user.organizationId || orgId);

    // if (!organization) {
    //   console.error(
    //     `Organization not found with ID: ${user.organizationId || orgId}`
    //   );
    //   throw new Error('Organization not found');
    // }

    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        profileImage: user.imageUrl,
        role,
        updatedAt: new Date(),
        organizationId: orgId,
      },
      create: {
        id: user.id,
        clerkId: user.id,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.emailAddresses[0]?.emailAddress,
        profileImage: user.imageUrl,
        role,
        createdAt: new Date(user.createdAt),
        organizationId: orgId,
      },
    });

    console.log(`User synced: ${user.id} with Organization Id ${orgId} `);
  } catch (error) {
    console.error('Error syncing Clerk user to DB:', error);
    throw new Error('Failed to sync Clerk user');
  }
};
