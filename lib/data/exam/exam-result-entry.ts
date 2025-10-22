'use server';

import prisma from '@/lib/db';
import {
  studentExamResultFormData,
  studentExamResultSchema,
} from '@/lib/schemas';

export default async function ExamResultEntry(data: studentExamResultFormData) {
  const validatedData = studentExamResultSchema.safeParse(data);

  if (!validatedData.success || !validatedData.data) {
    throw new Error('Invalid form data: ' + validatedData.error?.message);
  }

  try {
    const operations = validatedData.data.results.map((result) =>
      prisma.examResult.upsert({
        where: {
          examId_studentId: {
            examId: result.examId,
            studentId: result.studentId,
          },
        },
        update: {
          obtainedMarks: result.obtainedMarks,
          percentage: result.percentage,
          gradeLabel: result.gradeLabel,
          remarks: result.remarks,
          isPassed: result.isPassed,
          isAbsent: result.isAbsent,
          isResultsPublished: true,
        },
        create: {
          studentId: result.studentId,
          examId: result.examId,
          obtainedMarks: result.obtainedMarks,
          percentage: result.percentage,
          gradeLabel: result.gradeLabel,
          remarks: result.remarks,
          isPassed: result.isPassed,
          isAbsent: result.isAbsent,
          isResultsPublished: true,
        },
      })
    );

    await prisma.$transaction(operations);

    return { success: true };
  } catch (error) {
    console.error('Error saving exam results:', error);
    throw new Error('Failed to save exam results');
  }
}
