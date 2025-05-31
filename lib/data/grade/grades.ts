import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

export const getGradesWithCounts = async () => {
  const organizationId = await getOrganizationId();

  const grades = await prisma.grade.findMany({
    where: {
      organizationId: organizationId,
    },
    select: {
      id: true,
      grade: true,
      _count: {
        select: {
          section: true,
        },
      },
      section: {
        select: {
          _count: {
            select: {
              students: true,
            },
          },
        },
      },
    },
    orderBy: {
      grade: 'asc',
    },
  });

  return grades.map((grade) => ({
    id: grade.id,
    grade: grade.grade,
    sectionCount: grade._count.section,
    studentCount: grade.section.reduce(
      (acc, section) => acc + section._count.students,
      0
    ),
  }));
};

export const getGradesStats = async () => {
  const organizationId = await getOrganizationId();

  const [totalGrades, totalSections, totalStudents] = await Promise.all([
    prisma.grade.count({
      where: { organizationId },
    }),
    prisma.section.count({
      where: { organizationId },
    }),
    prisma.student.count({
      where: { organizationId },
    }),
  ]);

  return {
    totalGrades,
    totalSections,
    totalStudents,
    avgStudentsPerGrade: totalGrades > 0 ? totalStudents / totalGrades : 0,
  };
};

export async function getGradeWithSections(gradeId: string) {
  const organizationId = await getOrganizationId();

  return await prisma.grade.findUnique({
    where: {
      id: gradeId,
      organizationId,
    },
    include: {
      section: {
        include: {
          _count: {
            select: {
              students: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      },
    },
  });
}
