'use client';

import { useState } from 'react';
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
} from 'recharts';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FeeSenseExecutionLog } from '@/generated/prisma/client';

// // Mock data for execution logs
// const logs = [
//   {
//     id: '1',
//     startedAt: new Date(Date.now() - 86400000),
//     completedAt: new Date(Date.now() - 82800000),
//     status: 'SUCCESS',
//     studentsAnalyzed: 1247,
//     remindersGenerated: 342,
//     emailsSent: 328,
//     smsSent: 14,
//     voiceCallsScheduled: 0,
//     totalAmountOverdue: 45230.5,
//   },
//   {
//     id: '2',
//     startedAt: new Date(Date.now() - 172800000),
//     completedAt: new Date(Date.now() - 169200000),
//     status: 'SUCCESS',
//     studentsAnalyzed: 1251,
//     remindersGenerated: 356,
//     emailsSent: 341,
//     smsSent: 15,
//     voiceCallsScheduled: 2,
//     totalAmountOverdue: 48920.75,
//   },
//   {
//     id: '3',
//     startedAt: new Date(Date.now() - 259200000),
//     completedAt: new Date(Date.now() - 255600000),
//     status: 'PARTIAL',
//     studentsAnalyzed: 1200,
//     remindersGenerated: 298,
//     emailsSent: 290,
//     smsSent: 8,
//     voiceCallsScheduled: 1,
//     totalAmountOverdue: 42100.0,
//     errorMessage: 'SMS delivery service timeout for 7 messages',
//   },
//   {
//     id: '4',
//     startedAt: new Date(Date.now() - 345600000),
//     completedAt: null,
//     status: 'RUNNING',
//     studentsAnalyzed: 890,
//     remindersGenerated: 0,
//     emailsSent: 0,
//     smsSent: 0,
//     voiceCallsScheduled: 0,
//     totalAmountOverdue: 0,
//   },
//   {
//     id: '5',
//     startedAt: new Date(Date.now() - 432000000),
//     completedAt: new Date(Date.now() - 428400000),
//     status: 'FAILED',
//     studentsAnalyzed: 0,
//     remindersGenerated: 0,
//     emailsSent: 0,
//     smsSent: 0,
//     voiceCallsScheduled: 0,
//     totalAmountOverdue: 0,
//     errorMessage: 'Database connection failed',
//   },
// ];

// Mock data for timeline chart
const chartData = [
  { date: 'Mon', runs: 1, successful: 1 },
  { date: 'Tue', runs: 1, successful: 1 },
  { date: 'Wed', runs: 1, successful: 1 },
  { date: 'Thu', runs: 1, successful: 0 },
  { date: 'Fri', runs: 1, successful: 1 },
  { date: 'Sat', runs: 0, successful: 0 },
  { date: 'Sun', runs: 1, successful: 1 },
];

const statusData = [
  { name: 'Success', value: 5, color: 'hsl(var(--chart-1))' },
  { name: 'Partial', value: 1, color: 'hsl(var(--chart-4))' },
  { name: 'Failed', value: 1, color: 'hsl(var(--destructive))' },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'SUCCESS':
      return {
        icon: CheckCircle2,
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        badge: 'bg-green-500/20 text-green-700 dark:text-green-400',
        label: 'Success',
      };
    case 'RUNNING':
      return {
        icon: Clock,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        badge: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
        label: 'Running',
      };
    case 'PARTIAL':
      return {
        icon: AlertTriangle,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        badge: 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
        label: 'Partial',
      };
    case 'FAILED':
      return {
        icon: AlertCircle,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        badge: 'bg-red-500/20 text-red-700 dark:text-red-400',
        label: 'Failed',
      };
    default:
      return {
        icon: Clock,
        color: 'text-gray-500',
        bg: 'bg-gray-500/10',
        badge: 'bg-gray-500/20 text-gray-700',
        label: 'Unknown',
      };
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (start: Date, end: Date | null) => {
  if (!end) return 'Running...';
  const ms = end.getTime() - start.getTime();
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
};

interface FeeSenseAgentLogsProps {
  executionLogs: FeeSenseExecutionLog[]; // Change to array
}
export default function FeeSenseAgentLogs({
  executionLogs,
}: FeeSenseAgentLogsProps) {
  const [sortBy, setSortBy] = useState('recent');

  const sortedLogs = [...executionLogs].sort((a, b) => {
    if (sortBy === 'recent') {
      return b.startedAt.getTime() - a.startedAt.getTime();
    }
    return 0;
  });

  const stats = {
    total: executionLogs.length,
    successful: executionLogs.filter((l) => l.status === 'SUCCESS').length,
    failed: executionLogs.filter((l) => l.status === 'FAILED').length,
    successRate:
      (
        (executionLogs.filter((l) => l.status === 'SUCCESS').length /
          executionLogs.filter((l) => l.status !== 'RUNNING').length) *
        100
      ).toFixed(1) + '%',
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Runs
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.total}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500/60" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Successful
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats.successful}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500/60" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Failed
                </p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {stats.failed}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500/60" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Success Rate
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.successRate}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500/60" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Execution Timeline */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Weekly Execution Timeline
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Bar
                  dataKey="runs"
                  fill="hsl(var(--chart-1))"
                  name="Total Runs"
                />
                <Bar
                  dataKey="successful"
                  fill="hsl(var(--chart-3))"
                  name="Successful"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Distribution */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-col gap-2">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Execution Logs
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Recent runs of the FeeSense agent
              </p>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="divide-y divide-border">
            {sortedLogs.map((log) => {
              const statusConfig = getStatusConfig(log.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={log.id}
                  className="p-6 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                        <StatusIcon
                          className={`h-5 w-5 ${statusConfig.color}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-foreground">
                            Execution #{log.id}
                          </h4>
                          <Badge className={statusConfig.badge}>
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(log.startedAt)}
                        </p>
                        {log.errorMessage && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            Error: {log.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-6 text-right min-w-max">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Duration
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {formatDuration(log.startedAt, log.completedAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Students
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {log.studentsAnalyzed}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Overdue</p>
                        <p className="text-sm font-medium text-foreground">
                          ${log.totalAmountOverdue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Outreach Summary */}
                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500/60" />
                      <span className="text-xs text-muted-foreground">
                        {log.emailsSent} emails
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-500/60" />
                      <span className="text-xs text-muted-foreground">
                        {log.smsSent} SMS
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-purple-500/60" />
                      <span className="text-xs text-muted-foreground">
                        {log.voiceCallsScheduled} calls
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500/60" />
                      <span className="text-xs text-muted-foreground">
                        {log.remindersGenerated} reminders
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
