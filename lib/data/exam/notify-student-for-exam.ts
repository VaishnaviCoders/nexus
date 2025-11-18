'use server';

import prisma from '@/lib/db';
import { Knock } from '@knocklabs/node';
import { revalidatePath } from 'next/cache';

/**
 * Sends enrollment reminder notifications to students for a specific exam
 * Uses Knock for multi-channel notifications (email, push, in-app)
 */
export async function notifyStudentsForExamEnrollment(
  studentIds: string[],
  examId: string
) {
  try {
    console.log('Sending notification to students:', studentIds);
    const knock = new Knock(process.env.KNOCK_API_SECRET);

    // Fetch exam details with related data
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        examSession: true,
        subject: true,
        organization: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!exam) {
      return {
        success: false,
        error: 'Exam not found.',
      };
    }

    const notifiedStudents: string[] = [];
    const failedStudents: string[] = [];

    // Process each student
    for (const studentId of studentIds) {
      try {
        // Fetch student details
        const student = await prisma.student.findUnique({
          where: { id: studentId },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            rollNumber: true,
          },
        });

        if (!student) {
          console.warn(`Student ${studentId} not found`);
          failedStudents.push(studentId);
          continue;
        }

        // Check if already enrolled
        const existingEnrollment = await prisma.examEnrollment.findUnique({
          where: {
            studentId_examId: {
              studentId,
              examId,
            },
          },
        });

        if (existingEnrollment) {
          console.log(
            `Student ${studentId} is already enrolled in exam ${examId}`
          );
          continue;
        }

        // Prepare notification data
        const enrollmentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/exams/${examId}/enroll`;
        const examDetailsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/exams/${examId}`;

        console.log('Sending notification to student:', student);
        // Send notification via Knock
        await knock.workflows.trigger('exam-enroll-reminder', {
          recipients: [
            {
              id: student.id,
              email: student.email,
              name: `${student.firstName} ${student.lastName}`,
            },
          ],
          data: {
            // Student info
            studentName: `${student.firstName} ${student.lastName}`,
            studentEmail: student.email,
            rollNumber: student.rollNumber || 'N/A',

            // Exam info
            examTitle: exam.title,
            examId: exam.id,
            subjectName: exam.subject.name,
            subjectCode: exam.subject.code,
            examSession: exam.examSession.title,

            // Dates and timing
            startDate: exam.startDate.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            endDate: exam.endDate.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            duration: `${exam.durationInMinutes || 60} minutes`,

            // Additional info
            // grade: exam.grade?.grade || 'N/A',
            // section: exam.section?.name || 'N/A',
            organizationName: exam.organization?.name || 'School',
            maxMarks: exam.maxMarks,
            passingMarks: exam.passingMarks || Math.ceil(exam.maxMarks * 0.33),

            // Action URLs
            enrollmentUrl,
            examDetailsUrl,

            // UI elements
            ctaText: 'Enroll Now',
            ctaUrl: enrollmentUrl,
          },
          actor: {
            id: 'system',
            name: exam.organization?.name || 'School Administration',
          },
        });

        notifiedStudents.push(studentId);
        console.log(
          `Notification sent to student ${studentId} for exam ${examId}`
        );

        // Optional: Log notification in database
        // await prisma.notificationLog
        //   .create({
        //     data: {
        //       userId: studentId,
        //       type: 'EXAM_ENROLLMENT_REMINDER',
        //       title: `Enroll for ${exam.title}`,
        //       message: `You have been invited to enroll for ${exam.title} - ${exam.subject.name}. Please enroll before ${exam.startDate.toLocaleDateString()}.`,
        //       link: enrollmentUrl,
        //       organizationId: exam.organizationId,
        //     },
        //   })
        //   .catch((err) => {
        //     console.warn('Failed to create notification record:', err);
        //   });
      } catch (error) {
        console.error(`Failed to notify student ${studentId}:`, error);
        failedStudents.push(studentId);
      }
    }

    // Revalidate relevant pages
    revalidatePath(`/dashboard/exams/${examId}`);
    revalidatePath(`/dashboard/admin/exams/${examId}`);

    return {
      success: true,
      notifiedCount: notifiedStudents.length,
      failedCount: failedStudents.length,
      totalRequested: studentIds.length,
      notifiedStudents,
      failedStudents,
    };
  } catch (error) {
    console.error('Error sending exam enrollment notifications:', error);
    return {
      success: false,
      error: 'Failed to send notifications. Please try again.',
    };
  }
}

/**
 * Sends a reminder to students who haven't enrolled yet (deadline approaching)
 */
// export async function sendExamEnrollmentDeadlineReminder(examId: string) {
//   try {
//     const exam = await prisma.exam.findUnique({
//       where: { id: examId },
//       include: {
//         grade: true,
//         section: true,
//         subject: true,
//         examSession: true,
//       },
//     });

//     if (!exam) {
//       return { success: false, error: 'Exam not found' };
//     }

//     // Get all students in the grade/section
//     const students = await prisma.user.findMany({
//       where: {
//         student: {
//           gradeId: exam.gradeId!,
//           sectionId: exam.sectionId!,
//         },
//       },
//       select: {
//         id: true,
//       },
//     });

//     // Filter out students who are already enrolled
//     const enrolledStudentIds = await prisma.examEnrollment.findMany({
//       where: { examId },
//       select: { studentId: true },
//     });

//     const enrolledIds = new Set(enrolledStudentIds.map((e) => e.studentId));
//     const notEnrolledStudentIds = students
//       .filter((s) => !enrolledIds.has(s.id))
//       .map((s) => s.id);

//     if (notEnrolledStudentIds.length === 0) {
//       return {
//         success: true,
//         message: 'All students are already enrolled',
//         notifiedCount: 0,
//       };
//     }

//     // Send reminders
//     const result = await notifyStudentsForExamEnrollment(
//       notEnrolledStudentIds,
//       examId
//     );

//     return result;
//   } catch (error) {
//     console.error('Error sending deadline reminder:', error);
//     return {
//       success: false,
//       error: 'Failed to send deadline reminder',
//     };
//   }
// }

/**
 * Sends hall ticket availability notification to enrolled students
 */
// export async function notifyStudentsHallTicketIssued(
//   studentIds: string[],
//   examId: string
// ) {
//   try {
//     const knock = new Knock(process.env.KNOCK_API_SECRET);

//     const exam = await prisma.exam.findUnique({
//       where: { id: examId },
//       include: {
//         subject: true,
//         examSession: true,
//         organization: {
//           select: { name: true },
//         },
//       },
//     });

//     if (!exam) {
//       return { success: false, error: 'Exam not found' };
//     }

//     const notifiedCount = studentIds.length;

//     for (const studentId of studentIds) {
//       const student = await prisma.user.findUnique({
//         where: { id: studentId },
//         select: {
//           id: true,
//           email: true,
//           firstName: true,
//           lastName: true,
//         },
//       });

//       if (!student) continue;

//       const hallTicketUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/exams/${examId}/hall-ticket`;

//       await knock.workflows.trigger('exam-hall-ticket-issued', {
//         recipients: [
//           {
//             id: student.id,
//             email: student.email,
//             name: `${student.firstName} ${student.lastName}`,
//           },
//         ],
//         data: {
//           studentName: `${student.firstName} ${student.lastName}`,
//           examTitle: exam.title,
//           subjectName: exam.subject.name,
//           startDate: exam.startDate.toLocaleDateString('en-IN'),
//           hallTicketUrl,
//           ctaText: 'Download Hall Ticket',
//           ctaUrl: hallTicketUrl,
//         },
//       });

//       // Create in-app notification
//       await prisma.notificationLog
//         .create({
//           data: {
//             userId: studentId,
//             type: 'HALL_TICKET_ISSUED',
//             title: 'Hall Ticket Available',
//             message: `Your hall ticket for ${exam.title} is now available. Please download and bring it to the exam.`,
//             link: hallTicketUrl,
//             organizationId: exam.organizationId,
//           },
//         })
//         .catch((err) => console.warn('Failed to create notification:', err));
//     }

//     revalidatePath(`/dashboard/exams/${examId}`);

//     return {
//       success: true,
//       notifiedCount,
//     };
//   } catch (error) {
//     console.error('Error notifying hall ticket issued:', error);
//     return {
//       success: false,
//       error: 'Failed to send hall ticket notifications',
//     };
//   }
// }
