'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import QRCode from 'qrcode';

export async function generateQR(data: string) {
  try {
    // Generates a PNG Data URL (base64)
    const qr = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      margin: 1,
      scale: 6,
    });
    return qr;
  } catch (error) {
    console.error('QR generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
}

// import { generateHallTicketPDF, uploadToS3 } from '@/lib/halltickets'; // optional helpers

export async function issueHallTicketForExam(
  studentId: string,
  examId: string
) {
  // [1] Check enrollment
  const enrollment = await prisma.examEnrollment.findUnique({
    where: { studentId_examId: { studentId, examId } },
    include: {
      exam: {
        include: { examSession: true, subject: true },
      },
      student: {
        select: { id: true, gradeId: true, sectionId: true },
      },
    },
  });

  if (!enrollment) return { error: 'Student not enrolled in this exam.' };

  const { exam, student } = enrollment;

  // [2] Check if hall ticket already exists
  const existing = await prisma.hallTicket.findUnique({
    where: { studentId_examId: { studentId, examId } },
  });
  if (existing) return { message: 'Hall ticket already issued.' };

  const qrPayload = JSON.stringify({
    studentId,
    examId,
    timestamp: Date.now(),
  });

  const qrCode = await generateQR(qrPayload);

  // [3] (Optional) Generate PDF here
  // const pdfBuffer = await generateHallTicketPDF(student, exam);
  // const pdfUrl = await uploadToS3(pdfBuffer, `halltickets/${exam.id}/${student.id}.pdf`);
  const pdfUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/halltickets/${exam.id}/${student.id}.pdf`; // placeholder

  // [4] Create record
  const ticket = await prisma.hallTicket.create({
    data: {
      qrCode,
      studentId,
      examId,
      examSessionId: exam.examSessionId,
      organizationId: exam.organizationId,
      pdfUrl,
      expiryDate: exam.endDate,
    },
  });

  // [5] Optionally revalidate
  revalidatePath(`/dashboard/exams/${examId}`);

  return { success: true, hallTicketId: ticket.id };
}
