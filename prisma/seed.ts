// test-prisma.ts

import prisma from '@/lib/db';

async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log(users);
  } catch (error) {
    console.error('Prisma error:', error);
  }
}

test();
