// import ExamReminderEmail from '@/components/templates/email-templates/exams/exam-reminder-email';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { getISTDate } from '@/lib/utils';
import { addDays } from 'date-fns';
import { Resend } from 'resend';

// 1. Get Exam or ExamSession 7 days before
//    Extract Each Student Email , primary parent email
// 2. Start ScheduleJob For sending exam reminders 7 Days Before Exam Start Date / ExamSession  || with status PROCESSING
// 3. Execute Main Function
// 4. End ScheduleJob For sending exam reminders   || with status COMPLETED || if Failed || FAILED

export async function sendExamReminder7Days() {
  const organizationId = await getOrganizationId();

  const nowIST = getISTDate();
  const sevenDaysLater = addDays(nowIST, 8);
  const enrollments = await prisma.examEnrollment.findMany({
    where: {
      exam: {
        organizationId,
        startDate: sevenDaysLater,
      },
    },
    include: {
      exam: {
        include: {
          subject: true,
          organization: true,
          examEnrollment: {
            include: {
              student: {
                include: {
                  parents: { include: { parent: true } },
                },
              },
            },
          },
        },
      },
      student: {
        include: {
          parents: { include: { parent: true } },
        },
      },
    },
  });

  console.log('enrolled', enrollments);

  // if (!enrollments.length) return;

  // const exam = enrollments[0].exam;
  // const organization = exam.organization;
  // const emails = enrollments.flatMap((enrollment) => {
  //   const studentEmail = enrollment.student.email;
  //   const parentEmails = enrollment.student.parents.map((p) => p.parent.email);
  //   return [studentEmail, ...parentEmails];
  // });

  // const scheduledJob = await prisma.scheduledJob.create({
  //   data: {
  //     organizationId,
  //     type: 'EXAM',
  //     status: 'SCHEDULED',
  //     scheduledAt: nowIST,
  //     data: {
  //       title: `7-Day Reminder: ${exam.title}`,
  //       emails: emails,
  //       scheduledDateTime: nowIST,
  //       examDetails: {
  //         examTitle: exam.title,
  //         subjectName: exam.subject.name,
  //         startDate: exam.startDate,
  //         organizationName: organization.name,
  //         logo: organization.logo,
  //         supportEmail: organization.contactEmail,
  //         enrollments: exam.examEnrollment.map((e) => ({
  //           studentName: e.student.firstName + '' + e.student.lastName,
  //           studentEmail: e.student.email,
  //           parentEmails: e.student.parents.map((p) => p.parent.email),
  //         })),
  //       },
  //     },
  //   },
  // });

  // await inngest.send({
  //   name: 'exam/reminder.scheduled',
  //   id: 'exam-scheduled-reminder',
  //   data: {
  //     emails,
  //     scheduledDateTime: nowIST,
  //     jobId: scheduledJob.id,
  //   },
  // });
}

export async function sendEmailExamReminder(emails: string[]) {
  console.log('Sending exam reminders...', emails);

  const resend = new Resend(process.env.RESEND_API_KEY!);
  // const { data, error } = await resend.emails.send({
  //   from: 'no-reply@shiksha.cloud',
  //   to: emails,
  //   subject: '',
  //   react: ExamReminderEmail({
  //     examTitle: 'Exam Reminder',
  //     firstName: 'Student',
  //     lastName: '',
  //     subject: 'Mathematics',
  //     supervisors: ['John Doe', 'Jane Smith'],
  //     organization: {
  //       organizationName: 'Shiksha School',
  //       organizationEmail: 'info@shiksha.cloud',
  //       organizationPhone: '+91-1234567890',
  //     },
  //     startDate: new Date(),
  //     endDate: new Date(),
  //     durationInMinutes: 180,
  //     venue: 'Main Hall',
  //     maxMarks: 100,
  //     passingMarks: 35,
  //     mode: 'OFFLINE',
  //     instructions: 'Please bring your admit card and arrive 30 minutes early.',
  //   }),
  // });
  return { success: true };
}

export async function sendExamReminder12Hours() {}
