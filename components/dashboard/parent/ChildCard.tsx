'use client';

import type React from 'react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  Clock,
  GraduationCap,
  Hash,
  Phone,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChildType {
  profileImage?: string | null;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber?: string;
  rollNumber?: string;
  StudentAttendance?: Array<{
    id: string;
    date: string | Date;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
  }>;
  section?: {
    name: string;
  };
  grade?: {
    grade: string;
  };
}

interface ChildCardProps {
  child: ChildType;
}

export function ChildCard({ child }: ChildCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const attendanceRate = calculateAttendanceRate(child.StudentAttendance);

  return (
    <Card
      className="w-full h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-background shadow-lg">
              <AvatarImage
                src={child.profileImage || ''}
                alt={`${child.firstName} ${child.lastName}`}
              />
              <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-primary font-semibold text-lg">
                {child.firstName.charAt(0)}
                {child.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {attendanceRate >= 90 && (
              <div className="absolute -top-1 -right-1 p-1 bg-green-500 rounded-full">
                <Award className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-semibold tracking-tight leading-tight">
              {child.firstName} {child.lastName}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {child.grade?.grade && (
                <Badge variant="default" className="font-medium">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  {child.grade.grade}
                </Badge>
              )}
              {child.section?.name && (
                <Badge variant="secondary" className="font-medium">
                  {child.section.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-2 space-y-6">
        {/* Student Info Grid */}
        <div className="grid grid-cols-1 gap-4">
          <InfoItem
            icon={<Calendar className="h-4 w-4" />}
            label="Date of Birth"
            value={new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }).format(new Date(child.dateOfBirth))}
          />

          {child.rollNumber && (
            <InfoItem
              icon={<Hash className="h-4 w-4" />}
              label="Roll Number"
              value={child.rollNumber}
            />
          )}

          {child.phoneNumber && (
            <InfoItem
              icon={<Phone className="h-4 w-4" />}
              label="Phone"
              value={child.phoneNumber}
            />
          )}
        </div>

        {/* Attendance Section */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Attendance Rate</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-lg font-bold">
                {Math.round(attendanceRate)}%
              </span>
            </div>
          </div>
          <AttendanceBar rate={attendanceRate} />
          <p className="text-xs text-muted-foreground">
            Based on {child.StudentAttendance?.length || 0} recorded days
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex flex-row gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="flex-1 gap-2 group"
              >
                View Details
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    isHovered ? 'translate-x-1' : ''
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View detailed academic information and reports</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button variant="outline" size="sm" className="flex-1">
          <Phone className="h-4 w-4 mr-1" />
          Contact
        </Button>
      </CardFooter>
    </Card>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
          {label}
        </p>
        <p className="font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function AttendanceBar({ rate }: { rate: number }) {
  let colorClass = '';
  let bgClass = '';

  if (rate >= 90) {
    colorClass = 'bg-gradient-to-r from-green-500 to-emerald-500';
    bgClass = 'bg-green-100 dark:bg-green-900/20';
  } else if (rate >= 75) {
    colorClass = 'bg-gradient-to-r from-yellow-500 to-amber-500';
    bgClass = 'bg-yellow-100 dark:bg-yellow-900/20';
  } else if (rate >= 50) {
    colorClass = 'bg-gradient-to-r from-orange-500 to-red-500';
    bgClass = 'bg-orange-100 dark:bg-orange-900/20';
  } else {
    colorClass = 'bg-gradient-to-r from-red-500 to-red-600';
    bgClass = 'bg-red-100 dark:bg-red-900/20';
  }

  return (
    <div
      className={`h-3 w-full ${bgClass} rounded-full overflow-hidden relative`}
    >
      <div
        className={`h-full ${colorClass} rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
        style={{ width: `${rate}%` }}
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
      </div>
    </div>
  );
}

function calculateAttendanceRate(attendance: any[] | undefined): number {
  if (!attendance || attendance.length === 0) return 0;

  const present = attendance.filter((a) => a.status === 'PRESENT').length;
  return (present / attendance.length) * 100;
}
