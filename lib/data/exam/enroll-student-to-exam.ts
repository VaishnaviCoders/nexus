'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function enrollStudentToExam(studentId: string, examId: string) {
  // 1) Check student exists
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    return { error: 'Student does not exist.' };
  }

  // 2) Check exam exists
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
  });

  if (!exam) {
    return { error: 'Exam does not exist.' };
  }

  if (exam.status !== 'UPCOMING') {
    return { error: `Exam is already ${exam.status}` };
  }

  // 3) Check enrollment exists
  const existingEnrollment = await prisma.examEnrollment.findUnique({
    where: { studentId_examId: { studentId, examId } },
  });

  if (existingEnrollment) {
    return { error: 'Student is already enrolled in this exam.' };
  }

  // 4) Create enrollment
  await prisma.examEnrollment.create({
    data: {
      studentId,
      examId,
      status: 'ENROLLED',
    },
  });

  revalidatePath(`/dashboard/exams/${examId}`);

  return { success: true };
}
