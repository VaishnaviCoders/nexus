import DocumentsPage from '@/components/dashboard/Student/documents/DocumentPage';
import prisma from '@/lib/db';
import { getCurrentUserId } from '@/lib/user';
import { redirect } from 'next/navigation';
import React from 'react';

async function getStudentDocuments(studentId: string) {
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

const page = async () => {
  const userId = await getCurrentUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      student: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/'); // or show fallback
  }

  // ✅ Only allow students here
  if (user.role !== 'STUDENT' || !user.student?.id) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold text-lg">
        Only students can access this page.
      </div>
    );
  }
  const documents = await getStudentDocuments(user.student.id);
  return <DocumentsPage studentId={user.student.id} data={documents} />;
};

export default page;
