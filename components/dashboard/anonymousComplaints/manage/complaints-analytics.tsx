'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface AnalyticsProps {
  analytics: {
    totalComplaints: number;
    pendingComplaints: number;
    resolvedComplaints: number;
    criticalComplaints: number;
    averageResolutionTime: number;
    categoryBreakdown: Record<string, number>;
    severityBreakdown: Record<string, number>;
    statusBreakdown: Record<string, number>;
    monthlyTrends: Array<{ month: string; count: number; resolved: number }>;
  };
}

const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  slate: '#64748b',
};

const severityColors = {
  LOW: COLORS.success,
  MEDIUM: COLORS.warning,
  HIGH: '#f97316',
  CRITICAL: COLORS.danger,
};

const statusColors = {
  PENDING: COLORS.warning,
  UNDER_REVIEW: COLORS.info,
  INVESTIGATING: COLORS.secondary,
  RESOLVED: COLORS.success,
  REJECTED: COLORS.danger,
  CLOSED: COLORS.slate,
};

export function ComplaintAnalytics({ analytics }: AnalyticsProps) {
  const resolutionRate =
    analytics.totalComplaints > 0
      ? Math.round(
          (analytics.resolvedComplaints / analytics.totalComplaints) * 100
        )
      : 0;

  const categoryData = Object.entries(analytics.categoryBreakdown).map(
    ([category, count]) => ({
      name: category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      value: count,
    })
  );

  const severityData = Object.entries(analytics.severityBreakdown).map(
    ([severity, count]) => ({
      name: severity,
      value: count,
      color: severityColors[severity as keyof typeof severityColors],
    })
  );

  const statusData = Object.entries(analytics.statusBreakdown).map(
    ([status, count]) => ({
      name: status.replace('_', ' '),
      value: count,
      color: statusColors[status as keyof typeof statusColors],
    })
  );

  const trendData = analytics.monthlyTrends.map((item) => ({
    ...item,
    resolutionRate:
      item.count > 0 ? Math.round((item.resolved / item.count) * 100) : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className=" backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Resolution Rate
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {resolutionRate}%
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className=" backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Avg. Resolution Time
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {analytics.averageResolutionTime}d
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">-2 days improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card className=" backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Active Cases
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {analytics.totalComplaints - analytics.resolvedComplaints}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-slate-600">
                {analytics.pendingComplaints} pending review
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className=" backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Critical Issues
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {analytics.criticalComplaints}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-600">Immediate attention required</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trends */}
        <Card className=" backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>
              Complaint submissions and resolutions over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stackId="1"
                  stroke={COLORS.primary}
                  fill={COLORS.primary}
                  fillOpacity={0.6}
                  name="Total Complaints"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stackId="2"
                  stroke={COLORS.success}
                  fill={COLORS.success}
                  fillOpacity={0.6}
                  name="Resolved"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className=" backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Complaints by Category</CardTitle>
            <CardDescription>
              Distribution of complaints across different categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="value" fill={COLORS.primary} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Severity Distribution */}
        <Card className=" backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
            <CardDescription>
              Breakdown of complaints by severity level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className=" backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>
              Current status breakdown of all complaints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resolution Rate Trend */}
      <Card className=" backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Resolution Rate Trend</CardTitle>
          <CardDescription>
            Monthly resolution rate percentage over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Resolution Rate']}
              />
              <Line
                type="monotone"
                dataKey="resolutionRate"
                stroke={COLORS.success}
                strokeWidth={3}
                dot={{ fill: COLORS.success, strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-800">Top Performing</h3>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">Resolution Rate</span>
                <Badge className="bg-green-100 text-green-800">
                  {resolutionRate}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">
                  Avg. Response Time
                </span>
                <Badge className="bg-green-100 text-green-800">2.3 days</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className=" bg-gradient-to-r from-yellow-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-yellow-800">Needs Attention</h3>
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-700">Pending Review</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {analytics.pendingComplaints}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-700">Overdue Cases</span>
                <Badge className="bg-yellow-100 text-yellow-800">3</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className=" bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-blue-800">Insights</h3>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Most Common</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {Object.entries(analytics.categoryBreakdown)
                    .sort(([, a], [, b]) => b - a)[0]?.[0]
                    ?.replace('-', ' ')
                    ?.replace(/\b\w/g, (l) => l.toUpperCase()) || 'N/A'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Peak Month</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {trendData.sort((a, b) => b.count - a.count)[0]?.month ||
                    'N/A'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
