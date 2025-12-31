"use server"

import prisma from "@/lib/db";
import { NotificationChannel, NotificationType } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";

const DEFAULT_SETTINGS = [
  {
    type: NotificationType.ATTENDANCE_ALERT,
    label: "Attendance Absent/Late",
    description: "Notify parents when student is absent or arrives late",
    displayOrder: 1,
    channels: {
      SMS: { enabled: false, locked: false },
      WHATSAPP: { enabled: true, locked: false },
      PUSH: { enabled: true, locked: false },
      EMAIL: { enabled: false, locked: false }
    }
  },
  {
    type: NotificationType.FEE_REMINDER,
    label: "Fees",
    description: "Payment reminders and receipts",
    displayOrder: 2,
    isCategory: true,
    channels: {
      friendly_reminder: {
        label: "Friendly Reminder",
        SMS: { enabled: false, locked: false },
        WHATSAPP: { enabled: true, locked: false },
        PUSH: { enabled: true, locked: false },
        EMAIL: { enabled: true, locked: false }
      },
      overdue_notice: {
        label: "Overdue Notice",
        SMS: { enabled: true, locked: false },
        WHATSAPP: { enabled: true, locked: false },
        PUSH: { enabled: true, locked: false },
        EMAIL: { enabled: true, locked: false }
      },
      payment_due_today: {
        label: "Payment Due Today",
        SMS: { enabled: true, locked: false },
        WHATSAPP: { enabled: true, locked: false },
        PUSH: { enabled: true, locked: false },
        EMAIL: { enabled: false, locked: false }
      },
      payment_success: {
        label: "Payment Success",
        SMS: { enabled: false, locked: false },
        WHATSAPP: { enabled: false, locked: false },
        PUSH: { enabled: true, locked: false },
        EMAIL: { enabled: true, locked: false }
      },
      payment_failed: {
        label: "Payment Failed",
        SMS: { enabled: true, locked: false },
        WHATSAPP: { enabled: true, locked: false },
        PUSH: { enabled: true, locked: false },
        EMAIL: { enabled: true, locked: false }
      }
    }
  },
  {
    type: NotificationType.NOTICE,
    label: "Notice",
    description: "School announcements and notices",
    displayOrder: 3,
    isCategory: true,
    channels: {
      urgent_notice: {
        label: "Urgent Notice",
        SMS: { enabled: true, locked: false },
        WHATSAPP: { enabled: true, locked: false },
        PUSH: { enabled: true, locked: false },
        EMAIL: { enabled: true, locked: false }
      },
      general_notice: {
        label: "General Notice",
        SMS: { enabled: false, locked: false },
        WHATSAPP: { enabled: true, locked: false },
        PUSH: { enabled: true, locked: false },
        EMAIL: { enabled: true, locked: false }
      }
    }
  },
  {
    type: NotificationType.EXAM,
    label: "Exam Alerts",
    description: "Exam schedules, hall tickets, and results",
    displayOrder: 4,
    isCategory: true,
    channels: {
      exam_created: {
        label: "Exam Created",
        SMS: { enabled: false, locked: false },
        WHATSAPP: { enabled: true, locked: false },
        PUSH: { enabled: true, locked: false },
        EMAIL: { enabled: true, locked: false }
      },
      exam_reminder: {
        label: "Exam Reminder (1 Day Before)",
        SMS: { enabled: false, locked: false },
        WHATSAPP: { enabled: true, locked: false },
        PUSH: { enabled: true, locked: false },
        EMAIL: { enabled: false, locked: false }
      },
      exam_enroll: {
        label: "Exam Enrollment",
        SMS: { enabled: false, locked: false },
        WHATSAPP: { enabled: false, locked: false },
        PUSH: { enabled: true, locked: false },
        EMAIL: { enabled: true, locked: false }
      },
      exam_hall_ticket: {
        label: "Hall Ticket Available",
        SMS: { enabled: false, locked: false },
        WHATSAPP: { enabled: true, locked: false },
        PUSH: { enabled: true, locked: false },
        EMAIL: { enabled: true, locked: false }
      },
      exam_result: {
        label: "Exam Result Published",
        SMS: { enabled: false, locked: false },
        WHATSAPP: { enabled: true, locked: false },
        PUSH: { enabled: true, locked: false },
        EMAIL: { enabled: true, locked: false }
      }
    }
  },
  {
    type: NotificationType.DOCUMENT_REQUEST,
    label: "Document Updates",
    description: "Verification status and missing document alerts",
    displayOrder: 5,
    isCategory: true,
    channels: {
      document_missing: {
        label: "Document Missing",
        SMS: { enabled: false, locked: false },
        WHATSAPP: { enabled: true, locked: false },
        PUSH: { enabled: true, locked: false },
        EMAIL: { enabled: false, locked: false }
      },
      document_verified: {
        label: "Document Verified",
        SMS: { enabled: false, locked: false },
        WHATSAPP: { enabled: false, locked: false },
        PUSH: { enabled: true, locked: false },
        EMAIL: { enabled: true, locked: false }
      },
      document_rejected: {
        label: "Document Rejected",
        SMS: { enabled: false, locked: false },
        WHATSAPP: { enabled: true, locked: false },
        PUSH: { enabled: false, locked: false },
        EMAIL: { enabled: true, locked: false }
      }
    }
  },
  {
    type: NotificationType.LEAVE,
    label: "Leave Updates",
    description: "Status updates for leave requests",
    displayOrder: 6,
    isCategory: true,
    channels: {
      leave_approved: {
        label: "Leave Approved",
        SMS: { enabled: false, locked: false },
        WHATSAPP: { enabled: false, locked: false },
        PUSH: { enabled: false, locked: false },
        EMAIL: { enabled: true, locked: false }
      },
      leave_rejected: {
        label: "Leave Rejected",
        SMS: { enabled: false, locked: false },
        WHATSAPP: { enabled: false, locked: false },
        PUSH: { enabled: false, locked: false },
        EMAIL: { enabled: true, locked: false }
      }
    }
  },
  {
    type: NotificationType.ACADEMIC_REPORT,
    label: "Monthly Report",
    description: "Student performance summary",
    displayOrder: 7,
    channels: {
      SMS: { enabled: false, locked: true },
      WHATSAPP: { enabled: false, locked: true },
      PUSH: { enabled: false, locked: false },
      EMAIL: { enabled: true, locked: false }
    }
  },
  {
    type: NotificationType.GREETING,
    label: "Birthday Wishes",
    description: "Student birthday greetings",
    displayOrder: 8,
    channels: {
      SMS: { enabled: false, locked: false },
      WHATSAPP: { enabled: true, locked: false },
      PUSH: { enabled: true, locked: false },
      EMAIL: { enabled: false, locked: false }
    }
  }
];



export async function getOrganizationNotificationSettings(organizationId: string) {
  // 1. Fetch existing settings
  let settings = await prisma.notificationSetting.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'asc' },
  });

  // 2. If no settings exist, seed defaults
  if (settings.length === 0) {
    for (const group of DEFAULT_SETTINGS) {
      await prisma.notificationSetting.create({
        data: {
          organizationId,
          notificationType: group.type,
          label: group.label,
          description: group.description,
          channels: group.channels as Prisma.JsonObject,
          isActive: true,
        }
      });
    }

    // Refetch after seeding
    settings = await prisma.notificationSetting.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  // console.log("Notification Setting For Organization", organizationId, settings.map((setting) => setting.channels))

  console.dir(settings.map(s => s.channels), { depth: null });

  return settings;
}
