import { notFound } from 'next/navigation';
import { getOrganizationId } from '@/lib/organization';
import { ExamDetailsPage } from '@/components/dashboard/exam/ExamDetailsPage';
import prisma from '@/lib/db';
import { getCurrentUserId } from '@/lib/user';

export default async function ExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const organizationId = await getOrganizationId();
  const currentUserId = await getCurrentUserId();

  // First, get the student record for the current user
  const student = await prisma.student.findFirst({
    where: {
      userId: currentUserId,
      organizationId,
    },
    select: {
      id: true,
    },
  });

  if (!student) {
    return notFound();
  }

  // Fetch exam with comprehensive related data
  const exam = await prisma.exam.findFirst({
    where: {
      id,
      organizationId,
    },
    include: {
      subject: {
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
        },
      },
      examSession: {
        select: {
          id: true,
          title: true,
          description: true,
          startDate: true,
          endDate: true,
        },
      },
      examResult: {
        where: {
          studentId: student.id,
        },
      },
      examEnrollment: {
        where: {
          studentId: student.id,
        },
      },
      hallTickets: {
        where: {
          studentId: student.id,
        },
        orderBy: {
          generatedAt: 'desc',
        },
        take: 1,
      },
      _count: {
        select: {
          examEnrollment: true,
          examResult: true,
        },
      },
    },
  });

  if (!exam) return notFound();

  // Get all exam results for statistics (separate query for better performance)
  const allExamResults = await prisma.examResult.findMany({
    where: {
      examId: id,
    },
    select: {
      obtainedMarks: true,
      isPassed: true,
      isAbsent: true,
      percentage: true,
    },
  });

  // Extract the specific student's data
  const studentEnrollment = exam.examEnrollment[0] || null;
  const studentResult = exam.examResult[0] || null;
  const studentHallTicket = exam.hallTickets[0] || null;
  const enrolledStudentsCount = exam._count.examEnrollment;

  return (
    <ExamDetailsPage
      exam={exam}
      studentId={student.id}
      enrolledStudentsCount={enrolledStudentsCount}
      studentEnrollment={studentEnrollment}
      studentResult={studentResult}
      studentHallTicket={studentHallTicket}
      allExamResults={allExamResults}
    />
  );
}
