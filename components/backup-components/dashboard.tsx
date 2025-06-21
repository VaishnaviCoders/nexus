'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  IndianRupee,
  Calendar,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BookOpen,
  UserCheck,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Filter,
  Download,
  Bell,
  Zap,
  Award,
  AlertCircle,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Enhanced mock data with realistic school metrics
const dashboardData = {
  overview: {
    totalStudents: 1247,
    activeStudents: 1198,
    newAdmissions: 47,
    totalRevenue: 2450000,
    monthlyRevenue: 245000,
    pendingFees: 125000,
    attendanceRate: 87.5,
    teacherStudentRatio: '1:24',
    pendingComplaints: 12,
    resolvedComplaints: 156,
    averageResolutionTime: '2.3 days',
  },
  trends: {
    students: { value: 5.2, isPositive: true },
    revenue: { value: 12.8, isPositive: true },
    attendance: { value: 2.1, isPositive: false },
    complaints: { value: 8.3, isPositive: true }, // positive means reduction
  },
  criticalAlerts: [
    {
      id: 1,
      type: 'urgent',
      title: 'Low Attendance Alert',
      description:
        'Grade 9-B has 68% attendance this week (below 75% threshold)',
      action: 'Review & Contact Parents',
      priority: 'high',
    },
    {
      id: 2,
      type: 'financial',
      title: 'Overdue Fees Alert',
      description: '₹1.25L in fees overdue by 30+ days from 23 students',
      action: 'Send Payment Reminders',
      priority: 'medium',
    },
    {
      id: 3,
      type: 'complaint',
      title: 'Unresolved Complaints',
      description: '3 high-priority complaints pending for >5 days',
      action: 'Immediate Review Required',
      priority: 'high',
    },
  ],
  performanceMetrics: {
    studentSatisfaction: 92,
    parentEngagement: 78,
    teacherEfficiency: 85,
    systemUptime: 99.8,
    dataAccuracy: 96.5,
    responseTime: 1.2, // seconds
  },
  recentActivities: [
    {
      id: 1,
      type: 'admission',
      title: 'New Student Enrolled',
      description: 'Priya Sharma - Grade 8-A',
      time: '12 minutes ago',
      status: 'success',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Bulk Fee Payment',
      description: '₹45,000 received from 15 students',
      time: '1 hour ago',
      status: 'success',
    },
    {
      id: 3,
      type: 'complaint',
      title: 'Complaint Resolved',
      description: 'Cafeteria hygiene issue - Grade 7 parents',
      time: '2 hours ago',
      status: 'resolved',
    },
    {
      id: 4,
      type: 'attendance',
      title: 'Attendance Marked',
      description: 'All sections completed for today',
      time: '3 hours ago',
      status: 'info',
    },
  ],
  gradePerformance: [
    {
      grade: 'Grade 12',
      students: 145,
      attendance: 92,
      feeCollection: 98,
      avgMarks: 78,
    },
    {
      grade: 'Grade 11',
      students: 156,
      attendance: 89,
      feeCollection: 95,
      avgMarks: 75,
    },
    {
      grade: 'Grade 10',
      students: 167,
      attendance: 85,
      feeCollection: 92,
      avgMarks: 72,
    },
    {
      grade: 'Grade 9',
      students: 178,
      attendance: 82,
      feeCollection: 88,
      avgMarks: 69,
    },
    {
      grade: 'Grade 8',
      students: 189,
      attendance: 88,
      feeCollection: 94,
      avgMarks: 74,
    },
  ],
  upcomingEvents: [
    {
      id: 1,
      title: 'Parent-Teacher Conference',
      date: 'Dec 15, 2024',
      type: 'academic',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Fee Payment Deadline',
      date: 'Dec 20, 2024',
      type: 'financial',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Winter Break Begins',
      date: 'Dec 22, 2024',
      type: 'holiday',
      priority: 'low',
    },
    {
      id: 4,
      title: 'Mid-term Exams',
      date: 'Jan 8, 2025',
      type: 'academic',
      priority: 'high',
    },
  ],
};

export default function PremiumAdminDashboard() {
  const {
    overview,
    trends,
    criticalAlerts,
    performanceMetrics,
    recentActivities,
    gradePerformance,
    upcomingEvents,
  } = dashboardData;

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'info':
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6  min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            School Command Center
          </h1>
          <p className="text-slate-600 text-base">
            Real-time insights and intelligent analytics for educational
            excellence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-blue-200 hover:bg-blue-50"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Zap className="mr-2 h-4 w-4" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {/* {criticalAlerts.length > 0 && (
        <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800 text-lg">
            Action Required
          </AlertTitle>
          <AlertDescription className="text-amber-700">
            <div className="mt-2 space-y-2">
              {criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-amber-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority.toUpperCase()}
                      </Badge>
                      <span className="font-semibold text-slate-800">
                        {alert.title}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {alert.description}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-4">
                    {alert.action}
                  </Button>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )} */}

      {/* Enhanced KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-5 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-blue-100">
              Total Students
            </CardTitle>
            <Users className="h-5 w-5 text-blue-200" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">
              {overview.totalStudents.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-blue-100 mt-2">
              <div className="flex items-center">
                {trends.students.isPositive ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {trends.students.value}% this month
              </div>
              <div className="ml-auto">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-0"
                >
                  {overview.newAdmissions} new
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-5 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-green-100">
              Revenue
            </CardTitle>
            <IndianRupee className="h-5 w-5 text-green-200" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">
              ₹{(overview.totalRevenue / 100000).toFixed(1)}L
            </div>
            <div className="flex items-center text-xs text-green-100 mt-2">
              <div className="flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                {trends.revenue.value}% growth
              </div>
              <div className="ml-auto">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-0"
                >
                  ₹{(overview.pendingFees / 1000).toFixed(0)}K pending
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-5 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-purple-100">
              Attendance Rate
            </CardTitle>
            <Calendar className="h-5 w-5 text-purple-200" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">{overview.attendanceRate}%</div>
            <div className="flex items-center text-xs text-purple-100 mt-2">
              <div className="flex items-center">
                <TrendingDown className="mr-1 h-3 w-3" />
                {trends.attendance.value}% vs target
              </div>
              <div className="ml-auto">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-0"
                >
                  {overview.teacherStudentRatio} ratio
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 text-white overflow-hidden relative">
          <div className="absolute top-0 right-5 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-orange-100">
              Complaint Resolution
            </CardTitle>
            <ShieldAlert className="h-5 w-5 text-orange-200" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">
              {overview.averageResolutionTime}
            </div>
            <div className="flex items-center text-xs text-orange-100 mt-2">
              <div className="flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                {trends.complaints.value}% faster
              </div>
              <div className="ml-auto">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-0"
                >
                  {overview.pendingComplaints} pending
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Dashboard */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2  border-0 shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl ">Grade-wise Performance</CardTitle>
            <CardDescription>
              Comprehensive overview of each grade's metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gradePerformance.map((grade, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg  border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold ">{grade.grade}</h4>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800"
                    >
                      {grade.students} students
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold ">
                        {grade.attendance}%
                      </div>
                      <div className="text-xs ">Attendance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold ">
                        {grade.feeCollection}%
                      </div>
                      <div className="text-xs ">Fee Collection</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold ">
                        {grade.avgMarks}%
                      </div>
                      <div className="text-xs ">Avg Marks</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">
              Upcoming Events
            </CardTitle>
            <CardDescription>Critical dates and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">
                        {event.title}
                      </p>
                      <Badge
                        className={getPriorityColor(event.priority)}
                        variant="outline"
                      >
                        {event.priority}
                      </Badge>
                    </div>
                    <p className="text-xs ">{event.date}</p>
                    <Badge variant="outline" className="text-xs">
                      {event.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grade Performance & Activities */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-slate-900">
                  Performance Analytics
                </CardTitle>
                <CardDescription>
                  Key performance indicators across all operations
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                Detailed View
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Student Satisfaction
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {performanceMetrics.studentSatisfaction}%
                  </span>
                </div>
                <Progress
                  value={performanceMetrics.studentSatisfaction}
                  className="h-2"
                />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Parent Engagement
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {performanceMetrics.parentEngagement}%
                  </span>
                </div>
                <Progress
                  value={performanceMetrics.parentEngagement}
                  className="h-2"
                />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Teacher Efficiency
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {performanceMetrics.teacherEfficiency}%
                  </span>
                </div>
                <Progress
                  value={performanceMetrics.teacherEfficiency}
                  className="h-2"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    System Uptime
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {performanceMetrics.systemUptime}%
                  </span>
                </div>
                <Progress
                  value={performanceMetrics.systemUptime}
                  className="h-2"
                />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Data Accuracy
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {performanceMetrics.dataAccuracy}%
                  </span>
                </div>
                <Progress
                  value={performanceMetrics.dataAccuracy}
                  className="h-2"
                />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Avg Response Time
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {performanceMetrics.responseTime}s
                  </span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">
              Recent Activities
            </CardTitle>
            <CardDescription>
              Live feed of important system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {activity.title}
                    </p>
                    <p className="text-xs ">{activity.description}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
