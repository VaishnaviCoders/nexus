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
      className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-slate-200 dark:border-slate-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-6 pb-0">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-background">
            <AvatarImage
              src={child.profileImage || ''}
              alt={`${child.firstName} ${child.lastName}`}
            />
            <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-500 dark:text-slate-300">
              {child.firstName.charAt(0)}
              {child.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-xl font-medium tracking-tight">
              {child.firstName} {child.lastName}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {child.grade?.grade && (
                <Badge variant="secondary" className="font-normal">
                  Grade {child.grade.grade}
                </Badge>
              )}
              {child.section?.name && (
                <Badge variant="outline" className="font-normal">
                  Section {child.section.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Date of Birth"
            >
              {new Intl.DateTimeFormat('en-US').format(
                new Date(child.dateOfBirth)
              )}
            </InfoItem>

            {child.rollNumber && (
              <InfoItem icon={<Hash className="h-4 w-4" />} label="Roll Number">
                {child.rollNumber}
              </InfoItem>
            )}

            {child.phoneNumber && (
              <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone">
                {child.phoneNumber}
              </InfoItem>
            )}

            <InfoItem
              icon={<GraduationCap className="h-4 w-4" />}
              label="Class"
            >
              {child.grade?.grade
                ? `Grade ${child.grade.grade}${
                    child.section?.name ? ` - ${child.section.name}` : ''
                  }`
                : 'Not assigned'}
            </InfoItem>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Attendance</span>
              </div>
              <span className="text-sm font-medium">
                {Math.round(attendanceRate)}%
              </span>
            </div>
            <AttendanceBar rate={attendanceRate} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                Details
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    isHovered ? 'translate-x-0.5' : ''
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View detailed student information</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="secondary" size="sm">
          Contact
        </Button>
      </CardFooter>
    </Card>
  );
}

function InfoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-start gap-2 text-sm">
            <div className="mt-0.5 text-muted-foreground">{icon}</div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-medium">{children}</p>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {label}: {children}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function AttendanceBar({ rate }: { rate: number }) {
  let color = '';

  if (rate >= 90) {
    color = 'bg-emerald-500';
  } else if (rate >= 75) {
    color = 'bg-amber-500';
  } else if (rate >= 50) {
    color = 'bg-orange-500';
  } else {
    color = 'bg-red-500';
  }

  return (
    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-500 ease-in-out`}
        style={{ width: `${rate}%` }}
      />
    </div>
  );
}

function calculateAttendanceRate(attendance: any[] | undefined): number {
  if (!attendance || attendance.length === 0) return 0;

  const present = attendance.filter((a) => a.status === 'PRESENT').length;
  return (present / attendance.length) * 100;
}
