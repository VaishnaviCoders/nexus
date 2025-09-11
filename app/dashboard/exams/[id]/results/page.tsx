import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import React from 'react';

export default async function ExamResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const organizationId = await getOrganizationId();

  const exams = await prisma.exam.findUnique({
    where: {
      id,
    },
    include: {
      examResult: true,
    },
  });
  return (
    <div>
      {exams?.examResult.map((result) => (
        <div key={result.id}>
          <p>{result.examId}</p>
          <p>{result.maxMarks}</p>
          <p>{result.obtainedMarks}</p>
          <p>{result.percentage}</p>
        </div>
      ))}
    </div>
  );
}
