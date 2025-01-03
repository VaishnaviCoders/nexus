import { auth } from '@clerk/nextjs/server';
import prisma from './db';

export async function getUserRole() {
  const { userId, redirectToSignIn } = await auth();
  // throw new Error('User is not Authenticated');
  if (!userId) return redirectToSignIn();

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });

  if (!user) throw new Error('User not found');
  // console.log('user', user);
  return user.role;
}
