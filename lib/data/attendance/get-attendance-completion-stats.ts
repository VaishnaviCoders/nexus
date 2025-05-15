import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';

function calculatePercentage(numerator: number, denominator: number): number {
  return denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;
}

function getAttendanceStatus(
  recorded: number,
  total: number
): 'completed' | 'in-progress' | 'pending' {
  if (recorded === 0) return 'pending';
  if (recorded < total) return 'in-progress';
  return 'completed';
}

export async function getAttendanceCompletionStats(
  date: Date = new Date(),
  options: { page?: number; pageSize?: number } = {}
) {
  const { page = 1, pageSize = 10 } = options;
  const orgId = await getOrganizationId();

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  // Count all sections for stats
  const totalSections = await prisma.section.count({
    where: { organizationId: orgId },
  });

  const sections = await prisma.section.findMany({
    where: { organizationId: orgId },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      grade: {
        select: { grade: true },
      },
      students: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          rollNumber: true,
        },
      },
      StudentAttendance: {
        where: {
          date: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
        select: {
          studentId: true,
          present: true,
          notes: true,
          recordedBy: true,
        },
      },
    },
  });

  const sectionData = sections.map((section) => {
    const totalStudents = section.students.length;

    const attendanceMap = new Map(
      section.StudentAttendance.map((a) => [a.studentId, a])
    );

    const students = section.students.map((student) => {
      const attendance = attendanceMap.get(student.id);
      return {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        rollNumber: student.rollNumber || 'N/A',
        attendanceStatus: attendance
          ? attendance.present
            ? 'present'
            : 'absent'
          : 'not-recorded',
        notes: attendance?.notes,
      };
    });

    const recordedCount = section.StudentAttendance.length;
    const presentCount = section.StudentAttendance.filter(
      (a) => a.present
    ).length;

    const status = getAttendanceStatus(recordedCount, totalStudents);
    const percentage = calculatePercentage(recordedCount, totalStudents);
    const reportedBy =
      section.StudentAttendance[0]?.recordedBy ?? 'Not specified';

    return {
      id: section.id,
      section: section.name,
      grade: section.grade.grade,
      date: startOfDay.toISOString(),
      reportedBy,
      status,
      percentage,
      studentsPresent: presentCount,
      totalStudents,
      students,
    };
  });

  const completedSections = sectionData.filter(
    (s) => s.status === 'completed'
  ).length;
  const totalStudents = sectionData.reduce(
    (sum, s) => sum + s.totalStudents,
    0
  );
  const totalPresent = sectionData.reduce(
    (sum, s) => sum + s.studentsPresent,
    0
  );

  return {
    sections: sectionData,
    stats: {
      totalSections,
      completedSections,
      pendingSections: totalSections - completedSections,
      totalStudents,
      totalPresent,
      completionPercentage: calculatePercentage(
        completedSections,
        totalSections
      ),
      attendancePercentage: calculatePercentage(totalPresent, totalStudents),
      totalPages: Math.ceil(totalSections / pageSize),
      currentPage: page,
    },
  };
}
