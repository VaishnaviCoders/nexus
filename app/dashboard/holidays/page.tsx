import HolidayManagement from '@/components/dashboard/holiday/holiday-management';
import { getOrganizationId } from '@/lib/organization';
import prisma from '@/lib/db';
import { getAcademicYearSummary } from '@/lib/data/holiday/get-academic-year-summary';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { getCurrentAcademicYearId } from '@/lib/academicYear';

export default async function page() {
  const summary = await getAcademicYearSummary();

  const organizationId = await getOrganizationId();
  const academicYearId = await getCurrentAcademicYearId();

  const holidays = await prisma.academicCalendar.findMany({
    where: {
      organizationId,
      academicYearId,
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
    <div className=" bg-gray-50 ">
      <div className="space-y-6">
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
