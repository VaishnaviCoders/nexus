// lib/notifications/notification-engine.ts

import prisma from "@/lib/db";
import { NotificationChannel, NotificationType, NotificationStatus } from "@/generated/prisma/enums";
import { ChannelFactory } from "./channels";
import {
  NOTIFICATION_TEMPLATES,
  NotificationTemplateId,
  NotificationVariables,
  TemplateVariablesMap,
  AttendanceVariables,
  FeeVariables,
  ExamVariables,
  NoticeVariables,
  DocumentVariables,
  AcademicVariables,
  GreetingVariables,
  NotificationBody,
} from "./template";
import React from "react";
import DocumentRejectionEmail from "@/components/templates/email-templates/documents/documentRejectedMail";
import { chunkArray, retry, sleep, calculateNotificationCost } from "@/lib/utils";
import { createHash } from "crypto";
import { getOrganizationNotificationSettings } from "@/lib/organization-notification-settings"

// Todos : Queue System , Kafka Integration , Valid Email , Valid Phone , Valid Whatsapp Number

// Batch configuration for handling high loads
const BATCH_SIZE = 100; // Recipients per batch
const MAX_CONCURRENT_RECIPIENTS = 10; // Parallel recipients within a batch
const INTER_BATCH_DELAY_MS = 500; // Delay between batches
const INTER_RECIPIENT_DELAY_MS = 50; // Small delay to avoid rate limits

// Todos : Kafka Integration for future scaling

interface RecipientInfo {
  userId?: string;
  studentId?: string;
  parentId?: string;
  email?: string;
  phone?: string;
  whatsappNumber?: string;
  fcmTokens?: string[];
}

interface NotificationPayload<T extends NotificationTemplateId> {
  templateId: T;
  variables: TemplateVariablesMap[T];
  recipients: RecipientInfo[];
  organizationId: string;
  noticeId?: string;
  scheduledJobId?: string;
}

interface ChannelResult {
  channel: NotificationChannel;
  success: boolean;
  messageId?: string;
  error?: string;
  cost: number;
  units: number;
}

interface NotificationResult {
  success: boolean;
  totalSent: number;
  totalFailed: number;
  totalCost: number;
  results: {
    recipient: RecipientInfo;
    channels: ChannelResult[];
  }[];
}

const REACT_EMAIL_TEMPLATES: Partial<Record<NotificationTemplateId, React.ComponentType<any>>> = {
  DOCUMENT_REJECTED: DocumentRejectionEmail,
};

// ============================================
// IDEMPOTENCY KEY GENERATION
// ============================================

function generateIdempotencyKey(
  organizationId: string,
  templateId: string,
  recipientId: string,
  channel: NotificationChannel,
  timestamp: string
): string {
  const input = `${organizationId}:${templateId}:${recipientId}:${channel}:${timestamp}`;
  return createHash("sha256").update(input).digest("hex");
}

// ============================================
// RECIPIENT RESOLUTION
// ============================================

async function resolveRecipients(
  recipients: RecipientInfo[],
  organizationId: string
): Promise<RecipientInfo[]> {
  const resolved: RecipientInfo[] = [];

  for (const recipient of recipients) {
    try {
      // If studentId provided, get student + primary parent
      if (recipient.studentId) {
        const student = await prisma.student.findUnique({
          where: { id: recipient.studentId },
          include: {
            user: {
              include: {
                deviceTokens: true,
              },
            },
            parents: {
              where: { isPrimary: true },
              include: {
                parent: {
                  include: {
                    user: {
                      include: {
                        deviceTokens: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!student) continue;

        // Add student info
        resolved.push({
          userId: student.userId,
          studentId: student.id,
          email: student.email,
          phone: student.phoneNumber,
          whatsappNumber: student.whatsAppNumber,
          fcmTokens: student.user.deviceTokens.map((dt) => dt.token),
        });

        // Add primary parent info
        const primaryParent = student.parents[0]?.parent;
        if (primaryParent) {
          resolved.push({
            userId: primaryParent.userId || undefined,
            parentId: primaryParent.id,
            studentId: student.id,
            email: primaryParent.email,
            phone: primaryParent.phoneNumber,
            whatsappNumber: primaryParent.whatsAppNumber,
            fcmTokens: primaryParent.user?.deviceTokens.map((dt) => dt.token) || [],
          });
        }
      }
      // If userId provided, get user info
      else if (recipient.userId) {
        const user = await prisma.user.findUnique({
          where: { id: recipient.userId },
          include: {
            student: true,
            parent: true,
            teacher: true,
            deviceTokens: true,
          },
        });

        if (!user) continue;

        resolved.push({
          userId: user.id,
          studentId: user.student?.id,
          parentId: user.parent?.id,
          email: user.email,
          phone: user.student?.phoneNumber || user.parent?.phoneNumber,
          whatsappNumber: user.student?.whatsAppNumber || user.parent?.whatsAppNumber,
          fcmTokens: user.deviceTokens.map((dt) => dt.token),
        });
      }
      // If parentId provided
      else if (recipient.parentId) {
        const parent = await prisma.parent.findUnique({
          where: { id: recipient.parentId },
          include: {
            user: {
              include: {
                deviceTokens: true,
              },
            },
          },
        });

        if (!parent) continue;

        resolved.push({
          userId: parent.userId || undefined,
          parentId: parent.id,
          email: parent.email,
          phone: parent.phoneNumber,
          whatsappNumber: parent.whatsAppNumber,
          fcmTokens: parent.user?.deviceTokens.map((dt) => dt.token) || [],
        });
      }
      // Use recipient as-is if contact info already provided
      else {
        resolved.push(recipient);
      }

      // console.log(`[ENGINE] Resolved recipient: ${recipient.userId || recipient.email || recipient.studentId}`);
    } catch (error) {
      console.error(`[ENGINE] ❌ Error resolving recipient:`, error);
      continue;
    }
  }

  return resolved;
}

// ============================================
// ENABLED CHANNELS DETECTION
// ============================================

function getEnabledChannels(
  templateId: NotificationTemplateId,
  organizationSettings: Awaited<ReturnType<typeof getOrganizationNotificationSettings>>
): NotificationChannel[] {
  const template = NOTIFICATION_TEMPLATES[templateId];
  if (!template) return [];

  const setting = organizationSettings.find((s) => s.notificationType === template.type);
  if (!setting || !setting.isActive) return [];

  const enabledChannels: NotificationChannel[] = [];
  const channels = setting.channels as any;

  if (template.subKey) {
    // Has subcategory (e.g., FEE_REMINDER -> friendly_reminder)
    const subCategory = channels[template.subKey];
    if (subCategory) {
      if (subCategory.SMS?.enabled && !subCategory.SMS?.locked) enabledChannels.push("SMS");
      if (subCategory.WHATSAPP?.enabled && !subCategory.WHATSAPP?.locked) enabledChannels.push("WHATSAPP");
      if (subCategory.EMAIL?.enabled && !subCategory.EMAIL?.locked) enabledChannels.push("EMAIL");
      if (subCategory.PUSH?.enabled && !subCategory.PUSH?.locked) enabledChannels.push("PUSH");
    }
  } else {
    // Direct channel mapping (e.g., ATTENDANCE_ALERT)
    if (channels.SMS?.enabled && !channels.SMS?.locked) enabledChannels.push("SMS");
    if (channels.WHATSAPP?.enabled && !channels.WHATSAPP?.locked) enabledChannels.push("WHATSAPP");
    if (channels.EMAIL?.enabled && !channels.EMAIL?.locked) enabledChannels.push("EMAIL");
    if (channels.PUSH?.enabled && !channels.PUSH?.locked) enabledChannels.push("PUSH");
  }

  return enabledChannels;
}

// ============================================
// TEMPLATE VARIABLE REPLACEMENT
// ============================================

function replaceTemplateVariables(template: string, variables: any): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key]?.toString() || match;
  });
}

// ============================================
// SEND VIA SINGLE CHANNEL
// ============================================

async function sendViaChannel(
  channel: NotificationChannel,
  recipient: RecipientInfo,
  subject: string | undefined,
  body: NotificationBody,
  idempotencyKey: string,
  organizationId: string,
  variables?: NotificationVariables
): Promise<ChannelResult> {
  try {
    // Check for duplicate using idempotency key
    const existing = await prisma.notificationLog.findFirst({
      where: {
        organizationId,
        userId: recipient.userId,
        parentId: recipient.parentId,
        studentId: recipient.studentId,
        channel,
        title: subject || (typeof body === "string" ? body.substring(0, 100) : "Notification"),
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
        },
      },
    });

    if (existing) {
      console.log(`[${channel}] ⚠️  DUPLICATE - Skipping: ${idempotencyKey}`);
      return {
        channel,
        success: false,
        error: "Duplicate notification",
        cost: 0,
        units: 0,
      };
    }

    // Get recipient contact based on channel
    let to: string | undefined;
    let units = 1;

    switch (channel) {
      case "EMAIL":
        to = recipient.email;
        break;
      case "SMS":
        to = recipient.phone;
        break;
      case "WHATSAPP":
        to = recipient.whatsappNumber || recipient.phone;
        break;
      case "PUSH":
        // Special handling for PUSH: need to resolve to User.id for device tokens
        let userIdForTokens: string | null = null;

        // If we have a direct userId, use it
        if (recipient.userId) {
          userIdForTokens = recipient.userId;
        }
        // If we have studentId, look up the student's userId
        else if (recipient.studentId) {
          const student = await prisma.student.findUnique({
            where: { id: recipient.studentId },
            select: { userId: true },
          });
          userIdForTokens = student?.userId || null;
        }
        // If we have parentId, look up the parent's userId
        else if (recipient.parentId) {
          const parent = await prisma.parent.findUnique({
            where: { id: recipient.parentId },
            select: { userId: true },
          });
          userIdForTokens = parent?.userId || null;
        }

        if (!userIdForTokens) {
          console.log(`[${channel}] ⚠️  Could not resolve User.id for PUSH notification`);
          return {
            channel,
            success: false,
            error: "Could not resolve user for push notification",
            cost: 0,
            units: 0,
          };
        }

        console.log(`[${channel}] 🔍 Fetching device tokens for user: ${userIdForTokens}`);

        // Find tokens for this user
        const deviceTokens = await prisma.deviceToken.findMany({
          where: { userId: userIdForTokens },
        });

        if (deviceTokens.length === 0) {
          console.log(`[${channel}] ⚠️  No device tokens found for user: ${userIdForTokens}`);
          return {
            channel,
            success: false,
            error: "No device tokens found for user",
            cost: 0,
            units: 0,
          };
        }

        console.log(`[${channel}] 📱 Found ${deviceTokens.length} token(s) for user ${userIdForTokens}`);
        console.log(`[${channel}] 📤 Sending push notification:`);
        console.log(`  └─ Subject: ${subject}`);
        console.log(`  └─ Body: ${body}`);

        const provider = ChannelFactory.getProvider(channel);
        let successCount = 0;
        let lastError = "";

        // Send to all tokens
        for (let i = 0; i < deviceTokens.length; i++) {
          const tokenRecord = deviceTokens[i];
          try {
            console.log(`[${channel}] 🔄 Attempting device ${i + 1}/${deviceTokens.length}`);

            const result = await retry(
              () => provider.send(tokenRecord.token, subject, body, variables),
              3,
              1000
            );

            if (result.success) {
              successCount++;
              // console.log(`[${channel}] ✅ Device ${i + 1} sent successfully - MessageID: ${result.messageId}`);
            } else {
              lastError = result.error || "Unknown error";
              console.log(`[${channel}] ❌ Device ${i + 1} failed: ${lastError}`);

              // Clean up invalid tokens (app uninstalled, token expired, etc.)
              if (
                result.error?.includes("not found") ||
                result.error?.includes("not-registered") ||
                result.error?.includes("invalid-registration-token") ||
                result.error?.includes("registration-token-not-registered")
              ) {
                console.log(`[${channel}] 🗑️  Removing invalid token: ${tokenRecord.id}`);
                await prisma.deviceToken.delete({ where: { id: tokenRecord.id } }).catch(() => {
                  console.log(`[${channel}] ⚠️  Failed to delete invalid token`);
                });
              }
            }
          } catch (e: any) {
            console.error(`[${channel}] 💥 Exception sending to device ${i + 1}:`, e.message);
            lastError = e.message;
          }
        }

        const cost = calculateNotificationCost(channel, successCount);
        // console.log(`[${channel}] 📊 Results: ${successCount}/${deviceTokens.length} success`);

        if (successCount > 0) {
          return {
            channel,
            success: true,
            messageId: `${successCount}/${deviceTokens.length} sent`,
            error: undefined,
            cost,
            units: 1, // Count as 1 unit even if multiple devices
          };
        } else {
          return {
            channel,
            success: false,
            error: `All device delivery failed. Last error: ${lastError}`,
            cost: 0,
            units: 0,
          };
        }
    }

    if (!to) {
      console.log(`[${channel}] ❌ FAILED - No ${channel} contact available for recipient`);
      return {
        channel,
        success: false,
        error: `No ${channel} contact available`,
        cost: 0,
        units: 0,
      };
    }

    // Log what we're about to send (for non-PUSH channels)
    console.log(`[${channel}] 📤 Sending to: ${to}`);
    console.log(`  └─ Subject: ${subject || "N/A"}`);
    const bodyLog = typeof body === "string"
      ? `${body.substring(0, 100)}${body.length > 100 ? "..." : ""}`
      : "[React Component]";
    console.log(`  └─ Body: ${bodyLog}`);

    // Send notification with retry logic
    const provider = ChannelFactory.getProvider(channel);
    const result = await retry(() => provider.send(to!, subject, body), 3, 1000);

    const cost = calculateNotificationCost(channel, units);

    if (result.success) {
      console.log(`[${channel}] ✅ Sent to ${to}`);
    } else {
      console.log(`[${channel}] ❌ Failed for ${to}: ${result.error}`);
    }

    return {
      channel,
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      cost,
      units,
    };
  } catch (error) {
    console.error(`[${channel}] 💥 EXCEPTION - Error sending to recipient:`, error);
    return {
      channel,
      success: false,
      error: (error as Error).message,
      cost: 0,
      units: 0,
    };
  }
}

// ============================================
// SEND VIA ALL ENABLED CHANNELS
// ============================================

async function sendViaChannels(
  enabledChannels: NotificationChannel[],
  recipient: RecipientInfo,
  templateId: NotificationTemplateId,
  variables: NotificationVariables,
  organizationId: string,
  timestamp: string
): Promise<ChannelResult[]> {
  const template = NOTIFICATION_TEMPLATES[templateId];
  if (!template) return [];

  const results: ChannelResult[] = [];

  // Failure isolation: each channel sends independently
  for (const channel of enabledChannels) {
    try {
      const channelTemplate = template.templates[channel];
      if (!channelTemplate) {
        results.push({
          channel,
          success: false,
          error: "Template not available for channel",
          cost: 0,
          units: 0,
        });
        continue;
      }

      let subject: string | undefined;
      let body: NotificationBody;

      if ("subject" in channelTemplate) {
        subject = replaceTemplateVariables(channelTemplate.subject, variables);
        // Use React template for email if available
        if (channel === "EMAIL" && REACT_EMAIL_TEMPLATES[templateId]) {
          const ReactTemplate = REACT_EMAIL_TEMPLATES[templateId]!;
          body = React.createElement(ReactTemplate, variables);
        } else {
          body = replaceTemplateVariables(channelTemplate.body, variables);
        }
      } else {
        body = replaceTemplateVariables(channelTemplate.body, variables);
      }

      const recipientId = recipient.userId || recipient.parentId || recipient.studentId || recipient.email || "unknown";
      const idempotencyKey = generateIdempotencyKey(organizationId, templateId, recipientId, channel, timestamp);

      const result = await sendViaChannel(channel, recipient, subject, body, idempotencyKey, organizationId, variables);
      results.push(result);

      // Rate limiting: small delay between channels
      await sleep(100);
    } catch (error) {
      console.error(`[${channel}] Fatal error for recipient:`, error);
      results.push({
        channel,
        success: false,
        error: (error as Error).message,
        cost: 0,
        units: 0,
      });
    }
  }

  return results;
}

// ============================================
// LOG NOTIFICATION TO DATABASE
// ============================================

async function logNotification<T extends NotificationTemplateId>(
  organizationId: string,
  recipient: RecipientInfo,
  templateId: T,
  variables: TemplateVariablesMap[T],
  channelResult: ChannelResult,
  noticeId?: string
): Promise<void> {
  try {
    const template = NOTIFICATION_TEMPLATES[templateId];
    const channelTemplate = template.templates[channelResult.channel];

    let title: string;
    let message: string;

    const body = channelTemplate ? (
      "subject" in channelTemplate && channelResult.channel === "EMAIL" && REACT_EMAIL_TEMPLATES[templateId]
        ? React.createElement(REACT_EMAIL_TEMPLATES[templateId]!, variables)
        : replaceTemplateVariables(channelTemplate.body, variables)
    ) : "No template available";

    const displayMessage = typeof body === "string" ? body : "Email Template Sent";

    if (channelTemplate && "subject" in channelTemplate) {
      title = replaceTemplateVariables(channelTemplate.subject, variables);
      message = displayMessage;
    } else if (channelTemplate) {
      // Use type-safe field access or fallback
      const vars = variables as any;
      title = vars.title || vars.examName || vars.documentType || "Notification";
      message = displayMessage;
    } else {
      title = "Notification";
      message = displayMessage;
    }

    await prisma.notificationLog.create({
      data: {
        organizationId,
        userId: recipient.userId,
        parentId: recipient.parentId,
        studentId: recipient.studentId,
        channel: channelResult.channel,
        status: channelResult.success ? "SENT" : "FAILED",
        notificationType: template.type,
        noticeId,
        title,
        message,
        errorMessage: channelResult.error,
        units: channelResult.units,
        cost: channelResult.cost,
        retryCount: 0,
        maxRetries: 3,
      },
    });
  } catch (error) {
    console.error("[LOG] Error logging notification:", error);
  }
}

// ============================================
// BATCH PROCESSING (Parallel Execution)
// ============================================

/**
 * Process a single recipient - sends to all enabled channels
 */
async function processRecipient<T extends NotificationTemplateId>(
  recipient: RecipientInfo,
  enabledChannels: NotificationChannel[],
  templateId: T,
  variables: TemplateVariablesMap[T],
  organizationId: string,
  timestamp: string,
  noticeId?: string
): Promise<NotificationResult["results"][0]> {
  try {
    const channelResults = await sendViaChannels(
      enabledChannels,
      recipient,
      templateId,
      variables,
      organizationId,
      timestamp
    );

    // Log each channel result (non-blocking)
    Promise.allSettled(
      channelResults.map((cr) => logNotification(organizationId, recipient, templateId, variables, cr, noticeId))
    ).catch(() => { }); // Fire and forget logging

    return {
      recipient,
      channels: channelResults,
    };
  } catch (error) {
    console.error(`[BATCH] ❌ Error processing recipient:`, error);
    return {
      recipient,
      channels: [],
    };
  }
}

/**
 * Process a batch of recipients with parallel execution
 * Uses chunked concurrency to avoid overwhelming providers
 */
async function processBatch<T extends NotificationTemplateId>(
  recipients: RecipientInfo[],
  enabledChannels: NotificationChannel[],
  templateId: T,
  variables: TemplateVariablesMap[T],
  organizationId: string,
  timestamp: string,
  noticeId?: string
): Promise<NotificationResult["results"]> {
  const batchResults: NotificationResult["results"] = [];

  // Process recipients in parallel chunks for better throughput
  const recipientChunks = chunkArray(recipients, MAX_CONCURRENT_RECIPIENTS);

  for (const chunk of recipientChunks) {
    // Process all recipients in this chunk in parallel
    const chunkPromises = chunk.map((recipient) =>
      processRecipient(
        recipient,
        enabledChannels,
        templateId,
        variables,
        organizationId,
        timestamp,
        noticeId
      )
    );

    const chunkResults = await Promise.allSettled(chunkPromises);

    // Collect results
    for (const result of chunkResults) {
      if (result.status === "fulfilled") {
        batchResults.push(result.value);
      } else {
        console.error(`[BATCH] ❌ Recipient processing failed:`, result.reason);
      }
    }

    // Small delay between chunks to avoid rate limits
    if (chunk !== recipientChunks[recipientChunks.length - 1]) {
      await sleep(INTER_RECIPIENT_DELAY_MS);
    }
  }

  return batchResults;
}

// ============================================
// MAIN NOTIFICATION ENGINE
// ============================================

export async function sendNotification<T extends NotificationTemplateId>(
  payload: NotificationPayload<T>
): Promise<NotificationResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  console.log(`[ENGINE] Starting notification: ${payload.templateId} for org ${payload.organizationId}`);

  try {
    // 1. Get organization notification settings
    const organizationSettings = await getOrganizationNotificationSettings(payload.organizationId);

    // 2. Get enabled channels for this template
    const enabledChannels = getEnabledChannels(payload.templateId, organizationSettings);

    if (enabledChannels.length === 0) {
      console.log(`[ENGINE] No enabled channels for template ${payload.templateId}`);
      return {
        success: false,
        totalSent: 0,
        totalFailed: 0,
        totalCost: 0,
        results: [],
      };
    }

    console.log(`[ENGINE] Enabled channels: ${enabledChannels.join(", ")}`);

    // 3. Resolve recipients (get full contact info)
    const resolvedRecipients = await resolveRecipients(payload.recipients, payload.organizationId);

    if (resolvedRecipients.length === 0) {
      console.log(`[ENGINE] No valid recipients found`);
      return {
        success: false,
        totalSent: 0,
        totalFailed: 0,
        totalCost: 0,
        results: [],
      };
    }

    console.log(`[ENGINE] Resolved ${resolvedRecipients.length} recipients`);

    // 3.5 Deduplicate recipients
    // We deduplicate by userId for PUSH and by contact info for others
    const uniqueRecipients: RecipientInfo[] = [];
    const seenGeneral = new Set<string>();
    const seenUserIds = new Set<string>();

    for (const r of resolvedRecipients) {
      const generalKey = `${r.email}-${r.phone}-${r.whatsappNumber}`;
      const userKey = r.userId || "no-user";

      // If we've seen this contact info AND this user ID, skip
      if (seenGeneral.has(generalKey) && (userKey === "no-user" || seenUserIds.has(userKey))) {
        continue;
      }

      uniqueRecipients.push(r);
      if (generalKey !== "--") seenGeneral.add(generalKey);
      if (userKey !== "no-user") seenUserIds.add(userKey);
    }

    if (uniqueRecipients.length === 0) {
      console.log(`[ENGINE] ⚠️ No valid recipients found after deduplication`);
      return {
        success: false,
        totalSent: 0,
        totalFailed: 0,
        totalCost: 0,
        results: [],
      };
    }

    console.log(`[ENGINE] 📨 Sending to ${uniqueRecipients.length} unique recipients via: ${enabledChannels.join(", ")}`);

    // 4. Batch processing with parallel execution
    const batches = chunkArray(uniqueRecipients, BATCH_SIZE);
    const allResults: NotificationResult["results"] = [];

    console.log(`[ENGINE] 📦 Processing ${batches.length} batch(es) of up to ${BATCH_SIZE} recipients each`);

    for (let i = 0; i < batches.length; i++) {
      if (batches.length > 1) console.log(`[ENGINE] 📦 Processing batch ${i + 1}/${batches.length} (${batches[i].length} recipients)`);

      const batchResults = await processBatch(
        batches[i],
        enabledChannels,
        payload.templateId,
        payload.variables,
        payload.organizationId,
        timestamp,
        payload.noticeId
      );

      allResults.push(...batchResults);

      // Delay between batches to avoid overwhelming providers
      if (i < batches.length - 1) await sleep(INTER_BATCH_DELAY_MS);
    }

    // 5. Calculate statistics
    let totalSent = 0;
    let totalFailed = 0;
    let totalCost = 0;

    for (const result of allResults) {
      for (const channelResult of result.channels) {
        if (channelResult.success) {
          totalSent++;
        } else {
          totalFailed++;
        }
        totalCost += channelResult.cost;
      }
    }

    const duration = Date.now() - startTime;
    console.log(
      `[ENGINE] Completed in ${duration}ms - Sent: ${totalSent}, Failed: ${totalFailed}, Cost: ₹${totalCost.toFixed(2)}`
    );

    return {
      success: totalSent > 0,
      totalSent,
      totalFailed,
      totalCost: parseFloat(totalCost.toFixed(2)),
      results: allResults,
    };
  } catch (error) {
    console.error("[ENGINE] Fatal error:", error);
    return {
      success: false,
      totalSent: 0,
      totalFailed: 0,
      totalCost: 0,
      results: [],
    };
  }
}

// CONVENIENCE FUNCTIONS

/**
 * Send attendance alert for absent student
 */
export async function sendAttendanceAlert(
  organizationId: string,
  studentId: string,
  date: string | Date,
  variables: AttendanceVariables
) {
  return sendNotification({
    templateId: "STUDENT_ABSENT",
    variables,
    recipients: [{ studentId }],
    organizationId,
  });
}

export async function sendDocumentRejectionNotification({
  organizationId,
  studentId,
  variables,
}: {
  organizationId: string;
  studentId: string;
  variables: DocumentVariables;
}) {
  return sendNotification({
    templateId: "DOCUMENT_REJECTED",
    variables,
    recipients: [{ studentId }],
    organizationId,
  });
}

/**
 * Send fee reminder
 */
export async function sendFeeReminder<T extends "FEE_REMINDER_FRIENDLY" | "FEE_DUE_TODAY" | "FEE_OVERDUE">(
  organizationId: string,
  studentId: string,
  templateId: T,
  variables: FeeVariables
) {
  return sendNotification({
    templateId,
    variables,
    recipients: [{ studentId }],
    organizationId,
  });
}

/**
 * Send exam notification
 */
export async function sendExamNotification<T extends "EXAM_CREATED" | "EXAM_REMINDER" | "EXAM_HALL_TICKET" | "RESULT_PUBLISHED">(
  organizationId: string,
  studentIds: string[],
  templateId: T,
  variables: ExamVariables
) {
  return sendNotification({
    templateId,
    variables,
    recipients: studentIds.map((id) => ({ studentId: id })),
    organizationId,
  });
}

/**
 * Send notice to recipients
 */
export async function sendNoticeNotification<T extends "URGENT_NOTICE" | "GENERAL_NOTICE">(
  organizationId: string,
  noticeId: string,
  recipients: RecipientInfo[],
  isUrgent: boolean,
  variables: NoticeVariables
) {
  return sendNotification({
    templateId: (isUrgent ? "URGENT_NOTICE" : "GENERAL_NOTICE") as T,
    variables,
    recipients,
    organizationId,
    noticeId,
  });
}

/**
 * Send document notification
 */
export async function sendDocumentNotification<T extends "DOCUMENT_MISSING" | "DOCUMENT_APPROVED" | "DOCUMENT_REJECTED">(
  organizationId: string,
  studentId: string,
  templateId: T,
  variables: DocumentVariables
) {
  return sendNotification({
    templateId,
    variables,
    recipients: [{ studentId }],
    organizationId,
  });
}

export async function sendGreetingNotification(
  organizationId: string,
  studentId: string,
  variables: GreetingVariables
) {
  return sendNotification({
    templateId: "BIRTHDAY_WISH",
    variables,
    recipients: [{ studentId }],
    organizationId,
  });
}

// ============================================
// TEST NOTIFICATION FUNCTIONS
// ============================================

interface TestNotificationResult {
  channel: NotificationChannel;
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
}

/**
 * Send a test push notification directly to a user's devices
 * Bypasses organization settings for testing purposes
 */
export async function sendTestPushNotification(
  userId: string,
  title: string = "🔔 Test Notification",
  body: string = "This is a test push notification from Nexus"
): Promise<TestNotificationResult> {
  try {
    // Get user's device tokens
    const deviceTokens = await prisma.deviceToken.findMany({
      where: { userId },
      orderBy: { lastUsedAt: "desc" },
    });

    if (deviceTokens.length === 0) {
      return {
        channel: "PUSH",
        success: false,
        message: "No device tokens found for user",
        error: "User has no registered devices",
      };
    }

    console.log(`[TEST] 🔔 Sending test push to ${deviceTokens.length} device(s)`);

    const provider = ChannelFactory.getProvider("PUSH");
    let successCount = 0;
    let lastError = "";

    // Send to all devices (deduplicated by token)
    const seenTokens = new Set<string>();
    for (const tokenRecord of deviceTokens) {
      if (seenTokens.has(tokenRecord.token)) continue;
      seenTokens.add(tokenRecord.token);

      const result = await provider.send(tokenRecord.token, title, body, {
        link: "/dashboard",
        test: "true",
      });

      if (result.success) {
        successCount++;
        console.log(`[TEST] ✅ Push sent to ${tokenRecord.platform} device`);
      } else {
        lastError = result.error || "Unknown error";
        console.log(`[TEST] ❌ Push failed: ${lastError}`);

        // Clean up invalid tokens
        if (
          result.error?.includes("not-registered") ||
          result.error?.includes("invalid-registration-token")
        ) {
          await prisma.deviceToken.delete({ where: { id: tokenRecord.id } }).catch(() => { });
        }
      }
    }

    return {
      channel: "PUSH",
      success: successCount > 0,
      message: `Sent to ${successCount}/${seenTokens.size} device(s)`,
      messageId: `${successCount} devices`,
      error: successCount === 0 ? lastError : undefined,
    };
  } catch (error) {
    console.error("[TEST] Push notification error:", error);
    return {
      channel: "PUSH",
      success: false,
      message: "Push notification failed",
      error: (error as Error).message,
    };
  }
}

/**
 * Send a test email notification
 */
export async function sendTestEmailNotification(
  email: string,
  subject: string = "🔔 Test Email from Nexus",
  body: string = "This is a test email notification. If you received this, email notifications are working correctly!"
): Promise<TestNotificationResult> {
  try {
    console.log(`[TEST] 📧 Sending test email to ${email}`);

    const provider = ChannelFactory.getProvider("EMAIL");
    const result = await provider.send(email, subject, body);

    return {
      channel: "EMAIL",
      success: result.success,
      message: result.success ? `Email sent to ${email}` : "Email failed",
      messageId: result.messageId,
      error: result.error,
    };
  } catch (error) {
    console.error("[TEST] Email notification error:", error);
    return {
      channel: "EMAIL",
      success: false,
      message: "Email notification failed",
      error: (error as Error).message,
    };
  }
}

/**
 * Send a test SMS notification
 */
export async function sendTestSMSNotification(
  phone: string,
  message: string = "🔔 Test SMS from Nexus - If you received this, SMS notifications are working correctly!"
): Promise<TestNotificationResult> {
  try {
    // Normalize phone number (remove +91 if present)
    const normalizedPhone = phone.replace(/^\+?91/, "").replace(/\D/g, "");

    console.log(`[TEST] 📱 Sending test SMS to ${normalizedPhone}`);

    const provider = ChannelFactory.getProvider("SMS");
    const result = await provider.send(normalizedPhone, undefined, message);

    return {
      channel: "SMS",
      success: result.success,
      message: result.success ? `SMS sent to ${normalizedPhone}` : "SMS failed",
      messageId: result.messageId,
      error: result.error,
    };
  } catch (error) {
    console.error("[TEST] SMS notification error:", error);
    return {
      channel: "SMS",
      success: false,
      message: "SMS notification failed",
      error: (error as Error).message,
    };
  }
}

/**
 * Send a test WhatsApp notification
 */
export async function sendTestWhatsAppNotification(
  phone: string,
  message: string = "🔔 Test WhatsApp from Nexus - If you received this, WhatsApp notifications are working correctly!"
): Promise<TestNotificationResult> {
  try {
    // Normalize phone number (remove +91 if present)
    const normalizedPhone = phone.replace(/^\+?91/, "").replace(/\D/g, "");

    console.log(`[TEST] 💬 Sending test WhatsApp to ${normalizedPhone}`);

    const provider = ChannelFactory.getProvider("WHATSAPP");
    const result = await provider.send(normalizedPhone, undefined, message);

    return {
      channel: "WHATSAPP",
      success: result.success,
      message: result.success ? `WhatsApp sent to ${normalizedPhone}` : "WhatsApp failed",
      messageId: result.messageId,
      error: result.error,
    };
  } catch (error) {
    console.error("[TEST] WhatsApp notification error:", error);
    return {
      channel: "WHATSAPP",
      success: false,
      message: "WhatsApp notification failed",
      error: (error as Error).message,
    };
  }
}

/**
 * Send test notifications to all channels for a user
 * Returns results for each channel
 */
export async function sendTestAllChannels(
  userId: string,
  email?: string,
  phone?: string
): Promise<{
  results: TestNotificationResult[];
  summary: { total: number; success: number; failed: number };
}> {
  console.log(`[TEST] 🧪 Testing all notification channels for user ${userId}`);

  const results: TestNotificationResult[] = [];

  // 1. Test Push (always if user has devices)
  const pushResult = await sendTestPushNotification(userId);
  results.push(pushResult);

  // 2. Test Email (if provided)
  if (email) {
    const emailResult = await sendTestEmailNotification(email);
    results.push(emailResult);
  } else {
    results.push({
      channel: "EMAIL",
      success: false,
      message: "Skipped - no email provided",
    });
  }

  // 3. Test SMS (if provided)
  if (phone) {
    const smsResult = await sendTestSMSNotification(phone);
    results.push(smsResult);
  } else {
    results.push({
      channel: "SMS",
      success: false,
      message: "Skipped - no phone provided",
    });
  }

  // 4. Test WhatsApp (if provided)
  if (phone) {
    const whatsappResult = await sendTestWhatsAppNotification(phone);
    results.push(whatsappResult);
  } else {
    results.push({
      channel: "WHATSAPP",
      success: false,
      message: "Skipped - no phone provided",
    });
  }

  const summary = {
    total: results.length,
    success: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
  };

  console.log(`[TEST] 📊 Test complete: ${summary.success}/${summary.total} channels succeeded`);

  return { results, summary };
}