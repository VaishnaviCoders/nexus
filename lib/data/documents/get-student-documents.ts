import prisma from '@/lib/db';

export async function getStudentDocuments(studentId: string) {
  const documents = await prisma.studentDocument.findMany({
    where: {
      studentId: studentId,
    },
    select: {
      studentId: true,
      id: true,
      type: true,
      fileName: true,
      fileSize: true,
      fileType: true,
      documentUrl: true,
      uploadedBy: true,
      uploadedAt: true,
      note: true,
      createdAt: true,
      updatedAt: true,
      verified: true,
      rejected: true,
      isDeleted: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Normalize Prisma nulls to undefined
  return documents.map((doc) => ({
    ...doc,
    fileName: doc.fileName ?? undefined,
    fileSize: doc.fileSize ?? undefined,
    fileType: doc.fileType ?? undefined,
    note: doc.note ?? undefined,
    uploadedBy: doc.uploadedBy ?? undefined,
  }));
}
