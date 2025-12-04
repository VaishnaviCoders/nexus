import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  GraduationCap,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import {
  getStudentStats,
  getTeacherStats,
  getRevenueStats,
  getIssuesStats,
} from '@/lib/data/dashboard/admin-dashboard-cards';

function CardStatsSkeleton() {
  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 bg-muted rounded w-20 animate-pulse" />
        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
      </div>
      <div className="space-y-3">
        <div className="h-8 bg-muted rounded w-16 animate-pulse" />
        <div className="h-2 bg-muted rounded animate-pulse" />
        <div className="h-3 bg-muted rounded w-32 animate-pulse" />
        <div className="h-3 bg-muted rounded w-24 animate-pulse" />
      </div>
    </CardContent>
  );
}

// Student Stats Component
async function StudentStatsContent() {
  const stats = await getStudentStats();

  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">Total Students</h3>
        <Users className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        <div className="text-2xl font-bold">
          {stats.totalStudents.toLocaleString()}
        </div>

        <Progress value={stats.attendancePercentage} className="h-2" />

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {stats.presentToday} present today ({stats.attendancePercentage}%)
          </p>

          {stats.newAdmissionsThisMonth > 0 && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
            >
              <TrendingUp className="w-3 h-3 mr-1" />+
              {stats.newAdmissionsThisMonth} this month
            </Badge>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          {stats.activeStudents} active students
        </div>
      </div>
    </CardContent>
  );
}

// Teacher Stats Component
async function TeacherStatsContent() {
  const stats = await getTeacherStats();

  const activePercentage =
    stats.totalTeachers > 0
      ? Math.round((stats.activeTeachers / stats.totalTeachers) * 100)
      : 0;

  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">Teaching Staff</h3>
        <GraduationCap className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        <div className="text-2xl font-bold">{stats.totalTeachers}</div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {stats.activeTeachers} active teachers ({activePercentage}%)
          </p>

          {stats.newTeachersThisMonth > 0 && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
            >
              <TrendingUp className="w-3 h-3 mr-1" />+
              {stats.newTeachersThisMonth} new
            </Badge>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          All departments covered
        </div>
      </div>
    </CardContent>
  );
}

// Revenue Stats Component
async function RevenueStatsContent() {
  const stats = await getRevenueStats();

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">Revenue Collection</h3>
        <IndianRupee className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        <div className="text-2xl font-bold">
          {formatCurrency(stats.collectedRevenue)}
        </div>

        <Progress value={stats.revenuePercentage} className="h-2" />

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {formatCurrency(stats.pendingRevenue)} pending (
            {100 - stats.revenuePercentage}%)
          </p>

          <Badge
            variant="PASS"
            className='whitespace-nowrap'
          >
            {stats.revenuePercentage}% collected
          </Badge>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>This month: {formatCurrency(stats.thisMonthCollection)}</span>
          {stats.overdueFeesCount > 0 && (
            <span className="text-red-600 dark:text-red-400">
              {stats.overdueFeesCount} overdue
            </span>
          )}
        </div>
      </div>
    </CardContent>
  );
}

// Issues Stats Component
async function IssuesStatsContent() {
  const stats = await getIssuesStats();
  const resolutionRate =
    stats.totalIssues > 0
      ? Math.round((stats.resolvedIssues / stats.totalIssues) * 100)
      : 0;

  return (
    <CardContent className="pt-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">Issues & Complaints</h3>
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        <div className="text-2xl font-bold">{stats.pendingIssues}</div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Issues awaiting resolution
          </p>

          {stats.criticalIssues > 0 && (
            <Badge
              variant="outline"
              className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
            >
              {stats.criticalIssues} critical
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <CheckCircle className="w-3 h-3 text-green-500" />
            {stats.resolvedIssues} resolved ({resolutionRate}%)
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            {stats.totalIssues} total
          </div>
        </div>
      </div>
    </CardContent>
  );
}

// Main Component
const AdminDashboardCards = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-card via-card to-blue-50/20 dark:to-blue-950/20">
        <Suspense fallback={<CardStatsSkeleton />}>
          <StudentStatsContent />
        </Suspense>
      </Card>

      <Card className="bg-gradient-to-br from-card via-card to-green-50/20 dark:to-green-950/20">
        <Suspense fallback={<CardStatsSkeleton />}>
          <TeacherStatsContent />
        </Suspense>
      </Card>

      <Card className="bg-gradient-to-br from-card via-card to-emerald-50/20 dark:to-emerald-950/20">
        <Suspense fallback={<CardStatsSkeleton />}>
          <RevenueStatsContent />
        </Suspense>
      </Card>

      <Card className="bg-gradient-to-br from-card via-card to-red-50/20 dark:to-red-950/20">
        <Suspense fallback={<CardStatsSkeleton />}>
          <IssuesStatsContent />
        </Suspense>
      </Card>
    </div>
  );
};

export default AdminDashboardCards;