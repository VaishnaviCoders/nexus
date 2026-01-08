// app/dashboard/exams/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getOrganizationId } from '@/lib/organization';
import { getCurrentUserId } from '@/lib/user';
import { getCurrentUserByRole } from '@/lib/auth';
import { AdminExamManagementPage } from '@/components/dashboard/exam/AdminExamManagementPage';
import { ExamDetailsPage } from '@/components/dashboard/exam/ExamDetailsPage';
import prisma from '@/lib/db';

export default async function UnifiedExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: examId } = await params;
  const organizationId = await getOrganizationId();
  const userId = await getCurrentUserId();
  const { role } = await getCurrentUserByRole();

  // Fetch exam first to check if it exists
  const exam = await prisma.exam.findFirst({
    where: { id: examId, organizationId },
    include: {
      subject: {
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
          organizationId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      examSession: {
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
        },
      },
      organization: {
        select: {
          name: true,
          logo: true,
          contactEmail: true,
          contactPhone: true,
          website: true,
        },
      },
    },
  });

  if (!exam) {
    return notFound();
  }

  // Fetch grade and section separately
  const [grade, section] = await Promise.all([
    prisma.grade.findUnique({
      where: { id: exam.gradeId },
      select: {
        id: true,
        grade: true,
      },
    }),
    prisma.section.findUnique({
      where: { id: exam.sectionId },
      select: {
        id: true,
        name: true,
        classTeacher: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    }),
  ]);

  if (!grade || !section) {
    throw new Error('Grade or section not found');
  }

  // ========================================
  // ADMIN / TEACHER VIEW
  // ========================================
  if (role === 'ADMIN' || role === 'TEACHER') {
    const [enrolledStudents, allGradeStudents, examResults, hallTickets] =
      await Promise.all([
        // Fetch enrolled students
        prisma.examEnrollment.findMany({
          where: { examId },
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                rollNumber: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            student: {
              rollNumber: 'asc',
            },
          },
        }),

        // Fetch all students from grade and section
        prisma.student.findMany({
          where: {
            gradeId: exam.gradeId,
            sectionId: exam.sectionId,
            organizationId,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            rollNumber: true,
            profileImage: true,
          },
          orderBy: {
            rollNumber: 'asc',
          },
        }),

        // Fetch exam results
        prisma.examResult.findMany({
          where: { examId },
          select: {
            id: true,
            studentId: true,
            obtainedMarks: true,
            percentage: true,
            gradeLabel: true,
            remarks: true,
            isPassed: true,
            isAbsent: true,
          },
        }),

        // Fetch hall tickets
        prisma.hallTicket.findMany({
          where: { examId },
          select: {
            id: true,
            studentId: true,
            pdfUrl: true,
            generatedAt: true,
          },
        }),
      ]);

    // Transform enrollments
    const enrollments = enrolledStudents.map((enrollment) => ({
      id: enrollment.id,
      studentId: enrollment.studentId,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      hallTicketIssued: enrollment.hallTicketIssued,
    }));

    // Transform students
    const students = allGradeStudents.map((student) => ({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      rollNumber: student.rollNumber,
      profileImage: student.profileImage,
    }));

    // Transform results
    const results = examResults.map((result) => ({
      id: result.id,
      studentId: result.studentId,
      obtainedMarks: result.obtainedMarks,
      percentage: result.percentage,
      gradeLabel: result.gradeLabel,
      remarks: result.remarks,
      isPassed: result.isPassed,
      isAbsent: result.isAbsent,
    }));

    // Transform hall tickets
    const hallTicketsData = hallTickets.map((ticket) => ({
      id: ticket.id,
      studentId: ticket.studentId,
      pdfUrl: ticket.pdfUrl,
      generatedAt: ticket.generatedAt,
    }));

    return (
      <AdminExamManagementPage
        exam={{
          id: exam.id,
          title: exam.title,
          maxMarks: exam.maxMarks,
          passingMarks: exam.passingMarks,
          startDate: exam.startDate,
          endDate: exam.endDate,
          status: exam.status,
          mode: exam.mode,
          isResultsPublished: exam.isResultsPublished,
          durationInMinutes: exam.durationInMinutes,
          gradeId: exam.gradeId,
          sectionId: exam.sectionId,
          subject: exam.subject,
          examSession: exam.examSession,
          grade: grade!,
          section: section!,
        }}
        students={students}
        enrollments={enrollments}
        results={results}
        hallTickets={hallTicketsData}
      />
    );
  }

  // ========================================
  // STUDENT VIEW
  // ========================================

  const student = await prisma.student.findUnique({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      gradeId: true,
      sectionId: true,
    },
  });
  if (!student) {
    throw new Error('Student not found');
  }

  // Security Check: Ensure student belongs to the exam's grade/section
  if (student.gradeId !== exam.gradeId || student.sectionId !== exam.sectionId) {
    return notFound();
  }

  const [enrollment, result, hallTicket, totalEnrolled, allExamResults] = await Promise.all([
    // Student's enrollment
    prisma.examEnrollment.findUnique({
      where: {
        studentId_examId: {
          studentId: student.id,
          examId,
        },
      },
    }),

    // Student's result
    prisma.examResult.findUnique({
      where: {
        examId_studentId: {
          examId,
          studentId: student.id,
        },
      },
    }),

    // Student's hall ticket
    prisma.hallTicket.findUnique({
      where: {
        studentId_examId: {
          studentId: student.id,
          examId,
        },
      },
      include: {
        organization: {
          select: {
            name: true,
            logo: true,
            contactEmail: true,
            contactPhone: true,
            website: true,
          },
        },
        student: {
          select: {
            firstName: true,
            lastName: true,
            rollNumber: true,
            profileImage: true,
            email: true,
            phoneNumber: true,
            grade: {
              select: {
                grade: true,
              },
            },
            section: {
              select: {
                name: true,
              },
            },
          },
        },
        examSession: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            createdAt: true,
            updatedAt: true,
            academicYearId: true,
            createdBy: true,
            description: true,
          },
        },
        exam: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            venue: true,
            mode: true,
            durationInMinutes: true,
            subject: {
              select: {
                name: true,
                code: true,
                description: true,
                organizationId: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    }),

    // Total enrollments for statistics
    prisma.examEnrollment.count({
      where: { examId },
    }),

    // All results for statistics (only if results are published)
    exam.isResultsPublished
      ? prisma.examResult.findMany({
        where: { examId },
        select: {
          obtainedMarks: true,
          percentage: true,
          isPassed: true,
          isAbsent: true,
        },
      })
      : [],
  ]);

  return (
    <ExamDetailsPage
      exam={{
        id: exam.id,
        title: exam.title,
        description: exam.description,
        maxMarks: exam.maxMarks,
        passingMarks: exam.passingMarks,
        startDate: exam.startDate,
        endDate: exam.endDate,
        status: exam.status,
        mode: exam.mode,
        venue: exam.venue,
        venueMapUrl: exam.venueMapUrl,
        instructions: exam.instructions,
        isResultsPublished: exam.isResultsPublished,
        durationInMinutes: exam.durationInMinutes,
        subject: exam.subject,
        examSession: exam.examSession,
        organization: exam.organization,
        grade,
        section,
      }}
      studentId={student.id}
      enrollment={enrollment}
      result={result}
      hallTicket={hallTicket}
      examResults={allExamResults}
      totalEnrolled={totalEnrolled}
    />
  );
}
