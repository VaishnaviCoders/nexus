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
import {
  Users,
  IndianRupee,
  Calendar,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Plus,
} from 'lucide-react';

// Mock data - replace with actual API calls
const dashboardData = {
  stats: {
    totalStudents: 1247,
    totalRevenue: 2450000,
    attendanceRate: 87.5,
    pendingComplaints: 12,
    trends: {
      students: 5.2,
      revenue: 12.8,
      attendance: -2.1,
      complaints: -8.3,
    },
  },
  recentActivities: [
    {
      id: 1,
      type: 'student',
      message: 'New student admission: Rahul Sharma',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'fee',
      message: 'Fee payment received: ₹15,000',
      time: '4 hours ago',
    },
    {
      id: 3,
      type: 'complaint',
      message: 'Complaint resolved: Cafeteria issue',
      time: '6 hours ago',
    },
    {
      id: 4,
      type: 'attendance',
      message: 'Attendance marked for Grade 10-A',
      time: '1 day ago',
    },
  ],
  feeOverview: {
    collected: 1850000,
    pending: 600000,
    overdue: 125000,
  },
  upcomingEvents: [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      date: 'Dec 15, 2024',
      type: 'meeting',
    },
    { id: 2, title: 'Winter Break', date: 'Dec 20, 2024', type: 'holiday' },
    { id: 3, title: 'Annual Sports Day', date: 'Jan 10, 2025', type: 'event' },
  ],
};

export default function AdminDashboard() {
  const { stats, recentActivities, feeOverview, upcomingEvents } =
    dashboardData;

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening at your school today.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Quick Action
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalStudents.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />+
              {stats.trends.students}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(stats.totalRevenue / 100000).toFixed(1)}L
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />+
              {stats.trends.revenue}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              {stats.trends.attendance}% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Complaints
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingComplaints}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
              {stats.trends.complaints}% from last week
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Fee Overview */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Fee Collection Overview</CardTitle>
            <CardDescription>
              Current academic year fee collection status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Collected
                </span>
                <span className="font-medium">
                  ₹{(feeOverview.collected / 100000).toFixed(1)}L
                </span>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                  Pending
                </span>
                <span className="font-medium">
                  ₹{(feeOverview.pending / 100000).toFixed(1)}L
                </span>
              </div>
              <Progress value={24} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                  Overdue
                </span>
                <span className="font-medium">
                  ₹{(feeOverview.overdue / 100000).toFixed(1)}L
                </span>
              </div>
              <Progress value={5} className="h-2" />
            </div>

            <div className="flex gap-2 pt-4">
              <Button size="sm" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
              <Button size="sm">Generate Report</Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Important dates and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.date}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Latest updates and activities across the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  {activity.type === 'student' && <Users className="h-4 w-4" />}
                  {activity.type === 'fee' && (
                    <IndianRupee className="h-4 w-4" />
                  )}
                  {activity.type === 'complaint' && (
                    <ShieldAlert className="h-4 w-4" />
                  )}
                  {activity.type === 'attendance' && (
                    <Calendar className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
