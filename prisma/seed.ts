'use server';

// import { getDefaultAcademicYear } from '../lib/academicYear';
import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

function randomDates() {
  const start = new Date();
  start.setDate(start.getDate() + Math.floor(Math.random() * 30));

  const end = new Date(start);
  end.setDate(start.getDate() + Math.floor(Math.random() * 7) + 1);

  return { start, end }; // <- plain Date values
}

async function generateNotices() {
  // const currentYear = await getDefaultAcademicYear();

  const notices = [];
  for (let i = 0; i < 1230; i++) {
    const { start, end } = randomDates();
    notices.push({
      noticeType: 'EVENT',
      title: `Event ${i + 1}`,
      startDate: start,
      endDate: end,
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      isNoticeApproved: true,
      isDraft: false,
      isPublished: true,
      emailNotification: false,
      pushNotification: false,
      WhatsAppNotification: false,
      smsNotification: false,
      targetAudience: ['ADMIN'],
      publishedBy: 'SYSTEM SEED',
      academicYearId: 'cmd4i9bq60007vh6spt4lp4er',
      organizationId: 'org_2yikjYDIq5D8AjIyLvq2T6K5jZF',
    });
  }
  return notices;
}

const main = async () => {
  console.log('🌱 Seeding notices...');

  const notices = await generateNotices();

  const result = await prisma.notice.createMany({
    data: notices,
    skipDuplicates: false,
  });
  console.log(`✅ Created ${result.count} notices successfully!`);

  const sampleNotices = await prisma.notice.findMany({
    take: 5,
    select: {
      id: true,
      title: true,
      noticeType: true,
      isPublished: true,
      targetAudience: true,
    },
  });

  console.log('📋 Sample notices created:');
  sampleNotices.forEach((notice: any, index: number) => {
    console.log(
      `${index + 1}. ${notice.title} (${notice.noticeType}) - Published: ${notice.isPublished}`
    );
  });
};

main()
  .then(() => {
    console.log('Process completed');
  })
  .catch((e) => console.log(e));

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
// const feePayment = await prisma.feePayment.findUnique({
//   where: {
//     id: 'cmcic6tco007tvhrk5la6hctm',
//   },
// });
// console.log('feePayment', feePayment);
