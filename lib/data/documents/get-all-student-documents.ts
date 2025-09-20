import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export default async function getAllStudentDocuments() {
  const organizationId = await getOrganizationId();

  const documents = await prisma.studentDocument.findMany({
    where: {
      isDeleted: false,
      organizationId,
    },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          rollNumber: true,
          grade: { select: { grade: true } },
          section: { select: { name: true } },
        },
      },
    },
    orderBy: {
      uploadedAt: 'desc',
    },
  });

  return documents;
}
