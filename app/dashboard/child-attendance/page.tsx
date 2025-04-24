import { AttendanceSummary } from '@/app/components/dashboardComponents/StudentAttendance/AttendanceSummary';
import { AttendanceTable } from '@/app/components/dashboardComponents/StudentAttendance/AttendanceTable';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
// import { AttendanceSummary } from './components/attendance-summary';
// import { AttendanceCalendar } from './components/attendance-calendar';
// import { ChildSelector } from './components/child-selector';
// import { FilterOptions } from './components/filter-options';

// Sample data for children
const children = [
  {
    id: 1,
    name: 'Emma Johnson',
    grade: 'Grade 5',
    section: 'A',
    attendance: {
      present: 42,
      absent: 3,
      late: 5,
      total: 50,
      percentage: 100,
    },
  },
  {
    id: 2,
    name: 'Noah Smith',
    grade: 'Grade 3',
    section: 'B',
    attendance: {
      present: 47,
      absent: 1,
      late: 2,
      total: 50,
      percentage: 94,
    },
  },
];

// Sample attendance records
const attendanceRecords = [
  {
    id: 1,
    studentId: '1',
    sectionId: '1',
    date: new Date('2025-04-19').toISOString(),
    status: 'present' as const,
    present: true,
    note: '',
    recordedBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    student: {
      id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      rollNumber: '101',
      section: { name: 'A' },
    },
    section: {
      id: '1',
      name: 'A',
      gradeId: '1',
      organizationId: '1',
    },
  },
  {
    id: 2,
    studentId: '1',
    sectionId: '1',
    date: new Date('2025-04-18').toISOString(),
    status: 'present' as const,
    present: true,
    note: '',
    recordedBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    student: {
      id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      rollNumber: '101',
      section: { name: 'A' },
    },
    section: {
      id: '1',
      name: 'A',
      gradeId: '1',
      organizationId: '1',
    },
  },
  {
    id: 3,
    studentId: '1',
    sectionId: '1',
    date: new Date('2025-04-17').toISOString(),
    status: 'late' as const,
    present: true,
    note: 'Arrived 15 minutes late',
    recordedBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    student: {
      id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      rollNumber: '101',
      section: { name: 'A' },
    },
    section: {
      id: '1',
      name: 'A',
      gradeId: '1',
      organizationId: '1',
    },
  },
  {
    id: 4,
    studentId: '1',
    sectionId: '1',
    date: new Date('2025-04-16').toISOString(),
    status: 'present' as const,
    present: true,
    note: '',
    recordedBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    student: {
      id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      rollNumber: '101',
      section: { name: 'A' },
    },
    section: {
      id: '1',
      name: 'A',
      gradeId: '1',
      organizationId: '1',
    },
  },
  {
    id: 5,
    studentId: '1',
    sectionId: '1',
    date: new Date('2025-04-15').toISOString(),
    status: 'present' as const,
    present: true,
    note: '',
    recordedBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    student: {
      id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      rollNumber: '101',
      section: { name: 'A' },
    },
    section: {
      id: '1',
      name: 'A',
      gradeId: '1',
      organizationId: '1',
    },
  },
  {
    id: 6,
    studentId: '1',
    sectionId: '1',
    date: new Date('2025-04-14').toISOString(),
    status: 'absent' as const,
    present: false,
    note: 'Medical appointment',
    recordedBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    student: {
      id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      rollNumber: '101',
      section: { name: 'A' },
    },
    section: {
      id: '1',
      name: 'A',
      gradeId: '1',
      organizationId: '1',
    },
  },
  {
    id: 7,
    studentId: '1',
    sectionId: '1',
    date: new Date('2025-04-12').toISOString(),
    status: 'present' as const,
    present: true,
    note: '',
    recordedBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    student: {
      id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      rollNumber: '101',
      section: { name: 'A' },
    },
    section: {
      id: '1',
      name: 'A',
      gradeId: '1',
      organizationId: '1',
    },
  },
  {
    id: 8,
    studentId: '1',
    sectionId: '1',
    date: new Date('2025-04-11').toISOString(),
    status: 'present' as const,
    present: true,
    note: '',
    recordedBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    student: {
      id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      rollNumber: '101',
      section: { name: 'A' },
    },
    section: {
      id: '1',
      name: 'A',
      gradeId: '1',
      organizationId: '1',
    },
  },
  {
    id: 9,
    studentId: '1',
    sectionId: '1',
    date: new Date('2025-04-10').toISOString(),
    status: 'present' as const,
    present: true,
    note: '',
    recordedBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    student: {
      id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      rollNumber: '101',
      section: { name: 'A' },
    },
    section: {
      id: '1',
      name: 'A',
      gradeId: '1',
      organizationId: '1',
    },
  },
  {
    id: 10,
    studentId: '1',
    sectionId: '1',
    date: new Date('2025-04-09').toISOString(),
    status: 'late' as const,
    present: true,
    note: 'Bus delay',
    recordedBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    student: {
      id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      rollNumber: '101',
      section: { name: 'A' },
    },
    section: {
      id: '1',
      name: 'A',
      gradeId: '1',
      organizationId: '1',
    },
  },
];

export default function ParentAttendancePage() {
  return (
    <div className="">
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Attendance Dashboard
        </h1>
        {/* <div className="w-full md:w-auto">
          <ChildSelector children={children} defaultChild={children[0]} />
        </div> 
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Suspense
          fallback={<Skeleton className="h-[180px] w-full rounded-lg" />}
        >
          <AttendanceSummary attendance={children[0].attendance} />
        </Suspense>

        <div className="md:col-span-2">{/* <FilterOptions /> */}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-950 rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Attendance</h2>
            <Suspense
              fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}
            >
              <AttendanceTable records={attendanceRecords} />
            </Suspense>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-950 rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Monthly View</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
