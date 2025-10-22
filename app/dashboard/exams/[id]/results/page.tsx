import ExamResultsEntry from '@/components/dashboard/exam/ExamResultsEntry';
import { EmptyState } from '@/components/EmptyState';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { CalendarDays, TestTubes, User2 } from 'lucide-react';

export default async function ExamResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const organizationId = await getOrganizationId();

  const exam = await prisma.exam.findUnique({
    where: { id },
    include: {
      subject: true,
      examSession: true,
    },
  });

  if (!exam) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <EmptyState
          title="Exam Not Found"
          description="We couldn't find an exam matching your request. It may have been deleted or the link is incorrect."
          icons={[CalendarDays, User2, TestTubes]}
          action={{
            label: 'Go Back to Exams',
            href: '/dashboard/exams',
          }}
        />
      </div>
    );
  }

  const enrolledStudents = await prisma.examEnrollment.findMany({
    where: {
      examId: exam.id,
      student: {
        organizationId,
      },
    },
    select: {
      student: true,
    },
  });

  const existingResults = await prisma.examResult.findMany({
    where: {
      examId: exam.id,
    },
    select: {
      studentId: true,
      obtainedMarks: true,
      percentage: true,
      gradeLabel: true,
      remarks: true,
      isPassed: true,
      isAbsent: true,
    },
  });

  const studentList = enrolledStudents.map((enrollment) => enrollment.student);

  return (
    <ExamResultsEntry
      students={studentList}
      exam={exam}
      existingResults={existingResults}
    />
  );
}
