import React from 'react';
import { StudentStatsCard } from './student-stats';
import { RevenueStatsCard } from './revenue-stats';
import { IssuesStatsCard } from './issues-stats';
import { TeacherStatsCard } from './teacher-stats';

// const stats = {
//   totalSections: 45,
//   totalStudents: 1250,
//   totalPresentStudent: 1100,
//   totalTeachers: 85,
//   attendancePercentage: 88, // (1100/1250) * 100
//   completionPercentage: 75,
//   totalRevenue: 2500000, // 25 lakhs expected
//   collectedRevenue: 1875000, // 18.75 lakhs collected
//   revenuePercentage: 75, // (1875000/2500000) * 100
//   totalIssues: 12,
//   pendingIssues: 4,
//   solvedIssues: 8,
//   overdueFeesCount: 45,
//   upcomingEvents: 3,
// };

// Calculate Total Students
// Calculate Active Students
// Calculate New Admissions
// Calculate Todays Attendance : 12 present out of 25 students

// Calculate Active Teacher
// Do something with Teachers

//  Calculate Total Revenue
//  Calculate Collected Revenue
//  Calculate Revenue Progress
//  Calculate Overdue Fees

// Calculate Total Issues
// Calculate Pending Issues
// Calculate Solved Issues

const AdminDashboardCards = () => {
  // const attendancePercentage = Math.round(
  //   (stats.totalPresentStudent / stats.totalStudents) * 100
  // );
  // const revenuePercentage = Math.round(
  //   (stats.collectedRevenue / stats.totalRevenue) * 100
  // );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* <Card>
        <CardContent className="pt-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Students</h3>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.totalStudents}</div>
          <Progress value={stats.totalPresentStudent} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground">
            {stats.totalPresentStudent} present today ({attendancePercentage}
            %)
          </p>
        </CardContent>
      </Card> */}

      <StudentStatsCard />
      <TeacherStatsCard />

      <RevenueStatsCard />
      <IssuesStatsCard />
      {/* <Card>
        <CardContent className="pt-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Teaching Staff</h3>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.totalTeachers}%</div>
          <p className="text-xs text-muted-foreground mt-2">Active Teachers</p>
        </CardContent>
      </Card> */}
      {/* <Card>
        <CardContent className="pt-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Revenue</h3>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.totalRevenue}</div>
          <Progress value={stats.revenuePercentage} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {stats.totalRevenue - stats.collectedRevenue} Revenue pending
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Pending Issues</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.pendingIssues}</div>
          <p className="text-xs text-muted-foreground">
            Issues awaiting resolution
          </p>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default AdminDashboardCards;
