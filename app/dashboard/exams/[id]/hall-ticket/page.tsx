import { notFound } from 'next/navigation';
import { getOrganizationId } from '@/lib/organization';
import { HallTicketPDF } from '@/lib/pdf-generator/HallTicketPDF';
import { getCurrentUserId } from '@/lib/user';
import { getHallTicketForStudentExam } from '@/lib/data/hall-ticket/get-hall-ticket-data';
import prisma from '@/lib/db';

export default async function HallTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: examId } = await params;
  const organizationId = await getOrganizationId();
  const currentUserId = await getCurrentUserId();

  // First, get the student record for the current user
  const student = await prisma.student.findFirst({
    where: {
      userId: currentUserId,
      organizationId,
    },
    select: {
      id: true,
    },
  });

  if (!student) {
    return notFound();
  }

  // Fetch hall ticket data with all relations
  const hallTicketData = await getHallTicketForStudentExam(student.id, examId);

  if (!hallTicketData) {
    return (
      <div className="min-h-screen bg-muted/30 p-4 flex items-center justify-center">
        <div className="max-w-md">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-destructive mb-2">
              Hall Ticket Not Found
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              No hall ticket is available for this exam. Please contact the
              administration if you believe this is an error.
            </p>
            <a
              href={`/dashboard/exams/${examId}`}
              className="text-primary hover:underline"
            >
              ← Back to Exam Details
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <HallTicketPDF
      hallTicketData={hallTicketData}
      // onDownloadPDF={() => {
      //   // This could trigger a server action to generate/regenerate the PDF
      //   console.log('Download PDF requested');
      // }}
    />
  );
}
