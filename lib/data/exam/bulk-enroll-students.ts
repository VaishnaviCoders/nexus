'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function bulkEnrollStudents(
    studentIds: string[],
    examId: string
) {
    try {
        if (!studentIds.length) {
            return { success: false, error: 'No students selected' };
        }

        const exam = await prisma.exam.findUnique({
            where: { id: examId },
        });

        if (!exam) {
            return { success: false, error: 'Exam not found' };
        }

        // Filter out already enrolled students
        const existingEnrollments = await prisma.examEnrollment.findMany({
            where: {
                examId,
                studentId: { in: studentIds },
            },
            select: { studentId: true },
        });

        const existingIds = new Set(existingEnrollments.map((e) => e.studentId));
        const newStudentIds = studentIds.filter((id) => !existingIds.has(id));

        if (newStudentIds.length === 0) {
            return {
                success: true,
                message: 'All selected students are already enrolled',
                count: 0,
            };
        }

        // Create enrollments
        await prisma.examEnrollment.createMany({
            data: newStudentIds.map((studentId) => ({
                studentId,
                examId,
                status: 'ENROLLED', // Default status
                enrolledAt: new Date(),
            })),
        });

        revalidatePath(`/dashboard/exams/${examId}`);
        revalidatePath(`/dashboard/admin/exams/${examId}`);

        return {
            success: true,
            message: `Successfully enrolled ${newStudentIds.length} students`,
            count: newStudentIds.length,
        };
    } catch (error) {
        console.error('Error bulk enrolling students:', error);
        return {
            success: false,
            error: 'Failed to enroll students',
        };
    }
}
