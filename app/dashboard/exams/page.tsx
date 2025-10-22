import { StudentExamsPage } from '@/components/dashboard/exam/StudentExamsPage';
import { AdminExamsPage } from '@/components/dashboard/exam/AdminExamPage';
import { getCurrentUserByRole } from '@/lib/auth';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { notFound } from 'next/navigation';

import { Suspense } from 'react';
import { ExamsPageSkeleton } from '@/components/exam-skeleton';

export default async function ExamsPage() {
  const organizationId = await getOrganizationId();
  const currentUser = await getCurrentUserByRole();

  let exams = [];

  switch (currentUser.role) {
    case 'STUDENT': {
      const student = await prisma.student.findUnique({
        where: { id: currentUser.studentId, organizationId },
        select: { gradeId: true, sectionId: true },
      });

      if (!student) return notFound();

      exams = await prisma.exam.findMany({
        where: {
          organizationId,
          gradeId: student.gradeId,
          sectionId: student.sectionId,
        },
        include: {
          subject: true,
          examSession: true,
          hallTickets: { where: { studentId: currentUser.studentId } },
          examResult: { where: { studentId: currentUser.studentId } },
          examEnrollment: { where: { studentId: currentUser.studentId } },
        },
        orderBy: { startDate: 'desc' },
      });

      return (
        <Suspense fallback={<ExamsPageSkeleton />}>
          <StudentExamsPage exams={exams} />
        </Suspense>
      );
    }

    case 'PARENT': {
      const children = await prisma.student.findMany({
        where: {
          organizationId,
          parents: { some: { parentId: currentUser.parentId } },
        },
        select: { id: true, gradeId: true, sectionId: true },
      });

      if (!children.length) return notFound();

      const gradeIds = [...new Set(children.map((c) => c.gradeId))];
      const sectionIds = [...new Set(children.map((c) => c.sectionId))];
      const childIds = children.map((c) => c.id);

      exams = await prisma.exam.findMany({
        where: {
          organizationId,
          gradeId: { in: gradeIds },
          sectionId: { in: sectionIds },
        },
        include: {
          subject: true,
          examSession: true,
          hallTickets: true,
          examResult: { where: { studentId: { in: childIds } } },
          examEnrollment: { where: { studentId: { in: childIds } } },
        },
        orderBy: { startDate: 'desc' },
      });

      return (
        <Suspense fallback={<ExamsPageSkeleton />}>
          <StudentExamsPage exams={exams} />
        </Suspense>
      );
    }

    case 'TEACHER':
      exams = await prisma.exam.findMany({
        where: { organizationId },
        include: {
          subject: true,
          examSession: true,
          hallTickets: true,
          examResult: true,
          examEnrollment: true,
        },
        orderBy: { startDate: 'desc' },
      });

      return (
        <Suspense fallback={<ExamsPageSkeleton />}>
          <AdminExamsPage exams={exams} userRole="TEACHER" />
        </Suspense>
      );

    case 'ADMIN':
      exams = await prisma.exam.findMany({
        where: { organizationId },
        include: {
          subject: true,
          examSession: true,
          hallTickets: true,
          examResult: true,
          examEnrollment: true,
        },
        orderBy: { startDate: 'desc' },
      });

      return (
        <Suspense fallback={<ExamsPageSkeleton />}>
          <AdminExamsPage exams={exams} userRole="ADMIN" />
        </Suspense>
      );
  }
}
