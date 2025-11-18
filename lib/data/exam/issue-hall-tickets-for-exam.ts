'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import QRCode from 'qrcode';

/**
 * Issues hall tickets for one or more students in a given exam.
 * Returns all hall ticket IDs (newly created or existing).
 */
export async function issueHallTicketsForExam(
  studentIds: string[],
  examId: string
) {
  const hallTicketIds: string[] = [];

  // Fetch exam info (shared for all students)
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { examSession: true, subject: true },
  });
  if (!exam) return { error: 'Exam not found.' };

  for (const studentId of studentIds) {
    const enrollment = await prisma.examEnrollment.findUnique({
      where: { studentId_examId: { studentId, examId } },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rollNumber: true,
            email: true,
            gradeId: true,
            sectionId: true,
          },
        },
      },
    });

    if (!enrollment) continue; // Skip if not enrolled

    // Check if hall ticket already exists
    const existing = await prisma.hallTicket.findUnique({
      where: { studentId_examId: { studentId, examId } },
    });

    if (existing) {
      hallTicketIds.push(existing.id);
      continue;
    }

    const qrData = {
      // hallTicketId: hallTicketNumber,
      studentId: enrollment.student.id,
      studentName: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
      rollNumber: enrollment.student.rollNumber,
      examId: exam.id,
      examTitle: exam.title,
      subject: exam.subject.name,
      subjectCode: exam.subject.code,
      examSession: exam.examSession.title,
      startDate: exam.startDate.toISOString(),
      endDate: exam.endDate.toISOString(),
      // grade: exam.grade?.grade,
      // section: exam.section?.name,
      issuedAt: new Date().toISOString(),
      organizationId: exam.organizationId,
    };

    // Generate QR code as base64 data URL
    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
    });
    // (Optional) Generate PDF or use placeholder
    const pdfUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/halltickets/${exam.id}/${studentId}.pdf`;

    // Create new hall ticket
    const ticket = await prisma.hallTicket.create({
      data: {
        qrCode: qrCodeDataUrl,
        studentId,
        examId,
        examSessionId: exam.examSessionId,
        organizationId: exam.organizationId,
        pdfUrl,
        expiryDate: exam.endDate,
      },
    });

    hallTicketIds.push(ticket.id);

    // Update enrollment to mark ticket issued
    await prisma.examEnrollment.update({
      where: { studentId_examId: { studentId, examId } },
      data: {
        hallTicketIssued: true,
        hallTicketIssuedAt: new Date(),
      },
    });
  }

  // Refresh UI
  revalidatePath(`/dashboard/exams/${examId}`);

  return {
    success: true,
    hallTicketIds,
    count: hallTicketIds.length,
  };
}
