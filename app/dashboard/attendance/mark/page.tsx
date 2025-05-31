import prisma from '@/lib/db';
import AttendanceMark from '@/components/dashboard/StudentAttendance/attendance-mark';
import { getOrganizationId } from '@/lib/organization';

async function getStudents() {
  const organizationId = await getOrganizationId();

  const data = await prisma.student.findMany({
    where: {
      organizationId: organizationId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      rollNumber: true,
      section: true,
      profileImage: true,
      gradeId: true,
      grade: {
        select: {
          id: true,
          grade: true,
        },
      },
      StudentAttendance: {
        select: {
          id: true,
          present: true,
          date: true,
          status: true,
          note: true,
          recordedBy: true,
          sectionId: true,
          createdAt: true,
        },
      },
    },
  });
  return data;
}

export default async function MarkAttendancePage() {
  const students = await getStudents();
  return (
    <div className="flex min-h-screen flex-col">
      <AttendanceMark students={students} />
    </div>
  );
}
