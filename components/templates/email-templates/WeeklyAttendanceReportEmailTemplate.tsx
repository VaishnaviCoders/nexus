'use client';

import { AttendanceStatus, Gender } from '@/generated/prisma/enums';
import { formatDateIN } from '@/lib/utils';
import type React from 'react';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  rollNumber: string;
  profileImage?: string;
  phoneNumber: string;
  email: string;
  gender: Gender;
  grade: { grade: string };
  section: { name: string };
}

export interface AttendanceRecord {
  id: string;
  date: string;
  present: boolean;
  status: AttendanceStatus;
  note?: string;
  recordedBy: string;
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
}

export interface WeeklyAttendanceData {
  student: Student;
  attendanceRecords: AttendanceRecord[];
  weekRange: {
    startDate: string;
    endDate: string;
  };
  organization: Organization;
  cumulativeStats?: {
    totalDaysPresent: number;
    totalPossibleDays: number;
    attendancePercentage: number;
    totalLateArrivals: number;
    consecutiveAbsences: number;
  };
  academicYear: string;
  reportGeneratedBy: string;
}

interface WeeklyAttendanceReportEmailTemplateProps {
  data: WeeklyAttendanceData;
}

const WeeklyAttendanceReportEmailTemplate: React.FC<
  WeeklyAttendanceReportEmailTemplateProps
> = ({ data }) => {
  const { student, attendanceRecords, weekRange, organization } = data;

  // Calculate basic stats
  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter(
    (r) => r.status === AttendanceStatus.PRESENT
  ).length;
  const lateDays = attendanceRecords.filter(
    (r) => r.status === AttendanceStatus.LATE
  ).length;
  const attendancePercentage =
    totalDays > 0
      ? Math.round(((presentDays + lateDays) / totalDays) * 100)
      : 0;

  // Status configuration
  const statusConfig = {
    [AttendanceStatus.PRESENT]: {
      emoji: '✅',
      label: 'Present',
      color: '#22c55e',
    },
    [AttendanceStatus.ABSENT]: {
      emoji: '❌',
      label: 'Absent',
      color: '#ef4444',
    },
    [AttendanceStatus.LATE]: { emoji: '⏰', label: 'Late', color: '#f59e0b' },
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return '#22c55e';
    if (percentage >= 75) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        lineHeight: '1.5',
        color: '#1f2937',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Header */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{ backgroundColor: '#ffffff' }}
      >
        <tr>
          <td
            style={{
              padding: '32px 24px 24px 24px',
              borderBottom: '1px solid #f3f4f6',
            }}
          >
            <table width="100%" cellPadding="0" cellSpacing="0">
              <tr>
                <td style={{ verticalAlign: 'middle' }}>
                  {organization.logo && (
                    <img
                      src={organization.logo || '/placeholder.svg'}
                      alt={organization.name}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        marginRight: '16px',
                        verticalAlign: 'middle',
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#111827',
                      verticalAlign: 'middle',
                    }}
                  >
                    {organization.name}
                  </span>
                </td>
                <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {formatDateIN(weekRange.startDate)} -{' '}
                    {formatDateIN(weekRange.endDate)}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      {/* Student Info & Attendance Summary */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{ backgroundColor: '#ffffff' }}
      >
        <tr>
          <td style={{ padding: '24px' }}>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 8px 0',
              }}
            >
              {student.firstName} {student.lastName}
            </h1>
            <div
              style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '24px',
              }}
            >
              Grade {student.grade.grade} • Section {student.section.name} •
              Roll No. {student.rollNumber}
            </div>

            {/* Attendance Summary */}
            <table
              width="100%"
              cellPadding="0"
              cellSpacing="0"
              style={{
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #f3f4f6',
              }}
            >
              <tr>
                <td style={{ padding: '24px' }}>
                  <table width="100%" cellPadding="0" cellSpacing="0">
                    <tr>
                      <td style={{ textAlign: 'center', width: '33.33%' }}>
                        <div
                          style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: getStatusColor(attendancePercentage),
                            margin: '0 0 4px 0',
                          }}
                        >
                          {attendancePercentage}%
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            fontWeight: '500',
                          }}
                        >
                          Attendance
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', width: '33.33%' }}>
                        <div
                          style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#22c55e',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {presentDays}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            fontWeight: '500',
                          }}
                        >
                          Present
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', width: '33.33%' }}>
                        <div
                          style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#6b7280',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {totalDays}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            fontWeight: '500',
                          }}
                        >
                          Total Days
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      {/* Daily Attendance */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{ backgroundColor: '#ffffff' }}
      >
        <tr>
          <td style={{ padding: '0 24px 24px 24px' }}>
            <h2
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 16px 0',
              }}
            >
              Daily Attendance
            </h2>

            <table width="100%" cellPadding="0" cellSpacing="0">
              {attendanceRecords.map((record, index) => {
                const config = statusConfig[record.status];
                const date = new Date(record.date);
                const dayName = date.toLocaleDateString('en-US', {
                  weekday: 'short',
                });

                return (
                  <tr key={index}>
                    <td
                      style={{
                        padding: '12px 0',
                        borderBottom:
                          index < attendanceRecords.length - 1
                            ? '1px solid #f3f4f6'
                            : 'none',
                      }}
                    >
                      <table width="100%" cellPadding="0" cellSpacing="0">
                        <tr>
                          <td
                            style={{ width: '60px', verticalAlign: 'middle' }}
                          >
                            <div
                              style={{
                                fontSize: '24px',
                                textAlign: 'center',
                              }}
                            >
                              {config.emoji}
                            </div>
                          </td>
                          <td style={{ verticalAlign: 'middle' }}>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#111827',
                                marginBottom: '2px',
                              }}
                            >
                              {dayName}, {formatDateIN(record.date)}
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: config.color,
                                fontWeight: '500',
                              }}
                            >
                              {config.label}
                            </div>
                          </td>
                          {record.note && (
                            <td
                              style={{
                                textAlign: 'right',
                                verticalAlign: 'middle',
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '12px',
                                  color: '#6b7280',
                                  fontStyle: 'italic',
                                  maxWidth: '120px',
                                }}
                              >
                                {record.note}
                              </div>
                            </td>
                          )}
                        </tr>
                      </table>
                    </td>
                  </tr>
                );
              })}
            </table>
          </td>
        </tr>
      </table>

      {/* Footer */}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{
          backgroundColor: '#f9fafb',
          borderTop: '1px solid #f3f4f6',
        }}
      >
        <tr>
          <td style={{ padding: '20px 24px', textAlign: 'center' }}>
            <div
              style={{
                fontSize: '12px',
                color: '#6b7280',
                marginBottom: '8px',
              }}
            >
              {organization.contactEmail && (
                <span style={{ marginRight: '16px' }}>
                  {organization.contactEmail}
                </span>
              )}
              {organization.contactPhone && (
                <span>{organization.contactPhone}</span>
              )}
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af' }}>
              Report generated on {new Date().toLocaleDateString('en-IN')}
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default WeeklyAttendanceReportEmailTemplate;
