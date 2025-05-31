import { ClientChildAttendance } from '@/components/dashboard/StudentAttendance/ClientChildAttendance';
import { getAttendanceSummary } from '@/lib/data/parent/attendance-monitor/getAttendanceSummary';
import { getMonthlyAttendance } from '@/lib/data/parent/attendance-monitor/getMonthlyAttendance';
import { getParentWithChildrenData } from '@/lib/data/parent/attendance-monitor/getParentWithChildrenData';
import { getRecentAttendance } from '@/lib/data/parent/attendance-monitor/getRecentAttendance';
import { ParentData } from '@/types';

export default async function ChildAttendanceMonitor() {
  const parentData: ParentData | null = await getParentWithChildrenData();

  const child = parentData?.students[0].student;

  // const parentData = await getParentWithChildren(parentId);

  if (!parentData || parentData.students.length === 0 || !child?.id) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl font-bold">No children found</h1>
        <p className="mt-4">
          Please contact the school administration for assistance.
        </p>
      </div>
    );
  }

  const attendanceStats = await getAttendanceSummary(child.id);

  const AttendanceRecord = await getRecentAttendance(child.id);

  const monthlyAttendance = await getMonthlyAttendance(child.id);

  return (
    <ClientChildAttendance
      parentData={parentData}
      attendanceStats={attendanceStats!}
      records={AttendanceRecord}
      monthlyData={monthlyAttendance}
    />
  );
}
