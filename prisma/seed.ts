import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import {
  NoticeType,
  LeadSource,
  LeadStatus,
  LeadPriority,
  LeadCommunicationPreference,
  NoticeStatus,
  NoticePriority,
} from '../generated/prisma/enums';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';

/* ----------------------------------------------
 * Prisma Setup
 * ---------------------------------------------- */
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

/* ----------------------------------------------
 * Constants
 * ---------------------------------------------- */
const ORGANIZATION_ID = 'org_30WQlEXgBepgHNrZYoYzx0xlqJg';
const ACADEMIC_YEAR_ID = 'cmff3tqm90003vengnf504200';

const organizationIds = [ORGANIZATION_ID];
const academicYearIds = [ACADEMIC_YEAR_ID];
const userIds = [
  'user_30XKQEOZdJramwXYJjub34hJHSX',
  'user_30XR4ETWH7g6hEal8p6hfpBk5Ax',
];

const requirementsOptions = [
  'Transportation',
  'Hostel',
  'Scholarship',
  'Sports Facility',
  'Day Care',
  'After School',
];

const budgets = ['50k-1L', '1L-2L', '2L-3L', '3L+'];

const closedLeadStatuses: LeadStatus[] = [
  'NOT_INTERESTED',
  'INVALID',
  'UNRESPONSIVE',
  'LOST',
];

/* ----------------------------------------------
 * Utility Functions
 * ---------------------------------------------- */
function randomDates() {
  const start = faker.date.soon({ days: 30 });
  const end = faker.date.soon({ days: faker.number.int({ min: 1, max: 7 }), refDate: start });

  return { start, end };
}

function randomItem<T>(arr: readonly T[]): T {
  return faker.helpers.arrayElement(arr);
}

function randomMultiple<T>(arr: readonly T[]): T[] {
  return faker.helpers.arrayElements(arr, {
    min: 1,
    max: 3,
  });
}

function randomBoolean(){
  return faker.datatype.boolean();
}
/* ----------------------------------------------
 * Notice Seeder
 * ---------------------------------------------- */
async function generateNotices(count: number) {
  console.log(`🌱 Creating ${count} notices...`);

  const notices = Array.from({ length: count }).map((_, i) => {
    const { start, end } = randomDates();

    return {
      noticeType: randomItem(Object.values(NoticeType)),
      title: `Event ${i + 1} ${faker.lorem.words(5)}`,
      startDate: start,
      endDate: end,
      status: randomItem(Object.values(NoticeStatus)),
      priority: randomItem(Object.values(NoticePriority)),
      summary: faker.lorem.sentence(),
      content: faker.lorem.paragraph(2),
      emailNotification: randomBoolean(),
      pushNotification: randomBoolean(),
      whatsAppNotification: randomBoolean(),
      smsNotification: randomBoolean(),
      targetAudience: ['ADMIN'],
      publishedBy: 'SYSTEM_SEED',
      academicYearId: randomItem(academicYearIds),
      organizationId: randomItem(organizationIds),
      createdBy: 'admin',
    };
  }); 

  await prisma.notice.createMany({ data: notices });
}

/* ----------------------------------------------
 * FeeSense Agent Seeder
 * ---------------------------------------------- */
async function initFeeSenseAgent() {
  console.log(`⚙️ Initializing FeeSense Agent...`);

  await prisma.feeSenseAgent.create({
    data: {
      organizationId: randomItem(organizationIds),
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
}

/* ----------------------------------------------
 * Lead Seeder
 * ---------------------------------------------- */
async function generateLeads(count: number) {
  console.log(`🌱 Creating ${count} leads...`);

  for (let i = 0; i < count; i++) {
    const status = randomItem(Object.values(LeadStatus));
    const isClosed = closedLeadStatuses.includes(status);

    await prisma.lead.create({
      data: {
        organizationId: randomItem(organizationIds),
        academicYearId: randomItem(academicYearIds),

        studentName: faker.person.fullName(),
        parentName: faker.person.fullName(),

        phone: faker.phone.number({ style: 'national' }),
        whatsappNumber: faker.phone.number({ style: 'national' }),
        email: faker.internet.email(),

        enquiryFor: faker.word.words({ count: { min: 1, max: 3 } }),
        currentSchool: faker.company.name(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        pincode: faker.location.zipCode('41####'),

        source: randomItem(Object.values(LeadSource)),
        status,
        priority: randomItem(Object.values(LeadPriority)),
        score: faker.number.int({ min: 0, max: 100 }),

        assignedToUserId: faker.helpers.maybe(() => randomItem(userIds), {
          probability: 0.5,
        }),

        assignedAt: faker.date.recent({ days: 10 }),
        nextFollowUpAt: faker.helpers.maybe(() => faker.date.soon({ days: 10 }), {
          probability: 0.5,
        }),

        lastContactedAt: faker.helpers.maybe(
          () => faker.date.recent({ days: 5 }),
          { probability: 0.5 }
        ),

        followUpCount: faker.number.int({ min: 0, max: 6 }),

        convertedAt:
          status === 'CONVERTED'
            ? faker.date.recent({ days: 15 })
            : null,

        // convertedToStudentId:
        //   status === 'CONVERTED'
        //     ? `student_${faker.string.uuid()}`
        //     : null,

        notes: faker.lorem.sentence(),
        requirements: randomMultiple(requirementsOptions),

        budgetRange: faker.helpers.maybe(
          () => randomItem(budgets),
          { probability: 0.4 }
        ),

        closureReason: isClosed ? faker.lorem.sentence() : null,

        createdByUserId: faker.helpers.maybe(
          () => randomItem(userIds),
          { probability: 0.8 }
        ),

        createdAt: faker.date.past({ years: 1 }),
      },
    });
  }
}

/* ----------------------------------------------
 * Main Runner
 * ---------------------------------------------- */
async function main() {
  console.log(`\n🚀 Seeding Started...\n`);

  // await generateNotices(1000);
  // await initFeeSenseAgent();
  // await generateLeads(500); // <-- specify count

  
  console.log(`\n✅ Seeding Completed Successfully!\n`);
}

/* ----------------------------------------------
 * Start
 * ---------------------------------------------- */
main().catch((err) => {
  console.error('❌ Seeding Error:', err);
});



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
