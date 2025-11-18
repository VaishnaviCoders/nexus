import { Exam, PrismaClient } from '../generated/prisma/client';
import { NoticeType } from '../generated/prisma/enums';
// import { faker } from '@faker-js/faker';
// import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

// Create adapter
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
// Sample IDs for relations (adjust as needed)
const organizationIds = ['org_2yikjYDIq5D8AjIyLvq2T6K5jZF', 'org2', 'org3'];
const academicYearIds = ['cmd4i9bq60007vh6spt4lp4er', 'ay2026'];
const userIds = ['user1', 'user2', 'user3'];

// const prisma = new PrismaClient();

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
      noticeType: NoticeType.EVENT,
      title: `Event ${i + 1}`,
      startDate: start,
      endDate: end,
      summary: 'ssds',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      emailNotification: false,
      pushNotification: false,
      WhatsAppNotification: false,
      smsNotification: false,
      targetAudience: ['ADMIN'],
      publishedBy: 'SYSTEM SEED',
      academicYearId: 'cmd4i9bq60007vh6spt4lp4er',
      organizationId: 'org_2yikjYDIq5D8AjIyLvq2T6K5jZF',
      createdBy: 'admin',
    });
  }
  return notices;
}

async function seedLeads() {
  const closedStatuses = ['NOT_INTERESTED', 'INVALID', 'UNRESPONSIVE', 'LOST'];
  for (let i = 0; i < 100; i++) {
    // const status = getRandomEnum(leadStatuses);
    // const convertedToStudentId =
    //   status === 'CONVERTED' ? `student_${faker.string.uuid()}` : null;
    // const closureReason = closedStatuses.includes(status)
    //   ? faker.lorem.sentence()
    //   : null;
    // await prisma.lead.create({
    //   data: {
    //     organizationId: faker.helpers.arrayElement(organizationIds),
    //     academicYearId: faker.helpers.arrayElement(academicYearIds),
    //     studentName: faker.person.fullName(),
    //     parentName: faker.person.fullName(),
    //     phone: faker.phone.number('98########'),
    //     email: faker.internet.email(),
    //     whatsappNumber: faker.phone.number('98########'),
    //     enquiryFor: faker.word.words({ count: { min: 1, max: 3 } }),
    //     currentSchool: faker.company.name(),
    //     address: faker.location.streetAddress(),
    //     city: faker.location.city(),
    //     state: faker.location.state(),
    //     pincode: faker.location.zipCode('41####'),
    //     source: getRandomEnum(leadSources),
    //     status,
    //     priority: getRandomEnum(leadPriorities),
    //     score: faker.number.int({ min: 0, max: 100 }),
    //     assignedToUserId: faker.datatype.boolean()
    //       ? faker.helpers.arrayElement(userIds)
    //       : null,
    //     assignedAt: faker.date.recent({ days: 10 }),
    //     nextFollowUpAt: faker.datatype.boolean()
    //       ? faker.date.soon({ days: 10 })
    //       : null,
    //     lastContactedAt: faker.datatype.boolean()
    //       ? faker.date.recent({ days: 5 })
    //       : null,
    //     followUpCount: faker.number.int({ min: 0, max: 6 }),
    //     convertedAt:
    //       status === 'CONVERTED' ? faker.date.recent({ days: 15 }) : null,
    //     convertedToStudentId,
    //     notes: faker.lorem.sentence(),
    //     requirements: randomArr(requirementsOptions),
    //     budgetRange: faker.helpers.maybe(
    //       () => faker.helpers.arrayElement(budgets),
    //       { probability: 0.4 }
    //     ),
    //     closureReason,
    //     createdByUserId: faker.helpers.maybe(
    //       () => faker.helpers.arrayElement(userIds),
    //       { probability: 0.8 }
    //     ),
    //     createdAt: faker.date.past({ years: 1 }),
    //     // updatedAt: left to default (auto)
    //   },
    // });
  }
}

// ENUMS
const leadSources = [
  'WEBSITE',
  'GOOGLE_ADS',
  'FACEBOOK_ADS',
  'INSTAGRAM_ADS',
  'LINKEDIN_ADS',
  'EMAIL_MARKETING',
  'SEO_ORGANIC',
  'SOCIAL_MEDIA',
  'WALK_IN',
  'PHONE_CALL',
  'REFERRAL_PROGRAM',
  'EDUCATION_FAIR',
  'PRINT_MEDIA',
  'RADIO',
  'OUTDOOR_ADVERTISING',
  'AGENT_PARTNER',
  'ALUMNI_REFERRAL',
  'WEBINAR',
  'WORKSHOP',
  'WORD_OF_MOUTH',
] as const;

const leadStatuses = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'INTERESTED',
  'VISIT_SCHEDULED',
  'VISITED',
  'PROPOSAL_SENT',
  'NEGOTIATION',
  'CONVERTED',
  'NOT_INTERESTED',
  'UNRESPONSIVE',
  'INVALID',
  'LOST',
  'ON_HOLD',
] as const;

const leadPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT', 'VIP'] as const;

const requirementsOptions = [
  'Transportation',
  'Hostel',
  'Scholarship',
  'Sports Facility',
  'Day Care',
  'After School',
];

const budgets = ['50k-1L', '1L-2L', '2L-3L', '3L+'];

const communicationPreferences = [
  'EMAIL',
  'SMS',
  'WHATSAPP',
  'PHONE_CALL',
] as const;

function getRandomEnum<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomArr<T>(arr: T[]) {
  // return faker.helpers.arrayElements(arr, faker.number.int({ min: 1, max: 3 }));
}

const main = async () => {
  // console.log('🌱 Seeding notices...');
  // const notices = await generateNotices();
  await prisma.feeSenseAgent.create({
    data: {
      organizationId: 'org_2yikjYDIq5D8AjIyLvq2T6K5jZF',
      name: 'FeeSense AI Agent',
      description:
        'Intelligent fee collection assistant that analyzes payment patterns and sends personalized reminders',
      isActive: true,
      capabilities: [
        'Fetch all Fees Data and check if any fee is pending or not',
        'Analyzes payment patterns and identifies at-risk families',
        'Sends personalized payment reminders via email and SMS',
        'Generates daily reports with collection insights',
        'Schedules voice calls for high-priority overdue fees',
      ],
      lastRunAt: new Date(),
      successfulRuns: 0,
      failedRuns: 0,
      totalRuns: 0,
      createdAt: new Date(),
      riskScoreLowThreshold: 30,
      riskScoreMediumThreshold: 60,
      riskScoreHighThreshold: 80,
      maxNotificationAttempts: 3,
      voiceCallThreshold: 3,
      enableEmailReminders: true,
      enableSMSReminders: true,
      enableVoiceCalls: false,
      enableWhatsApp: false,
      runFrequency: 'DAILY',
      scheduleTime: '23:00',
    },
  });
  console.log('🌱 Seeding leads...');
  await seedLeads();
  console.log('✅ 100 Leads created!');

  // const result = await prisma.notice.createMany({
  //   data: notices,
  //   skipDuplicates: false,
  // });
  // console.log(`✅ Created ${result.count} notices successfully!`);
  // await prisma.scheduledJob.create({
  //   data: {
  //     organizationId: 'org_2yikjYDIq5D8AjIyLvq2T6K5jZF',
  //     type: 'FEE_REMINDER',
  //     scheduledAt: new Date('2025-07-22T22:00:00Z'),
  //     channels: ['EMAIL', 'WHATSAPP'], // must be array of enums
  //     data: {
  //       studentId: '...',
  //       feeId: '...',
  //     },
  //   },
  // });

  // const sampleNotices = await prisma.notice.findMany({
  //   take: 5,
  //   select: {
  //     id: true,
  //     title: true,
  //     noticeType: true,
  //     targetAudience: true,
  //   },
  // });

  // console.log('📋 Sample notices created:');
  // sampleNotices.forEach((notice: any, index: number) => {
  //   console.log(
  //     `${index + 1}. ${notice.title} (${notice.noticeType}) - Published: ${notice.isPublished}`
  //   );
  // });

  // const exams = await prisma.exam.findMany({
  //   where: {
  //     organizationId: 'org_2yikjYDIq5D8AjIyLvq2T6K5jZF',
  //   },
  // });

  // console.log('📋 Sample exams created:', exams);
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

// const exam:Exam = await prisma.exam.create({
//   data: {
//     title: 'Mathematics Midterm',

//     description:
//       'Class 10 Mathematics paper covering Algebra, Geometry, and Trigonometry',
//     examSessionId: examSession.id,
//     subject: {
//       connect: { id: 'subject-math-id' }, // Replace with real Subject ID
//     },
//     gradeId: 'grade-10-id', // Replace with real Grade ID
//     sectionId: 'section-a-id', // Replace with real Section ID
//     organizationId:"org_30WQlEXgBepgHNrZYoYzx0xlqJg",
//     maxMarks: 100,
//     passingMarks: 35,
//     weightage: 0.4,
//     evaluationType: 'EXAM',
//     mode: 'OFFLINE',
//     status: 'UPCOMING',
//     instructions: 'Answer all questions. Calculators not allowed.',
//     durationInMinutes: 180,
//     venue: 'Room 201',
//     supervisors: ['teacher-1-id', 'teacher-2-id'], // Replace with actual teacher IDs
//     startDate: new Date('2025-09-18T09:00:00.000Z'),
//     endDate: new Date('2025-09-18T12:00:00.000Z'),
//   },
// });
