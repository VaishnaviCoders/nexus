import { NotificationType } from "@/generated/prisma/enums";

export interface SMSTemplate {
  body: string;
}

export interface WhatsAppTemplate {
  body: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface PushTemplate {
  subject: string;
  body: string;
}

export interface NotificationTemplates {
  SMS?: SMSTemplate;
  WHATSAPP?: WhatsAppTemplate;
  EMAIL?: EmailTemplate;
  PUSH?: PushTemplate;
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  subKey?: string;
  templates: NotificationTemplates;
}

export interface BaseVariables {
  organizationName: string;
}

export interface AttendanceVariables extends BaseVariables {
  studentName: string;
  date: string | Date;
  grade: string;
  section: string;
  time?: string;
}

export interface FeeVariables extends BaseVariables {
  studentName: string;
  amount: string | number;
  dueDate?: string | Date;
  paymentLink?: string;
  receiptNumber?: string;
  receiptUrl?: string;
}

export interface ExamVariables extends BaseVariables {
  examName: string;
  date?: string | Date;
  time?: string;
  venue?: string;
  examUrl?: string;
  hallTicketUrl?: string;
  percentage?: string | number;
  resultUrl?: string;
}

export interface NoticeVariables extends BaseVariables {
  title: string;
  message: string;
}

export interface LeaveVariables extends BaseVariables {
  name: string;
  startDate?: string | Date;
  endDate?: string | Date;
  approvedBy?: string;
  reason?: string;
}

export interface DocumentVariables extends BaseVariables {
  studentName: string;
  documentType: string;
  uploadUrl?: string;
  reason?: string;
}

export interface AcademicVariables extends BaseVariables {
  studentName: string;
  month: string;
  attendance?: string | number;
  performance?: string;
}

export interface GreetingVariables extends BaseVariables {
  studentName: string;
}

export type TemplateVariablesMap = {
  STUDENT_ABSENT: AttendanceVariables;
  STUDENT_LATE: AttendanceVariables;
  NEW_FEE_CREATED: FeeVariables;
  FEE_REMINDER_FRIENDLY: FeeVariables;
  FEE_DUE_TODAY: FeeVariables;
  FEE_OVERDUE: FeeVariables;
  PAYMENT_SUCCESS: FeeVariables;
  PAYMENT_FAILED: FeeVariables;
  EXAM_CREATED: ExamVariables;
  EXAM_REMINDER: ExamVariables;
  EXAM_ENROLLMENT: ExamVariables;
  EXAM_HALL_TICKET: ExamVariables;
  RESULT_PUBLISHED: ExamVariables;
  GENERAL_NOTICE: NoticeVariables;
  URGENT_NOTICE: NoticeVariables;
  LEAVE_APPROVED: LeaveVariables;
  LEAVE_REJECTED: LeaveVariables;
  DOCUMENT_MISSING: DocumentVariables;
  DOCUMENT_APPROVED: DocumentVariables;
  DOCUMENT_REJECTED: DocumentVariables;
  MONTHLY_REPORT: AcademicVariables;
  BIRTHDAY_WISH: GreetingVariables;
};

export type NotificationVariables = TemplateVariablesMap[keyof TemplateVariablesMap];

export type NotificationTemplateId =
  | "STUDENT_ABSENT"
  | "STUDENT_LATE"
  | "NEW_FEE_CREATED"
  | "FEE_REMINDER_FRIENDLY"
  | "FEE_DUE_TODAY"
  | "FEE_OVERDUE"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "EXAM_CREATED"
  | "EXAM_REMINDER"
  | "EXAM_ENROLLMENT"
  | "EXAM_HALL_TICKET"
  | "RESULT_PUBLISHED"
  | "GENERAL_NOTICE"
  | "URGENT_NOTICE"
  | "LEAVE_APPROVED"
  | "LEAVE_REJECTED"
  | "DOCUMENT_MISSING"
  | "DOCUMENT_APPROVED"
  | "DOCUMENT_REJECTED"
  | "MONTHLY_REPORT"
  | "BIRTHDAY_WISH";

export const NOTIFICATION_TEMPLATES: Record<string, NotificationTemplate> = {
  // === ATTENDANCE ===
  STUDENT_ABSENT: {
    id: "STUDENT_ABSENT",
    type: "ATTENDANCE_ALERT",
    templates: {
      SMS: {
        body: "Dear Parent, {{studentName}} was marked ABSENT on {{date}}. - {{organizationName}}",
      },
      WHATSAPP: {
        body: "🔔 *Attendance Alert*\n\n{{studentName}} was marked ABSENT on {{date}}.\n\nClass: {{grade}}-{{section}}\n\n- {{organizationName}}",
      },
      EMAIL: {
        subject: "Attendance Alert - {{studentName}}",
        body: "Dear Parent,\n\n{{studentName}} was marked ABSENT on {{date}} in class {{grade}}-{{section}}.\n\nBest regards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Attendance Alert",
        body: "{{studentName}} was absent on {{date}}",
      },
    },
  },

  STUDENT_LATE: {
    id: "STUDENT_LATE",
    type: "ATTENDANCE_ALERT",
    templates: {
      SMS: {
        body: "Dear Parent, {{studentName}} arrived LATE on {{date}} at {{time}}. - {{organizationName}}",
      },
      WHATSAPP: {
        body: "🔔 *Attendance Alert*\n\n{{studentName}} arrived LATE on {{date}} at {{time}}.\n\nClass: {{grade}}-{{section}}\n\n- {{organizationName}}",
      },
      EMAIL: {
        subject: "Late Arrival Alert - {{studentName}}",
        body: "Dear Parent,\n\n{{studentName}} arrived late on {{date}} at {{time}} in class {{grade}}-{{section}}.\n\nBest regards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Late Arrival Alert",
        body: "{{studentName}} arrived late on {{date}} at {{time}}",
      },
    },
  },

  // === FEE MANAGEMENT ===
  NEW_FEE_CREATED: {
    id: "NEW_FEE_CREATED",
    type: "FEE_REMINDER",
    subKey: "friendly_reminder",
    templates: {
      SMS: {
        body: "New fee Rs {{amount}} due on {{dueDate}} for {{studentName}}. Pay: {{paymentLink}}",
      },
      WHATSAPP: {
        body: "💰 *New Fee*\n\nStudent: {{studentName}}\nAmount: Rs {{amount}}\nDue: {{dueDate}}\n\nPay: {{paymentLink}}",
      },
      EMAIL: {
        subject: "New Fee - {{studentName}}",
        body: "Dear Parent,\n\nNew fee of Rs {{amount}} for {{studentName}}.\nDue Date: {{dueDate}}\n\nPay online: {{paymentLink}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "New Fee",
        body: "New fee Rs {{amount}} due on {{dueDate}} for {{studentName}}",
      },
    },
  },

  FEE_REMINDER_FRIENDLY: {
    id: "FEE_REMINDER_FRIENDLY",
    type: "FEE_REMINDER",
    subKey: "friendly_reminder",
    templates: {
      SMS: {
        body: "Reminder: Fee Rs {{amount}} due on {{dueDate}} for {{studentName}}. Pay: {{paymentLink}}",
      },
      WHATSAPP: {
        body: "🔔 *Fee Reminder*\n\nStudent: {{studentName}}\nAmount: Rs {{amount}}\nDue: {{dueDate}}\n\nPay: {{paymentLink}}",
      },
      EMAIL: {
        subject: "Fee Reminder - {{studentName}}",
        body: "Dear Parent,\n\nThis is a reminder that fee of Rs {{amount}} for {{studentName}} is due on {{dueDate}}.\n\nPay online: {{paymentLink}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Fee Reminder",
        body: "Fee Rs {{amount}} due on {{dueDate}} for {{studentName}}",
      },
    },
  },

  FEE_DUE_TODAY: {
    id: "FEE_DUE_TODAY",
    type: "FEE_REMINDER",
    subKey: "payment_due_today",
    templates: {
      SMS: {
        body: "Fee Rs {{amount}} due TODAY for {{studentName}}. Pay now: {{paymentLink}}",
      },
      WHATSAPP: {
        body: "⏰ *Fee Due Today*\n\nStudent: {{studentName}}\nAmount: Rs {{amount}}\nDue: Today\n\nPay now: {{paymentLink}}",
      },
      EMAIL: {
        subject: "Fee Due Today - {{studentName}}",
        body: "Dear Parent,\n\nFee of Rs {{amount}} for {{studentName}} is due today.\n\nPlease pay: {{paymentLink}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Fee Due Today",
        body: "Fee Rs {{amount}} due today for {{studentName}}",
      },
    },
  },

  FEE_OVERDUE: {
    id: "FEE_OVERDUE",
    type: "FEE_REMINDER",
    subKey: "overdue_notice",
    templates: {
      SMS: {
        body: "URGENT: Fee Rs {{amount}} OVERDUE for {{studentName}}. Pay now: {{paymentLink}}",
      },
      WHATSAPP: {
        body: "🚨 *URGENT: Fee Overdue*\n\nStudent: {{studentName}}\nAmount: Rs {{amount}}\n\nPay immediately: {{paymentLink}}",
      },
      EMAIL: {
        subject: "URGENT: Overdue Fee - {{studentName}}",
        body: "Dear Parent,\n\nFee Rs {{amount}} for {{studentName}} is OVERDUE.\n\nPlease pay immediately: {{paymentLink}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Fee Overdue",
        body: "URGENT: Fee Rs {{amount}} overdue for {{studentName}}",
      },
    },
  },

  PAYMENT_SUCCESS: {
    id: "PAYMENT_SUCCESS",
    type: "FEE_REMINDER",
    subKey: "payment_success",
    templates: {
      SMS: {
        body: "Payment received Rs {{amount}} for {{studentName}}. Receipt: {{receiptNumber}}",
      },
      WHATSAPP: {
        body: "✅ *Payment Success*\n\nStudent: {{studentName}}\nAmount: Rs {{amount}}\nReceipt: {{receiptNumber}}\n\nDownload: {{receiptUrl}}",
      },
      EMAIL: {
        subject: "Payment Receipt - {{receiptNumber}}",
        body: "Dear Parent,\n\nPayment of Rs {{amount}} received for {{studentName}}.\nReceipt: {{receiptNumber}}\n\nDownload: {{receiptUrl}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Payment Success",
        body: "Payment of Rs {{amount}} received for {{studentName}}",
      },
    },
  },

  PAYMENT_FAILED: {
    id: "PAYMENT_FAILED",
    type: "FEE_REMINDER",
    subKey: "payment_failed",
    templates: {
      SMS: {
        body: "Payment FAILED for {{studentName}}. Amount: Rs {{amount}}. Retry: {{paymentLink}}",
      },
      WHATSAPP: {
        body: "❌ *Payment Failed*\n\nStudent: {{studentName}}\nAmount: Rs {{amount}}\n\nRetry payment: {{paymentLink}}",
      },
      EMAIL: {
        subject: "Payment Failed - {{studentName}}",
        body: "Dear Parent,\n\nPayment of Rs {{amount}} for {{studentName}} has failed.\n\nPlease retry: {{paymentLink}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Payment Failed",
        body: "Payment failed for {{studentName}}. Please retry.",
      },
    },
  },

  // === EXAMS ===
  EXAM_CREATED: {
    id: "EXAM_CREATED",
    type: "EXAM",
    subKey: "exam_created",
    templates: {
      SMS: {
        body: "New exam: {{examName}} scheduled on {{date}}. Details: {{examUrl}}",
      },
      WHATSAPP: {
        body: "📝 *New Exam Scheduled*\n\n{{examName}}\nDate: {{date}}\nTime: {{time}}\n\nDetails: {{examUrl}}",
      },
      EMAIL: {
        subject: "New Exam - {{examName}}",
        body: "Dear Student,\n\nNew exam scheduled.\n\nExam: {{examName}}\nDate: {{date}}\nTime: {{time}}\n\nView details: {{examUrl}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "New Exam Scheduled",
        body: "{{examName}} scheduled on {{date}}",
      },
    },
  },

  EXAM_REMINDER: {
    id: "EXAM_REMINDER",
    type: "EXAM",
    subKey: "exam_reminder",
    templates: {
      SMS: {
        body: "Exam tomorrow: {{examName}} at {{time}}. Venue: {{venue}}. Good luck!",
      },
      WHATSAPP: {
        body: "📝 *Exam Reminder*\n\n{{examName}}\nDate: Tomorrow\nTime: {{time}}\nVenue: {{venue}}\n\nAll the best!",
      },
      EMAIL: {
        subject: "Exam Tomorrow - {{examName}}",
        body: "Dear Student,\n\nExam: {{examName}}\nDate: {{date}}\nTime: {{time}}\nVenue: {{venue}}\n\nGood luck!\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Exam Tomorrow",
        body: "{{examName}} tomorrow at {{time}}",
      },
    },
  },

  EXAM_ENROLLMENT: {
    id: "EXAM_ENROLLMENT",
    type: "EXAM",
    subKey: "exam_enroll",
    templates: {
      SMS: {
        body: "Enrolled for {{examName}} on {{date}}. Details: {{examUrl}}",
      },
      WHATSAPP: {
        body: "✅ *Exam Enrollment*\n\nYou are enrolled for {{examName}}.\nDate: {{date}}\nTime: {{time}}\n\nDetails: {{examUrl}}",
      },
      EMAIL: {
        subject: "Exam Enrollment Confirmed - {{examName}}",
        body: "Dear Student,\n\nYou are enrolled for {{examName}}.\nDate: {{date}}\nTime: {{time}}\n\nView details: {{examUrl}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Exam Enrollment Confirmed",
        body: "Enrolled for {{examName}} on {{date}}",
      },
    },
  },

  EXAM_HALL_TICKET: {
    id: "EXAM_HALL_TICKET",
    type: "EXAM",
    subKey: "exam_hall_ticket",
    templates: {
      SMS: {
        body: "Hall ticket available for {{examName}}. Download: {{hallTicketUrl}}",
      },
      WHATSAPP: {
        body: "🎫 *Hall Ticket Available*\n\n{{examName}}\nDate: {{date}}\n\nDownload: {{hallTicketUrl}}",
      },
      EMAIL: {
        subject: "Hall Ticket - {{examName}}",
        body: "Dear Student,\n\nYour hall ticket for {{examName}} is now available.\n\nDownload: {{hallTicketUrl}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Hall Ticket Available",
        body: "Hall ticket for {{examName}} is ready",
      },
    },
  },

  RESULT_PUBLISHED: {
    id: "RESULT_PUBLISHED",
    type: "EXAM",
    subKey: "exam_result",
    templates: {
      SMS: {
        body: "Results published for {{examName}}. View: {{resultUrl}}",
      },
      WHATSAPP: {
        body: "📊 *Results Published*\n\n{{examName}}\nScore: {{percentage}}%\n\nView: {{resultUrl}}",
      },
      EMAIL: {
        subject: "Results - {{examName}}",
        body: "Dear Student,\n\nResults for {{examName}} are published.\nScore: {{percentage}}%\n\nView: {{resultUrl}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Results Published",
        body: "Results for {{examName}} are available",
      },
    },
  },

  // === NOTICES ===
  GENERAL_NOTICE: {
    id: "GENERAL_NOTICE",
    type: "NOTICE",
    subKey: "general_notice",
    templates: {
      SMS: {
        body: "{{title}} - {{organizationName}}",
      },
      WHATSAPP: {
        body: "📢 *{{title}}*\n\n{{message}}\n\n- {{organizationName}}",
      },
      EMAIL: {
        subject: "{{title}}",
        body: "{{message}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Notice",
        body: "{{title}}",
      },
    },
  },

  URGENT_NOTICE: {
    id: "URGENT_NOTICE",
    type: "NOTICE",
    subKey: "urgent_notice",
    templates: {
      SMS: {
        body: "URGENT: {{title}} - {{organizationName}}",
      },
      WHATSAPP: {
        body: "🚨 *URGENT*\n\n{{title}}\n\n{{message}}",
      },
      EMAIL: {
        subject: "URGENT: {{title}}",
        body: "URGENT NOTICE\n\n{{title}}\n\n{{message}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "URGENT Notice",
        body: "URGENT: {{title}}",
      },
    },
  },

  // === LEAVE ===
  LEAVE_APPROVED: {
    id: "LEAVE_APPROVED",
    type: "LEAVE",
    subKey: "leave_approved",
    templates: {
      SMS: {
        body: "Leave approved from {{startDate}} to {{endDate}} - {{organizationName}}",
      },
      WHATSAPP: {
        body: "✅ *Leave Approved*\n\nFrom: {{startDate}}\nTo: {{endDate}}\n\nApproved by: {{approvedBy}}",
      },
      EMAIL: {
        subject: "Leave Approved",
        body: "Dear {{name}},\n\nYour leave from {{startDate}} to {{endDate}} is approved.\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Leave Approved",
        body: "Leave approved from {{startDate}} to {{endDate}}",
      },
    },
  },

  LEAVE_REJECTED: {
    id: "LEAVE_REJECTED",
    type: "LEAVE",
    subKey: "leave_rejected",
    templates: {
      SMS: {
        body: "Leave rejected. Reason: {{reason}} - {{organizationName}}",
      },
      WHATSAPP: {
        body: "❌ *Leave Rejected*\n\nReason: {{reason}}\n\nContact admin for details.",
      },
      EMAIL: {
        subject: "Leave Rejected",
        body: "Dear {{name}},\n\nYour leave application is rejected.\nReason: {{reason}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Leave Rejected",
        body: "Leave application rejected",
      },
    },
  },

  // === DOCUMENT VERIFICATION ===
  DOCUMENT_MISSING: {
    id: "DOCUMENT_MISSING",
    type: "DOCUMENT_REQUEST",
    subKey: "document_missing",
    templates: {
      SMS: {
        body: "Document pending: {{documentType}} required for {{studentName}}. Upload: {{uploadUrl}}",
      },
      WHATSAPP: {
        body: "⚠️ *Document Missing*\n\nDocument: {{documentType}}\nStudent: {{studentName}}\n\nUpload: {{uploadUrl}}",
      },
      EMAIL: {
        subject: "Document Required - {{documentType}}",
        body: "Dear Parent,\n\n{{documentType}} is required for {{studentName}}.\n\nPlease upload: {{uploadUrl}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Document Required",
        body: "{{documentType}} required for {{studentName}}",
      },
    },
  },

  DOCUMENT_APPROVED: {
    id: "DOCUMENT_APPROVED",
    type: "DOCUMENT_REQUEST",
    subKey: "document_verified",
    templates: {
      SMS: {
        body: "Document verified: {{documentType}} approved for {{studentName}}. - {{organizationName}}",
      },
      WHATSAPP: {
        body: "✅ *Document Approved*\n\nDocument: {{documentType}}\nStudent: {{studentName}}\nStatus: Verified\n\n- {{organizationName}}",
      },
      EMAIL: {
        subject: "Document Approved - {{documentType}}",
        body: "Dear Parent,\n\n{{documentType}} for {{studentName}} has been successfully verified.\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Document Approved",
        body: "{{documentType}} for {{studentName}} has been approved",
      },
    },
  },

  DOCUMENT_REJECTED: {
    id: "DOCUMENT_REJECTED",
    type: "DOCUMENT_REQUEST",
    subKey: "document_rejected",
    templates: {
      SMS: {
        body: "Document rejected: {{documentType}} for {{studentName}}. Reason: {{reason}} - {{organizationName}}",
      },
      WHATSAPP: {
        body: "❌ *Document Rejected*\n\nDocument: {{documentType}}\nStudent: {{studentName}}\nReason: {{reason}}\n\nRe-upload: {{uploadUrl}}",
      },
      EMAIL: {
        subject: "Document Rejected - {{documentType}}",
        body: "Dear Parent,\n\n{{documentType}} for {{studentName}} has been rejected.\nReason: {{reason}}\n\nPlease re-upload: {{uploadUrl}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Document Rejected",
        body: "{{documentType}} for {{studentName}} was rejected",
      },
    },
  },

  // === ACADEMIC ===
  MONTHLY_REPORT: {
    id: "MONTHLY_REPORT",
    type: "ACADEMIC_REPORT",
    templates: {
      SMS: {
        body: "Monthly report for {{studentName}} is ready. Check portal - {{organizationName}}",
      },
      WHATSAPP: {
        body: "📊 *Monthly Report*\n\nStudent: {{studentName}}\nMonth: {{month}}\n\nView details on portal.",
      },
      EMAIL: {
        subject: "Monthly Report - {{studentName}} - {{month}}",
        body: "Dear Parent,\n\nMonthly academic report for {{studentName}} is attached.\n\nMonth: {{month}}\nAttendance: {{attendance}}%\nOverall Performance: {{performance}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Monthly Report Available",
        body: "{{month}} report for {{studentName}} is ready",
      },
    },
  },

  // === GREETINGS ===
  BIRTHDAY_WISH: {
    id: "BIRTHDAY_WISH",
    type: "GREETING",
    templates: {
      SMS: {
        body: "Happy Birthday {{studentName}}! Wishing you a wonderful year ahead. - {{organizationName}}",
      },
      WHATSAPP: {
        body: "🎉 *Happy Birthday {{studentName}}!*\n\nWishing you a fantastic day and a wonderful year ahead.\n\n- {{organizationName}}",
      },
      EMAIL: {
        subject: "Happy Birthday {{studentName}}!",
        body: "Dear {{studentName}},\n\nWishing you a very Happy Birthday! May this year bring you joy, success, and wonderful memories.\n\nBest wishes,\n{{organizationName}}",
      },
      PUSH: {
        subject: "Happy Birthday!",
        body: "Happy Birthday {{studentName}}!",
      },
    },
  },
};