import ExamResultsEntry from '@/components/dashboard/exam/ExamResultsEntry';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

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
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Exam Not Found</CardTitle>
            <CardDescription>
              The requested exam could not be found.
            </CardDescription>
          </CardHeader>
        </Card>
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
