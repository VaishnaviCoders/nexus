// lib/notifications/config.ts

import { NotificationChannel } from "@/generated/prisma/enums";
import { NotificationTemplate} from "./engine";

// ============================================
// CHANNEL COSTS (in ₹)
// ============================================
export const CHANNEL_COSTS: Record<NotificationChannel, number> = {
  EMAIL: 0.36,
  SMS: 0.9,
  WHATSAPP: 0.75,
  PUSH: 0.2,
};

// ============================================
// NOTIFICATION TEMPLATES
// Simple templates with minimal variables
// ============================================
export const NOTIFICATION_TEMPLATES: Record<string, NotificationTemplate> = {
  // === ATTENDANCE ===
  STUDENT_ABSENT: {
    id: "STUDENT_ABSENT",
    type: "ATTENDANCE_ALERT",
    defaultChannels: ["SMS", "WHATSAPP", "PUSH"],
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
        body: "{{studentName}} was absent on {{date}}",
      },
    },
  },

  // === FEE MANAGEMENT ===
  NEW_FEE_CREATED: {
    id: "NEW_FEE_CREATED",
    type: "FEE_REMINDER",
    defaultChannels: ["SMS", "WHATSAPP"],
    templates: {
      SMS: {
        body: "New fee ₹{{amount}} due on {{dueDate}} for {{studentName}}. Pay: {{paymentLink}}",
      },
      WHATSAPP: {
        body: "💰 *New Fee*\n\nStudent: {{studentName}}\nAmount: ₹{{amount}}\nDue: {{dueDate}}\n\nPay: {{paymentLink}}",
      },
      EMAIL: {
        subject: "New Fee - {{studentName}}",
        body: "Dear Parent,\n\nNew fee of ₹{{amount}} for {{studentName}}.\nDue Date: {{dueDate}}\n\nPay online: {{paymentLink}}\n\nRegards,\n{{organizationName}}",
      },
    },
  },

  FEE_OVERDUE: {
    id: "FEE_OVERDUE",
    type: "FEE_REMINDER",
    defaultChannels: ["SMS", "WHATSAPP"],
    templates: {
      SMS: {
        body: "URGENT: Fee ₹{{amount}} OVERDUE for {{studentName}}. Pay now: {{paymentLink}}",
      },
      WHATSAPP: {
        body: "🚨 *URGENT: Fee Overdue*\n\nStudent: {{studentName}}\nAmount: ₹{{amount}}\n\nPay immediately: {{paymentLink}}",
      },
      EMAIL: {
        subject: "URGENT: Overdue Fee - {{studentName}}",
        body: "Dear Parent,\n\nFee ₹{{amount}} for {{studentName}} is OVERDUE.\n\nPlease pay immediately: {{paymentLink}}\n\nRegards,\n{{organizationName}}",
      },
    },
  },

  PAYMENT_SUCCESS: {
    id: "PAYMENT_SUCCESS",
    type: "FEE_REMINDER",
    defaultChannels: ["SMS", "WHATSAPP"],
    templates: {
      SMS: {
        body: "Payment received ✓ ₹{{amount}} for {{studentName}}. Receipt: {{receiptNumber}}",
      },
      WHATSAPP: {
        body: "✅ *Payment Success*\n\nStudent: {{studentName}}\nAmount: ₹{{amount}}\nReceipt: {{receiptNumber}}\n\nDownload: {{receiptUrl}}",
      },
      EMAIL: {
        subject: "Payment Receipt - {{receiptNumber}}",
        body: "Dear Parent,\n\nPayment of ₹{{amount}} received for {{studentName}}.\nReceipt: {{receiptNumber}}\n\nDownload: {{receiptUrl}}\n\nRegards,\n{{organizationName}}",
      },
    },
  },

  // === EXAMS ===
  EXAM_REMINDER: {
    id: "EXAM_REMINDER",
    type: "EXAM",
    defaultChannels: ["SMS", "WHATSAPP"],
    templates: {
      SMS: {
        body: "Exam tomorrow: {{examName}} at {{time}}. Venue: {{venue}}. Good luck!",
      },
      WHATSAPP: {
        body: "📝 *Exam Reminder*\n\n{{examName}}\nDate: {{date}}\nTime: {{time}}\nVenue: {{venue}}\n\nAll the best!",
      },
      EMAIL: {
        subject: "Exam Tomorrow - {{examName}}",
        body: "Dear Student,\n\nExam: {{examName}}\nDate: {{date}}\nTime: {{time}}\nVenue: {{venue}}\n\nGood luck!\n\nRegards,\n{{organizationName}}",
      },
    },
  },

  RESULT_PUBLISHED: {
    id: "RESULT_PUBLISHED",
    type: "EXAM",
    defaultChannels: ["SMS", "WHATSAPP", "PUSH"],
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
        body: "Results for {{examName}} are available",
      },
    },
  },

  // === NOTICES ===
  GENERAL_NOTICE: {
    id: "GENERAL_NOTICE",
    type: "GENERAL_ANNOUNCEMENT",
    defaultChannels: ["PUSH", "EMAIL"],
    templates: {
      EMAIL: {
        subject: "{{title}}",
        body: "{{message}}\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        body: "{{title}}",
      },
      SMS: {
        body: "{{title}} - {{organizationName}}",
      },
      WHATSAPP: {
        body: "📢 *{{title}}*\n\n{{message}}\n\n- {{organizationName}}",
      },
    },
  },

  URGENT_NOTICE: {
    id: "URGENT_NOTICE",
    type: "GENERAL_ANNOUNCEMENT",
    defaultChannels: ["SMS", "WHATSAPP", "PUSH"],
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
        body: "URGENT: {{title}}",
      },
    },
  },

  // === LEAVE ===
  LEAVE_APPROVED: {
    id: "LEAVE_APPROVED",
    type: "GENERAL_ANNOUNCEMENT",
    defaultChannels: ["SMS", "WHATSAPP"],
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
    },
  },

  LEAVE_REJECTED: {
    id: "LEAVE_REJECTED",
    type: "GENERAL_ANNOUNCEMENT",
    defaultChannels: ["SMS", "WHATSAPP"],
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
    },
  },

  // === DOCUMENT VERIFICATION ===
  DOCUMENT_APPROVED: {
    id: "DOCUMENT_APPROVED",
    type: "DOCUMENT_REQUEST",
    defaultChannels: ["PUSH", "EMAIL"],
    templates: {
      SMS: {
        body: "Document Verified: Your {{documentType}} has been approved. - {{organizationName}}",
      },
      WHATSAPP: {
        body: "✅ *Document Approved*\n\nDocument: {{documentType}}\nStatus: Verified\n\n- {{organizationName}}",
      },
      EMAIL: {
        subject: "Document Approved - {{documentType}}",
        body: "Dear Student,\n\nYour {{documentType}} has been successfully verified.\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        body: "Your {{documentType}} has been approved",
      },
    },
  },

  DOCUMENT_REJECTED: {
    id: "DOCUMENT_REJECTED",
    type: "DOCUMENT_REQUEST",
    defaultChannels: ["PUSH", "EMAIL"],
    templates: {
      SMS: {
        body: "Document Rejected: Your {{documentType}} was rejected. Reason: {{reason}} - {{organizationName}}",
      },
      WHATSAPP: {
        body: "❌ *Document Rejected*\n\nDocument: {{documentType}}\nReason: {{reason}}\n\nPlease re-upload correct document.\n\n- {{organizationName}}",
      },
      EMAIL: {
        subject: "Document Rejected - {{documentType}}",
        body: "Dear Student,\n\nYour {{documentType}} has been rejected.\nReason: {{reason}}\n\nPlease login to portal and re-upload the correct document.\n\nRegards,\n{{organizationName}}",
      },
      PUSH: {
        body: "Your {{documentType}} was rejected. Action required.",
      },
    },
  },
};

// ============================================
// HELPER FUNCTION
// ============================================
export function getTemplate(templateId: string): NotificationTemplate | null {
  return NOTIFICATION_TEMPLATES[templateId] || null;
}

// lib/notifications/utils.ts

/**
 * Replace {{variable}} in template with actual values
 * Example: "Hello {{name}}" + {name: "John"} = "Hello John"
 */
export function replaceTemplateVariables(
  template: string,
  variables: Record<string, any>
): string {
  let result = template;

  // Replace each variable
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    result = result.replaceAll(placeholder, String(value ?? ""));
  });

  // Remove any unreplaced variables
  result = result.replace(/{{[^}]+}}/g, "");

  return result;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Indian phone number (10 digits starting with 6-9)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Clean phone number (remove spaces, +91, etc.)
 */
export function sanitizePhone(phone: string): string {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, "");

  // Remove country code if present
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  }

  return cleaned;
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries - 1) {
        // Wait before retry (exponential backoff)
        const waitTime = delayMs * Math.pow(2, attempt);
        console.log(`⏳ Retry ${attempt + 1}/${maxRetries} after ${waitTime}ms...`);
        await sleep(waitTime);
      }
    }
  }

  throw lastError;
}

/**
 * Sleep/delay utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Split array into chunks
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  
  return chunks;
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Generate unique receipt number
 */
export function generateReceiptNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `RCP${timestamp}${random}`;
}