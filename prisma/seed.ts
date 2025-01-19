import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      firstName: 'Alice',
      lastName: 'Prisma',
      role: 'STUDENT',
      organizationId: 'org_1',
      clerkId: 'alice@prisma.io',
      createdAt: new Date(),
      updatedAt: new Date(),
      profileImage: '',
    },
  });
  console.log('Seeded user');

  // await prisma.organization.upsert({
  //   where: { id: 'org_1' },
  //   update: {},
  //   create: {
  //     id: 'org_1',
  //     name: 'School Nexus',
  //     organizationSlug: 'school-nexus',
  //     isActive: true,
  //     isPaid: false,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  // });
  // console.log('Seeded Organization');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
