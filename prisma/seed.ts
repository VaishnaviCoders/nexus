import prisma from '../lib/db';

async function test() {
  try {
    // const users = await prisma.user.findMany();
    // console.log(users);

    // await prisma.subject.create({
    //   data: {
    //     name: 'Mathematics',
    //     code: 'MATH',
    //     description: 'Mathematics',
    //     organizationId: 'org_2yikjYDIq5D8AjIyLvq2T6K5jZF',
    //     createdAt: new Date(),
    //   },
    // });

    // const subjects = await prisma.subject.findMany();

    // await prisma.teachingAssignment.create({
    //   data: {
    //     teacherId: 'cmc8vdrfm0003vhp4h0gch3iz',
    //     subjectId: 'cmc943w5y0001vh5ofpt4u2pb',
    //     gradeId: 'cmc3t7zso0003vhr8sr1hsy85',
    //     organizationId: 'org_2yikjYDIq5D8AjIyLvq2T6K5jZF',
    //     sectionId: 'cmc3tb2xn0007vhr8bf7gsi50',
    //     academicYear: '2024-25',
    //     status: 'PENDING',
    //   },
    // });
    // console.log(subjects);

    // co
    // const data = await prisma.teachingAssignment.findMany({
    //   where: {
    //     subject: {
    //       name: 'Mathematics',
    //     },
    //   },
    //   include: {
    //     teacher: { include: { user: true } },
    //   },
    // });
    // console.log('data', data);

    // const paymentData = await prisma.feePayment.findUnique({
    //   where: {
    //     receiptNumber: 'RCP-1750505949490-499-cmc65vvn30007vhwwlluht7lz',
    //   },
    // });
    // console.log('paymentData', paymentData);

    // const studentsWithFees = await prisma.student.findMany({
    //   where: {
    //     section: {
    //       TeachingAssignment: {
    //         some: {
    //           teacherId: 'cmc8vdrfm0003vhp4h0gch3iz',
    //           status: 'ASSIGNED',
    //         },
    //       },
    //     },
    //     Fee: {
    //       some: {
    //         status: { not: 'PAID' },
    //       },
    //     },
    //   },
    //   include: {
    //     Fee: true,
    //     section: true,
    //     grade: true,
    //   },
    // });

    // console.log('studentsWithFees', studentsWithFees);

    // await prisma.teacherProfile.upsert({
    //   where: {
    //     teacherId: 'cmc8vdrfm0003vhp4h0gch3iz',
    //   },
    //   update: {},
    //   create: {
    //     teacherId: 'cmc8vdrfm0003vhp4h0gch3iz',
    //     contactEmail: '',
    //     contactPhone: '',
    //     address: '',
    //     city: '',
    //     state: '',
    //     dateOfBirth: new Date('2000-01-01'),
    //     qualification: '',
    //     experienceInYears: 0,
    //     resumeUrl: '',
    //     joinedAt: new Date(),
    //     bio: '',
    //     teachingPhilosophy: '',
    //     specializedSubjects: [],
    //     preferredGrades: [],
    //     idProofUrl: '',
    //     linkedinPortfolio: '',
    //     languagesKnown: [],
    //     certificateUrls: [],
    //   },
    // });

    const feePayment = await prisma.feePayment.findUnique({
      where: {
        id: 'cmcic6tco007tvhrk5la6hctm',
      },
    });

    console.log('feePayment', feePayment);
  } catch (error) {
    console.error('Prisma error:', error);
  }
}

test();
