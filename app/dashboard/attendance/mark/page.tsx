import prisma from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import AttendanceMark from '@/components/dashboard/StudentAttendance/attendance-mark';

async function getStudents() {
  const { orgId } = await auth();

  if (!orgId) throw new Error('No organization found during Get Students');

  const data = await prisma.student.findMany({
    where: {
      organizationId: orgId,
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
          notes: true,
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
