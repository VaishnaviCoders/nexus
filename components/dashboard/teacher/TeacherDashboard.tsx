import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, BookOpen, CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { TeacherStatsCards } from '@/components/dashboard/teacher/TeacherDashboardStatsCard';
import { RecentActivitiesCard } from '@/components/dashboard/teacher/RecentActivitiesCard';
import { TeacherTodaysClassScheduleCard } from './TeacherTodaysClassScheduleCard';

// import { TeacherStatsCards } from "@/components/teacher-dashboard/teacher-stats-cards"
// import { TodayScheduleCard } from "@/components/teacher-dashboard/today-schedule-card"
// import { MyClassesCard } from "@/components/teacher-dashboard/my-classes-card"
// import { RecentActivitiesCard } from "@/components/teacher-dashboard/recent-activities-card"
// import { StudentPerformanceCard } from "@/components/teacher-dashboard/student-performance-card"
// import { QuickActionsCard } from "@/components/teacher-dashboard/quick-actions-card"

// Available Sameer Kad Main V0.dev

export default async function TeacherDashboard() {
  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/10">
      <div className="px-3 space-y-3">
        {/* Header */}

        <Card className="bg-gradient-to-r from-card via-card to-primary/5">
          <CardContent className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-6 gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Teacher Dashboard{' '}
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                >
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  Academic Year 2024-25
                </Badge>
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Manage your classes, students, and teaching activities
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <Link href="/dashboard/attendance/mark">
                  <Button variant="outline" size="sm" className="">
                    <Calendar className="w-4 h-4 mr-2" />
                    Take Attendance
                  </Button>
                </Link>
                <Link href="/dashboard/students">
                  <Button size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    My Students
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <TeacherStatsCards />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Today's Schedule */}
            <TeacherTodaysClassScheduleCard />

            {/* My Classes */}
            {/* <MyClassesCard /> */}

            {/* Quick Actions */}
            {/* <QuickActionsCard /> */}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Student Performance */}
            {/* <StudentPerformanceCard /> */}

            {/* Recent Activities */}
            <RecentActivitiesCard />
          </div>
        </div>

        {/* Teaching Tips */}
        <Card className="border-0 bg-gradient-to-br from-card via-card to-green-50/20 dark:to-green-950/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Teaching Tips
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Daily Best Practices</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Take attendance within first 10 minutes</li>
                  <li>• Review previous day's performance</li>
                  <li>• Prepare materials before class starts</li>
                  <li>• Engage with students regularly</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Student Management</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Monitor attendance patterns</li>
                  <li>• Communicate with parents about concerns</li>
                  <li>• Provide regular feedback</li>
                  <li>• Maintain updated records</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
