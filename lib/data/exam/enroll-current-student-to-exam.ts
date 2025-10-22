'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { enrollStudentToExam } from './enroll-student-to-exam';
import { getCurrentUserByRole } from '@/lib/auth';

export async function enrollCurrentStudentToExam(examId: string) {
    try {
        // Get current user by role
        const currentUser = await getCurrentUserByRole();

        if (currentUser.role !== 'STUDENT') {
            return { error: 'Only students can enroll in exams' };
        }

        // Enroll student in exam using existing function
        const result = await enrollStudentToExam(currentUser.studentId, examId);

        // Revalidate the exams page
        revalidatePath('/dashboard/exams');

        return result;
    } catch (error) {
        console.error('Error enrolling in exam:', error);
        return { error: 'Internal server error' };
    }
}