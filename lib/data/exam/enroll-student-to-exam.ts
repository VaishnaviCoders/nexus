'use server';

import prisma from '@/lib/db';
import { getCurrentUser, getCurrentUserId } from '@/lib/user';
import { revalidatePath } from 'next/cache';

export async function enrollStudentToExam(studentId: string, examId: string) {
  console.log('Backend Log', studentId, examId);
  // Check if already enrolled
  const existingEnrollment = await prisma.examEnrollment.findUnique({
    where: { studentId_examId: { studentId, examId } },
  });
  if (existingEnrollment) {
    return { error: 'Student is already enrolled in this exam.' };
  }

  // Check if exam is upcoming
  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam || exam.status !== 'UPCOMING') {
    return { error: `Exam is already ${exam?.status}` };
  }

  // Enroll student
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
