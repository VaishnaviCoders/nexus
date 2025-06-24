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

    const paymentData = await prisma.feePayment.findUnique({
      where: {
        receiptNumber: 'RCP-1750505949490-499-cmc65vvn30007vhwwlluht7lz',
      },
    });
    console.log('paymentData', paymentData);
  } catch (error) {
    console.error('Prisma error:', error);
  }
}

test();
