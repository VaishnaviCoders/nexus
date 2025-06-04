import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export async function getAllUsersWithRoleAction() {
  const organizationId = await getOrganizationId();
  const users = await prisma.user.findMany({
    where: {
      organizationId: organizationId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });
  return users;
}
