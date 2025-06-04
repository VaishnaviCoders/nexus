import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HolidayManagement from '@/components/dashboard/holiday/holiday-management';
import ComingSoon from '@/components/Coming-soon';
import { getOrganizationId } from '@/lib/organization';
import prisma from '@/lib/db';
import { getAcademicYearSummary } from '@/lib/data/holiday/get-academic-year-summary';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
// import DashboardStats from "./components/dashboard-stats"
// import SchoolManagement from "./components/school-management"
// import AttendanceTracker from "./components/attendance-tracker"
// import HolidayManagement from "./components/holiday-management"

export default async function AttendanceSystem() {
  // Example school year: July 1, 2025 to June 30, 2026
  const startDate = new Date('2024-07-01');
  const endDate = new Date('2025-06-30');

  const summary = await getAcademicYearSummary({
    startDate,
    endDate,
  });

  const organizationId = await getOrganizationId();

  const holidays = await prisma.academicCalendar.findMany({
    where: {
      organizationId: organizationId,
      startDate: {
        gte: new Date(startDate),
      },
      endDate: {
        lte: new Date(endDate),
      },
    },

    select: {
      id: true,
      organizationId: true,
      name: true,
      startDate: true,
      endDate: true,
      type: true,
      reason: true,
      isRecurring: true,
      createdBy: true,
    },
    orderBy: {
      startDate: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="space-y-6">
        {/* Header */}
        {/* <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                School Attendance Management
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive attendance tracking with holiday management
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </div> */}

        {/* Quick Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold">
                    {mockStats.totalStudents.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Avg Attendance</p>
                  <p className="text-2xl font-bold">
                    {mockStats.averageAttendance}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Working Days</p>
                  <p className="text-2xl font-bold">
                    {summary.workingDaysCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Holidays</p>
                  <p className="text-2xl font-bold">{summary.holidayCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}

        <Suspense fallback={<LoadingSkeleton />}>
          <HolidayManagement holidays={holidays} holidaysSummary={summary} />
        </Suspense>

        {/* Main Content */}
        {/* <Tabs defaultValue="holidays" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="attendance">Attendance Tracker</TabsTrigger>
            <TabsTrigger value="holidays">Holiday Management</TabsTrigger>
            <TabsTrigger value="schools">School Management</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <ComingSoon />
            <DashboardStats schools={mockSchools} selectedSchool={selectedSchool} onSchoolChange={setSelectedSchool} />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceTracker
              schools={mockSchools}
              selectedSchool={selectedSchool}
              onSchoolChange={setSelectedSchool}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
            />
            <ComingSoon />
          </TabsContent>

          <TabsContent value="holidays">
            <HolidayManagement holidays={holidays} holidaysSummary={summary} />
          </TabsContent>

          <TabsContent value="schools">
            <SchoolManagement schools={mockSchools} />
            <ComingSoon />
          </TabsContent>
        </Tabs> */}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
