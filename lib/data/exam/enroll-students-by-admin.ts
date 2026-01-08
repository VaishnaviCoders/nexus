"use server";

import { StudentExamStatus } from "@/generated/prisma/enums";
import { getCurrentUserByRole } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function enrollStudentsByAdmin(
    examId: string,
    studentIds: string[]
) {
    const currentUser = await getCurrentUserByRole();
    if (!currentUser || currentUser.role !== "ADMIN" && currentUser.role !== "TEACHER") {
        throw new Error("Unauthorized: Admin or Teacher role required");
    }

    // Check if exam exists
    const exam = await prisma.exam.findUnique({
        where: { id: examId },
    });

    if (!exam) {
        return { error: "Exam not found" };
    }

    // Get existing enrollments to avoid duplicates
    const existing = await prisma.examEnrollment.findMany({
        where: {
            examId: examId,
            studentId: { in: studentIds },
        },
    });

    const existingIds = existing.map((e) => e.studentId);
    const newStudentIds = studentIds.filter((id) => !existingIds.includes(id));

    if (newStudentIds.length === 0) {
        return { error: "All students are already enrolled" };
    }

    // Batch create enrollments
    await prisma.examEnrollment.createMany({
        data: newStudentIds.map((studentId) => ({
            studentId,
            examId,
            status: StudentExamStatus.ENROLLED,
            enrolledAt: new Date(),
            enrolledBy: currentUser.role === "ADMIN" ? currentUser.userId : currentUser.teacherId
        })),
    });

    revalidatePath("/admin/exams");
    revalidatePath(`/dashboard/exams/${examId}`);
    return {
        success: true,
        message: `Enrolled ${newStudentIds.length} students successfully`,
        enrolled: newStudentIds.length,
        skipped: existingIds.length
    };
}