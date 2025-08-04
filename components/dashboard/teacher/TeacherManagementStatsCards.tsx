'use client';

import type React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  UserCheck,
  Clock,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import { SelectedTeacher } from './TeachersTable';

interface TeacherStatsProps {
  teachers: SelectedTeacher[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  progress?: {
    value: number;
    max: number;
    label: string;
  };
  className?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  progress,
  className = '',
}: StatCardProps) => (
  <Card
    className={`relative overflow-hidden transition-all duration-200 hover:shadow-sm ${className}`}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
        <Icon className="h-4 w-4 " />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="text-2xl font-bold ">{value}</div>
      <div className="space-y-2">
        <p className="text-xs ">{description}</p>
        {trend && (
          <div className="flex items-center space-x-1">
            <TrendingUp
              className={`h-3 w-3 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}
            />
            <span
              className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}
            </span>
            <span className="text-xs text-gray-500">{trend.label}</span>
          </div>
        )}
        {progress && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">{progress.label}</span>
              <span className="font-medium">
                {progress.value}/{progress.max}
              </span>
            </div>
            <Progress
              value={(progress.value / progress.max) * 100}
              className="h-1.5"
            />
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export function TeacherManagementStatsCards({ teachers }: TeacherStatsProps) {
  // Calculate statistics
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter(
    (t) => t?.isActive && t?.employmentStatus === 'ACTIVE'
  ).length;
  const onLeaveTeachers = teachers.filter(
    (t) => t?.employmentStatus === 'ON_LEAVE'
  ).length;
  const probationTeachers = teachers.filter(
    (t) => t?.employmentStatus === 'PROBATION'
  ).length;
  const suspendedTeachers = teachers.filter(
    (t) => t?.employmentStatus === 'SUSPENDED'
  ).length;
  const inactiveTeachers = teachers.filter((t) => !t?.isActive).length;

  // Calculate average experience
  const teachersWithExperience = teachers.filter(
    (t) => t?.profile?.experienceInYears !== undefined
  );
  const avgExperience =
    teachersWithExperience.length > 0
      ? Math.round(
          teachersWithExperience.reduce(
            (acc, t) => acc + (t?.profile?.experienceInYears ?? 0),
            0
          ) / teachersWithExperience.length
        )
      : 0;

  // Calculate recent hires (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentHires = teachers.filter(
    (t) => t?.createdAt && new Date(t.createdAt) > thirtyDaysAgo
  ).length;

  // Calculate teachers with qualifications
  const qualifiedTeachers = teachers.filter(
    (t) => t?.profile?.qualification
  ).length;

  // Calculate active percentage
  const activePercentage =
    totalTeachers > 0 ? Math.round((activeTeachers / totalTeachers) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Teachers"
        value={totalTeachers}
        description="All registered teachers"
        icon={Users}
        trend={{
          value: recentHires,
          label: 'new this month',
          isPositive: recentHires > 0,
        }}
        className="border-l-4 border-l-blue-500"
      />

      <StatCard
        title="Active Teachers"
        value={activeTeachers}
        description={`${activePercentage}% of total staff`}
        icon={UserCheck}
        progress={{
          value: activeTeachers,
          max: totalTeachers,
          label: 'Active vs Total',
        }}
        className="border-l-4 border-l-green-500"
      />

      <StatCard
        title="On Leave"
        value={onLeaveTeachers}
        description="Currently unavailable"
        icon={Clock}
        trend={{
          value: Math.round((onLeaveTeachers / totalTeachers) * 100),
          label: '% of total',
          isPositive: false,
        }}
        className="border-l-4 border-l-yellow-500"
      />

      <StatCard
        title="Avg Experience"
        value={`${avgExperience} years`}
        description="Across all teachers"
        icon={GraduationCap}
        progress={{
          value: qualifiedTeachers,
          max: totalTeachers,
          label: 'With qualifications',
        }}
        className="border-l-4 border-l-purple-500"
      />
    </div>
  );
}
