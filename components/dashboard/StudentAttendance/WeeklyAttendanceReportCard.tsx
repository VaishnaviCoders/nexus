'use client';
import React, { useState } from 'react';
import {
  Calendar,
  User,
  School,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { formatDateIN } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WeeklyAttendanceReportData } from '@/types';

const WeeklyAttendanceReportCard: React.FC<{
  data: WeeklyAttendanceReportData;
}> = ({ data }) => {
  const {
    student,
    attendanceRecords,
    weekRange,
    organization,
    cumulativeStats,
  } = data;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Calculate weekly statistics
  const weeklyStats = React.useMemo(() => {
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter((r) => r.present).length;
    const lateDays = attendanceRecords.filter(
      (r) => r.status === 'LATE'
    ).length;
    const absentDays = totalDays - presentDays - lateDays;

    const attendancePercentage =
      totalDays > 0
        ? Math.round(((presentDays + lateDays) / totalDays) * 100)
        : 0;

    return {
      totalDays,
      presentDays,
      lateDays,
      absentDays,
      attendancePercentage,
    };
  }, [attendanceRecords]);

  // Status configuration for consistent styling and icons
  const statusConfig = {
    PRESENT: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      label: 'Present',
      emoji: '✅',
    },
    ABSENT: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      label: 'Absent',
      emoji: '❌',
    },
    UNEXCUSED_ABSENT: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      label: 'Unexcused Absent',
      emoji: '❌',
    },
    EXCUSED_ABSENT: {
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      label: 'Excused Absent',
      emoji: '📋',
    },
    LATE: {
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      label: 'Late',
      emoji: '⏰',
    },
    EARLY_DISMISSAL: {
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      label: 'Early Dismissal',
      emoji: '🏃',
    },
  };

  const getAttendanceMessage = (percentage: number) => {
    if (percentage >= 95)
      return {
        message: 'Excellent attendance! Keep up the outstanding work.',
        color: 'text-green-600',
      };
    if (percentage >= 90)
      return {
        message: 'Great attendance! Well done.',
        color: 'text-green-600',
      };
    if (percentage >= 85)
      return {
        message: 'Good attendance. Keep it consistent.',
        color: 'text-blue-600',
      };
    if (percentage >= 75)
      return {
        message:
          'Attendance needs improvement. Please ensure regular attendance.',
        color: 'text-yellow-600',
      };
    return {
      message: 'Poor attendance. Please contact the school immediately.',
      color: 'text-red-600',
    };
  };

  const attendanceMessage = getAttendanceMessage(
    weeklyStats.attendancePercentage
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 text-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border-dashed hover:border-solid"
        >
          <Sparkles className="w-4 h-4 text-blue-400 " />
          Report
          {/* Generate AI Summary */}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4 pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            Weekly Attendance Report
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Past-week attendance summary for {student.firstName}. Dates shown
            are <strong>Monday – Sunday</strong> of the selected week.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full mx-auto  bg-white rounded-xl shadow-lg overflow-hidden print:shadow-none print:max-w-none">
          {/* Header with School Branding */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 print:bg-blue-600">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                {organization.organizationLogo && (
                  <img
                    src={organization.organizationLogo}
                    alt={organization.name || 'organization'}
                    className="w-16 h-16 rounded-full bg-white p-2 object-contain"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold">{organization.name}</h1>
                  <p className="text-blue-100 text-sm">
                    Weekly Attendance Report
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 text-blue-100 text-sm">
                  <Calendar className="w-4 h-4" />
                  <p className="text-sm  ">
                    Week of {formatDateIN(weekRange.startDate)} –{' '}
                    {formatDateIN(weekRange.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="">
            {/* Student Information */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4 flex-wrap gap-4">
                <div className="flex-shrink-0">
                  {student.profileImage ? (
                    <img
                      src={student.profileImage}
                      alt={`${student.firstName} ${student.lastName}`}
                      className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-4 border-blue-100">
                      <User className="w-10 h-10 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-900 truncate">
                    {student.firstName}{' '}
                    {student.middleName && `${student.middleName} `}
                    {student.lastName}
                  </h2>
                  <div className="flex items-center space-x-6 mt-2 text-gray-600 flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <School className="w-4 h-4" />
                      <span>
                        Grade {student.grade.grade} - Section{' '}
                        {student.section.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Roll No:</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {student.rollNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Statistics Dashboard */}
            <div className="p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Weekly Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-blue-600">
                    {weeklyStats.attendancePercentage}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Attendance Rate
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-green-600">
                    {weeklyStats.presentDays}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Days Present</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-red-600">
                    {weeklyStats.absentDays}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Total Absences
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-orange-600">
                    {weeklyStats.lateDays}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Late Arrivals
                  </div>
                </div>
              </div>

              {/* Attendance Progress Bar */}
              <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Weekly Progress
                  </span>
                  <span className="text-sm text-gray-500">
                    {weeklyStats.attendancePercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      weeklyStats.attendancePercentage >= 90
                        ? 'bg-green-500'
                        : weeklyStats.attendancePercentage >= 75
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${weeklyStats.attendancePercentage}%` }}
                  />
                </div>
                <p className={`mt-2 text-sm ${attendanceMessage.color}`}>
                  {attendanceMessage.message}
                </p>
              </div>
            </div>

            {/* Daily Attendance Grid */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Daily Attendance Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendanceRecords.map((record, index) => {
                  const config = statusConfig[record.status];
                  const IconComponent = config.icon;

                  return (
                    <div
                      key={index}
                      className={`rounded-lg border-2 p-4 transition-all hover:shadow-md ${config.bgColor} ${config.borderColor}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium text-gray-900">
                          {formatDateIN(record.date)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{config.emoji}</span>
                          <IconComponent
                            className={`w-5 h-5 ${config.color}`}
                          />
                        </div>
                      </div>
                      <div
                        className={`text-sm font-medium mb-2 ${config.color}`}
                      >
                        {config.label}
                      </div>
                      {record.note && (
                        <div className="text-xs text-gray-600 mt-2 p-2 bg-white bg-opacity-70 rounded border">
                          <strong>Note:</strong> {record.note}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cumulative Attendance (if available) */}
            {cumulativeStats && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Year-to-Date Attendance
                </h3>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">
                        {cumulativeStats.attendancePercentage}%
                      </div>
                      <div className="text-sm text-gray-600">
                        Overall Attendance
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div>{cumulativeStats.totalDaysPresent} days present</div>
                      <div>
                        out of {cumulativeStats.totalPossibleDays} total days
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        cumulativeStats.attendancePercentage >= 90
                          ? 'bg-green-500'
                          : cumulativeStats.attendancePercentage >= 75
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{
                        width: `${cumulativeStats.attendancePercentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Status Legend */}
            <div className="p-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Status Legend
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(statusConfig).map(([status, config]) => {
                  const IconComponent = config.icon;
                  return (
                    <div key={status} className="flex items-center space-x-2">
                      <span className="text-lg">{config.emoji}</span>
                      <IconComponent className={`w-4 h-4 ${config.color}`} />
                      <span className="text-sm text-gray-600">
                        {config.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 bg-gray-100 text-center border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p>Report generated on {new Date().toLocaleDateString()}</p>
              <div className="flex items-center justify-center space-x-4 flex-wrap gap-2">
                {organization.contactEmail && (
                  <div className="flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>{organization.contactEmail}</span>
                  </div>
                )}
                {organization.contactPhone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>{organization.contactPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeeklyAttendanceReportCard;
