'use server';

import prisma from '@/lib/db';
import { getCurrentAcademicYearId } from '@/lib/academicYear';
import { getOrganizationId } from '@/lib/organization';
import { getRelativeTime } from '@/lib/utils';
import { ActivityItem } from '@/app/components/dashboardComponents/RecentActivity';

/* ---------- helpers ---------- */
const rel = (d: Date | string) => getRelativeTime(new Date(d));

const severityToPriority = (s?: string): ActivityItem['priority'] => {
  if (s === 'CRITICAL') return 'critical';
  if (s === 'HIGH') return 'high';
  if (s === 'MEDIUM') return 'medium';
  return 'low';
};

/* ---------- main action ---------- */
export const getRecentAdminActivities = async (): Promise<ActivityItem[]> => {
  const [ayId, orgId] = await Promise.all([
    getCurrentAcademicYearId(),
    getOrganizationId(),
  ]);

  const [
    payments,
    complaints,
    notices,
    attendance,
    documents,
    teachers,
    students,
    academicCal,
  ] = await Promise.all([
    prisma.feePayment.findMany({
      where: { organizationId: orgId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { fee: { include: { student: true } }, payer: true },
    }),
    prisma.anonymousComplaint.findMany({
      where: { academicYearId: ayId, organizationId: orgId },
      take: 10,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notice.findMany({
      where: { academicYearId: ayId, organizationId: orgId },
      take: 10,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.studentAttendance.findMany({
      where: { academicYearId: ayId, section: { organizationId: orgId } },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { student: true, section: { include: { grade: true } } },
    }),
    prisma.studentDocument.findMany({
      where: { organizationId: orgId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { student: true },
    }),
    prisma.teacher.findMany({
      where: { organizationId: orgId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    }),
    prisma.student.findMany({
      where: { organizationId: orgId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { grade: true, section: true },
    }),
    prisma.academicCalendar.findMany({
      where: { organizationId: orgId },
      take: 10,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const activities: ActivityItem[] = [];

  payments.forEach((p) => {
    const st = p.fee?.student || { firstName: 'Unknown', lastName: 'Student' };
    activities.push({
      id: `payment-${p.id}`,
      type: 'payment',
      title: 'Fee Payment Received',
      description: `${st.firstName} ${st.lastName} paid ₹${p.amount}`,
      iconStyle: 'payment',
      time: rel(p.createdAt),
      badge: { text: 'Paid', variant: 'green' },
      priority: 'medium',
      metadata: { amount: p.amount },
    });
  });

  complaints.forEach((c) => {
    activities.push({
      id: `complaint-${c.id}`,
      type: 'complaint',
      title: 'Anonymous Complaint Filed',
      description: `${c.subject} (ID: ${c.trackingId})`,
      iconStyle: 'complaint',
      time: rel(c.createdAt),
      badge: {
        text: c.currentStatus,
        variant: c.severity === 'CRITICAL' ? 'red' : 'yellow',
      },
      priority: severityToPriority(c.severity),
    });
  });

  notices.forEach((n) => {
    activities.push({
      id: `notice-${n.id}`,
      type: 'notice',
      title: 'Notice Published',
      description: n.summary || n.content.slice(0, 80),
      iconStyle: 'notice',
      time: rel(n.createdAt),
      badge: { text: n.noticeType, variant: 'purple' },
      priority: n.priority === 'URGENT' ? 'high' : 'medium',
    });
  });

  attendance.forEach((a) => {
    const st = a.student || { firstName: 'Unknown', lastName: 'Student' };
    const status = a.status || 'UNKNOWN';
    activities.push({
      id: `attendance-${a.id}`,
      type: 'attendance',
      title: 'Attendance Marked',
      description: `${st.firstName} ${st.lastName} marked ${status} on ${a.date?.toISOString().slice(0, 10) || 'unknown date'}`,
      iconStyle: 'attendance',
      time: rel(a.createdAt),
      badge: {
        text: status,
        variant: status === 'PRESENT' ? 'green' : 'orange',
      },
      priority: 'low',
    });
  });

  documents.forEach((d) => {
    const st = d.student || { firstName: 'Unknown', lastName: 'Student' };
    const isVerified = !!d.verified;
    activities.push({
      id: `document-${d.id}`,
      type: 'document',
      title: isVerified ? 'Document Verified' : 'Document Uploaded',
      description: `${d.type || 'Document'} for ${st.firstName} ${st.lastName}`,
      iconStyle: 'document',
      time: rel(d.createdAt),
      badge: {
        text: isVerified ? 'Verified' : 'Pending',
        variant: isVerified ? 'green' : 'yellow',
      },
      priority: 'low',
    });
  });

  teachers.forEach((t) => {
    activities.push({
      id: `teacher-${t.id}`,
      type: 'teacher',
      title: 'Teacher Profile Updated',
      description: `${t.user.firstName} ${t.user.lastName} joined as teacher`,
      iconStyle: 'teacher',
      time: rel(t.createdAt),
      badge: { text: 'New', variant: 'blue' },
      priority: 'low',
    });
  });

  students.forEach((s) => {
    const gradeInfo = s.grade ? `Grade ${s.grade.grade}` : '';
    const sectionInfo = s.section?.name ? `-${s.section.name}` : '';
    const gradeSection = gradeInfo || sectionInfo ? ` (${gradeInfo}${sectionInfo})` : '';
    
    activities.push({
      id: `student-${s.id}`,
      type: 'student',
      title: 'Student Record',
      description: `${s.firstName || ''} ${s.lastName || ''}${gradeSection}`.trim(),
      iconStyle: 'student',
      time: rel(s.createdAt),
      badge: { text: 'New', variant: 'blue' },
      priority: 'medium',
      metadata: { 
        grade: s.grade?.grade,
        section: s.section?.name 
      },
    });
  });

  academicCal.forEach((ac) => {
    activities.push({
      id: `system-${ac.id}`,
      type: 'system',
      title: 'Academic Calendar Updated',
      description: `${ac.name} from ${ac.startDate?.toDateString() || 'N/A'} to ${ac.endDate?.toDateString() || 'N/A'}`,
      iconStyle: 'system',
      time: rel(ac.createdAt),
      priority: 'medium',
      badge: {
        text: 'System',
        variant: 'blue'
      }
    });
  });

  return activities
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 50);
};
