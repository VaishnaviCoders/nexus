import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const { orgId } = await auth();
  if (!orgId) throw new Error('No organization found during Seed');
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

  await prisma.student.create({
    data: {
      // address: '123 Main St',
      firstName: 'Alice',
      lastName: 'Prisma',
      middleName: 'M',
      motherName: 'Mother',
      fullName: 'Alice Prisma',
      dateOfBirth: new Date(),
      // profileImage: '',
      whatsAppNumber: '123456789',
      sectionId: 'cm6qocmag0005vh54134m9fuo',
      rollNumber: '123456789',
      email: 'alice@prisma.io',
      // parents: null || '[]',
      emergencyContact: 'Emergency Contact',
      phoneNumber: '32434323',
      gradeId: 'cm6qoblkn0001vh54lspfal3f',

      // sectionId: 'cm6qocmag0005vh54134m9fuo',
      organizationId: orgId,
      // documents: null || '[]',

      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log('Seeded Organization');
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
