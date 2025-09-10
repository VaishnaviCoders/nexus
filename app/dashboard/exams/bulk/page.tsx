import { BulkExamCreateForm } from '@/components/dashboard/exam/BulkExamCreateForm';
import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export default async function BulkExamCreatePage() {
  const organizationId = await getOrganizationId();

  const subjects = await prisma.subject.findMany({
    where: { organizationId },
    select: {
      id: true,
      name: true,
      code: true,
    },
  });

  const teachersRaw = await prisma.teacher.findMany({
    where: { organizationId },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const teachers = teachersRaw.map((t) => ({
    id: t.id,
    firstName: t.user.firstName,
    lastName: t.user.lastName,
  }));

  const sections = await prisma.section.findMany({
    where: { organizationId },
    include: {
      grade: { select: { id: true, grade: true } },
    },
  });

  const grades = await prisma.grade.findMany({
    where: { organizationId },
    select: {
      id: true,
      grade: true,
      section: {
        select: {
          id: true,
          name: true,
          gradeId: true,
        },
      },
    },
  });

  const examSession = await prisma.examSession.findMany({
    select: {
      startDate: true,
      endDate: true,
      title: true,
      id: true,
    },
  });

  return (
    <main className="px-2 ">
      <BulkExamCreateForm
        examSessions={examSession}
        grades={grades}
        sections={sections}
        subjects={subjects}
        teachers={teachers}
        defaultSessionId={examSession[0]?.id}
        defaultGradeId={grades[0]?.id}
        defaultSectionId={sections[0]?.id}
      />
    </main>
  );
}
