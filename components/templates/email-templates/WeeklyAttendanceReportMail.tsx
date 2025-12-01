'use client';

import { AttendanceStatus, Gender } from '@/generated/prisma/enums';
import WeeklyAttendanceReportEmailTemplate from './WeeklyAttendanceReportEmailTemplate';

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

export default function MinimalEmailDemo() {
  const mockData: WeeklyAttendanceData = {
    student: {
      id: 'student_123',
      firstName: 'Arjun',
      lastName: 'Sharma',
      middleName: 'Kumar',
      rollNumber: 'STU2024001',
      profileImage: '/placeholder.svg?height=100&width=100',
      phoneNumber: '+91-9876543210',
      email: 'arjun.sharma@email.com',
      gender: 'MALE' as any,
      grade: { grade: '10' },
      section: { name: 'A' },
    },
    attendanceRecords: [
      {
        id: '1',
        date: '2024-01-15',
        present: true,
        status: AttendanceStatus.PRESENT,
        recordedBy: 'teacher_001',
      },
      {
        id: '2',
        date: '2024-01-16',
        present: true,
        status: AttendanceStatus.LATE,
        note: 'Traffic delay',
        recordedBy: 'teacher_001',
      },
      {
        id: '3',
        date: '2024-01-17',
        present: false,
        status: AttendanceStatus.ABSENT,
        note: 'Medical appointment',
        recordedBy: 'teacher_001',
      },
      {
        id: '4',
        date: '2024-01-18',
        present: true,
        status: AttendanceStatus.PRESENT,
        recordedBy: 'teacher_001',
      },
      {
        id: '5',
        date: '2024-01-19',
        present: true,
        status: AttendanceStatus.PRESENT,
        recordedBy: 'teacher_001',
      },
    ],
    weekRange: {
      startDate: '2024-01-15',
      endDate: '2024-01-19',
    },
    organization: {
      id: 'org_123',
      name: 'Delhi Public School',
      logo: '/placeholder.svg?height=48&width=48',
      contactEmail: 'info@dpsdelhi.edu.in',
      contactPhone: '+91-11-12345678',
      website: 'www.dpsdelhi.edu.in',
    },
    cumulativeStats: {
      totalDaysPresent: 142,
      totalPossibleDays: 160,
      attendancePercentage: 89,
      totalLateArrivals: 8,
      consecutiveAbsences: 0,
    },
    academicYear: '2024-25',
    reportGeneratedBy: 'system',
  };

  const handleCopyHTML = () => {
    const emailElement = document.getElementById('minimal-email-template');
    if (emailElement) {
      const htmlContent = emailElement.outerHTML;
      navigator.clipboard.writeText(htmlContent).then(() => {
        alert('Email HTML copied to clipboard!');
      });
    }
  };

  const handlePreviewEmail = () => {
    const emailElement = document.getElementById('minimal-email-template');
    if (emailElement) {
      const htmlContent = emailElement.outerHTML;
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Email Preview</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body style="margin: 0; padding: 20px; background-color: #f3f4f6;">
              ${htmlContent}
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Controls */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Minimal Email Template
          </h1>
          <p className="text-gray-600 mb-6">
            Clean, professional attendance report optimized for email delivery
            with Inter/Geist font family.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleCopyHTML}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Copy HTML
            </button>
            <button
              onClick={handlePreviewEmail}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Preview in New Tab
            </button>
          </div>
        </div>
      </div>

      {/* Email Template */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div id="minimal-email-template">
            <WeeklyAttendanceReportEmailTemplate data={mockData} />
          </div>
        </div>
      </div>
    </div>
  );
}
