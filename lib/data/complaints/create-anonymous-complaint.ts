'use server';
import { anonymousComplaintSchema } from '@/components/dashboard/anonymousComplaints/create-complaint-form';
import { getCurrentAcademicYearId } from '@/lib/academicYear';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { z } from 'zod';

function generateTrackingId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const random = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4-char random alphanumeric
  return `CMP-${date}-${random}`;
}

export async function createAnonymousComplaintAction(
  data: z.infer<typeof anonymousComplaintSchema>
) {
  console.log('Creating complaint with data:', data);
  const organizationId = await getOrganizationId();

  const trackingId = generateTrackingId();
  const academicYearData = await getCurrentAcademicYearId();

  if (!academicYearData) {
    // Handle the missing academic year here
    // You can redirect, show a message, throw an error, etc.
    throw new Error('No current academic year is set.');
  }

  const { academicYearId } = academicYearData;

  await prisma.anonymousComplaint.create({
    data: {
      organizationId,
      academicYearId,
      category: data.category,
      severity: data.severity,
      subject: data.subject,
      description: data.description,
      submittedAt: new Date(),
      currentStatus: 'PENDING',
      trackingId,
      evidenceUrls: data.evidenceUrls,
      ComplaintStatusTimeline: {
        create: {
          status: 'PENDING',
          changedBy: 'system',
        },
      },
    },
  });

  return trackingId;
}
