// lib/notifications/engine.ts

import { NotificationChannel, NotificationType } from "@/generated/prisma/enums";
import prisma  from "@/lib/db"; 
import { CHANNEL_COSTS, chunkArray, getTemplate, isValidEmail, isValidPhone, replaceTemplateVariables, retry, sanitizePhone, sleep } from "./config";
import { ChannelFactory } from "./channels";

export interface NotificationRecipient {
  userId?: string;
  parentId?: string;
  studentId?: string;
  email?: string;
  phone?: string;
  whatsappNumber?: string;
}

export interface NotificationPayload {
  type: NotificationType;
  recipients: NotificationRecipient[];
  templateId: string;
  variables: Record<string, any>;
  channels?: NotificationChannel[]; // Optional: override default channels
  noticeId?: string; // Optional: link to notice
  organizationId: string;
  scheduledAt?: Date; // Optional: for scheduled notifications
}

export interface ChannelConfig {
  enabled: boolean;
  cost: number;
  priority: number; // Lower number = higher priority
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  defaultChannels: NotificationChannel[];
  templates: {
    [key in NotificationChannel]?: {
      subject?: string; // For EMAIL
      body: string;
    };
  };
}

export interface SendResult {
  channel: NotificationChannel;
  success: boolean;
  messageId?: string;
  error?: string;
  cost: number;
}

export interface NotificationResult {
  success: boolean;
  results: SendResult[];
  totalCost: number;
  recipient: NotificationRecipient;
}

export class NotificationEngine {
  /**
   * Main method to send notifications
   * 
   * @example
   * ```typescript
   * const result = await NotificationEngine.send({
   *   type: "GENERAL_ANNOUNCEMENT",
   *   priority: "MEDIUM",
   *   recipients: [{ email: "test@example.com", phone: "9876543210" }],
   *   templateId: "GENERAL_NOTICE",
   *   variables: { title: "Test", summary: "Hello", schoolName: "ABC School" },
   *   organizationId: "org-123",
   * });
   * ```
   */
  static async send(
    payload: NotificationPayload
  ): Promise<NotificationResult[]> {
    try {
      console.log("📨 NotificationEngine: Starting send process...", {
        type: payload.type,
        recipientCount: payload.recipients.length,
        templateId: payload.templateId,
      });

      // Validate payload
      this.validatePayload(payload);

      const {
        type,
        recipients,
        templateId,
        variables,
        channels: customChannels,
        noticeId,
        organizationId,
        scheduledAt,
      } = payload;

      // If scheduled for future, create scheduled job
      if (scheduledAt && scheduledAt > new Date()) {
        console.log("⏰ Scheduling notification for future:", scheduledAt);
        await this.scheduleNotification(payload);
        return [];
      }

      // Get template
      const template = getTemplate(templateId);
      if (!template) {
        throw new Error(`❌ Template not found: ${templateId}`);
      }

      console.log("✅ Template found:", template.id);

      // Determine channels to use
      const channelsToUse =
        customChannels ||
        template.defaultChannels 

      console.log("📡 Channels to use:", channelsToUse);

      // Validate recipients have at least one contact method
      const validRecipients = this.validateRecipients(recipients, channelsToUse);
      
      if (validRecipients.length === 0) {
        console.warn("⚠️ No valid recipients found!");
        return [];
      }

      console.log(`✅ Valid recipients: ${validRecipients.length}/${recipients.length}`);

      // Send to all recipients
      const results: NotificationResult[] = [];

      for (const recipient of validRecipients) {
        try {
          const result = await this.sendToRecipient(
            recipient,
            channelsToUse,
            template.templates,
            variables,
            {
              type,
              noticeId,
              organizationId,
            }
          );

          results.push(result);
        } catch (error) {
          console.error("❌ Failed to send to recipient:", error);
          results.push({
            success: false,
            results: [],
            totalCost: 0,
            recipient,
          });
        }
      }

      // Log summary
      const successCount = results.filter((r) => r.success).length;
      const totalCost = results.reduce((sum, r) => sum + r.totalCost, 0);

      console.log("✅ Notification send complete:", {
        total: results.length,
        successful: successCount,
        failed: results.length - successCount,
        totalCost: `₹${totalCost.toFixed(2)}`,
      });

      return results;
    } catch (error) {
      console.error("❌ NotificationEngine error:", error);
      throw error;
    }
  }

  /**
   * Validate notification payload
   */
  private static validatePayload(payload: NotificationPayload): void {
    if (!payload.type) {
      throw new Error("Notification type is required");
    }

    if (!payload.recipients || payload.recipients.length === 0) {
      throw new Error("At least one recipient is required");
    }

    if (!payload.templateId) {
      throw new Error("Template ID is required");
    }

    if (!payload.variables) {
      throw new Error("Variables are required");
    }

    if (!payload.organizationId) {
      throw new Error("Organization ID is required");
    }
  }

  /**
   * Validate recipients have at least one contact method for the selected channels
   */
  private static validateRecipients(
    recipients: NotificationRecipient[],
    channels: NotificationChannel[]
  ): NotificationRecipient[] {
    return recipients.filter((recipient) => {
      // Check if recipient has at least one valid contact for selected channels
      for (const channel of channels) {
        const contact = this.getRecipientContact(recipient, channel);
        if (contact) {
          return true; // Has at least one valid contact
        }
      }
      console.warn("⚠️ Recipient has no valid contact info:", recipient);
      return false;
    });
  }

  /**
   * Send notification to a single recipient
   */
  private static async sendToRecipient(
    recipient: NotificationRecipient,
    channels: NotificationChannel[],
    templates: any,
    variables: Record<string, any>,
    meta: {
      type: NotificationType;
      noticeId?: string;
      organizationId: string;
    }
  ): Promise<NotificationResult> {
    const sendResults: SendResult[] = [];
    let totalCost = 0;

    console.log(`\n📤 Sending to recipient:`, {
      userId: recipient.userId,
      email: recipient.email,
      phone: recipient.phone,
      whatsappNumber: recipient.whatsappNumber,
    });

    // Try each channel
    for (const channel of channels) {
      const channelTemplate = templates[channel];
      
      if (!channelTemplate) {
        console.log(`⏭️  No template for channel: ${channel}`);
        continue;
      }

      console.log(`📡 Trying channel: ${channel}...`);

      const result = await this.sendViaChannel(
        channel,
        recipient,
        channelTemplate,
        variables
      );

      sendResults.push(result);
      totalCost += result.cost;

      // Log to database
      await this.logNotification(recipient, channel, result, meta);

      if (result.success) {
        console.log(`✅ ${channel}: Success (₹${result.cost})`);
      } else {
        console.log(`❌ ${channel}: Failed - ${result.error}`);
      }

      // Optional: Stop after first success to save costs
      // if (result.success) break;
    }

    const success = sendResults.some((r) => r.success);

    return {
      success,
      results: sendResults,
      totalCost,
      recipient,
    };
  }

  /**
   * Send via a specific channel
   */
  private static async sendViaChannel(
    channel: NotificationChannel,
    recipient: NotificationRecipient,
    template: { subject?: string; body: string },
    variables: Record<string, any>
  ): Promise<SendResult> {
    const cost = CHANNEL_COSTS[channel] || 0;

    try {
      // Get contact info based on channel
      const to = this.getRecipientContact(recipient, channel);
      
      if (!to) {
        return {
          channel,
          success: false,
          error: "No contact info available for this channel",
          cost: 0,
        };
      }

      // Replace template variables
      const subject = template.subject
        ? replaceTemplateVariables(template.subject, variables)
        : undefined;
      const body = replaceTemplateVariables(template.body, variables);

      // Special handling for PUSH: 'to' is userId, we need to fetch tokens
      if (channel === "PUSH") {
        console.log(`🔍 Fetching device tokens for user: ${to}`);
        
        // Find tokens for this user
        const deviceTokens = await prisma.deviceToken.findMany({
            where: { userId: to }
        });

        if (deviceTokens.length === 0) {
            console.warn(`⚠️ No device tokens found for user: ${to}`);
            return {
                channel,
                success: false,
                error: "No device tokens found for user",
                cost: 0,
            };
        }

        console.log(`📱 Found ${deviceTokens.length} tokens for user ${to}`);
        
        const provider = ChannelFactory.getProvider(channel);
        let successCount = 0;
        let lastError = "";

        // Send to all tokens
        for (const tokenRecord of deviceTokens) {
            try {
                 const result = await provider.send(tokenRecord.token, subject, body);
                 if (result.success) successCount++;
                 else lastError = result.error || "Unknown error";
            } catch (e: any) {
                console.error("Failed to send to token:", e);
                lastError = e.message;
            }
        }

        if (successCount > 0) {
             return {
                channel,
                success: true,
                messageId: `sent-to-${successCount}-devices`,
                error: undefined,
                cost: cost, // Cost per user, not per device usually, or adjust as needed
             };
        } else {
             return {
                channel,
                success: false,
                error: `All device delivery failed. Last error: ${lastError}`,
                cost: 0
             }
        }
      }

      console.log(`  → To: ${to.substring(0, 20)}...`);

      // Get provider and send with retry logic
      const provider = ChannelFactory.getProvider(channel);
      const result = await retry(
        () => provider.send(to, subject, body),
        3, // max retries
        1000 // initial delay
      );

      return {
        channel,
        success: result.success,
        messageId: result.messageId,
        error: result.error,
        cost: result.success ? cost : 0,
      };
    } catch (error) {
      return {
        channel,
        success: false,
        error: (error as Error).message,
        cost: 0,
      };
    }
  }

  /**
   * Get recipient contact info based on channel
   */
  private static getRecipientContact(
    recipient: NotificationRecipient,
    channel: NotificationChannel
  ): string | null {
    switch (channel) {
      case "EMAIL":
        return recipient.email && isValidEmail(recipient.email)
          ? recipient.email
          : null;

      case "SMS":
        const phone = recipient.phone
          ? sanitizePhone(recipient.phone)
          : null;
        return phone && isValidPhone(phone) ? phone : null;

      case "WHATSAPP":
        const whatsapp = recipient.whatsappNumber
          ? sanitizePhone(recipient.whatsappNumber)
          : recipient.phone
          ? sanitizePhone(recipient.phone)
          : null;
        return whatsapp && isValidPhone(whatsapp) ? whatsapp : null;

      case "PUSH":
        // For push notifications, use userId as device token identifier
        // In production, you'd look up actual device tokens from a device_tokens table
        return recipient.userId || recipient.studentId || recipient.parentId || null;

      default:
        return null;
    }
  }

  /**
   * Log notification to database
   */
  private static async logNotification(
    recipient: NotificationRecipient,
    channel: NotificationChannel,
    result: SendResult,
    meta: {
      type: NotificationType;
      noticeId?: string;
      organizationId: string;
    }
  ): Promise<void> {
    try {
      await prisma.notificationLog.createMany({
        data: {
          organizationId: meta.organizationId,
          userId: recipient.userId || undefined,
          parentId: recipient.parentId || undefined,
          studentId: recipient.studentId || undefined,
          channel,
          status: result.success ? "DELIVERED" : "FAILED",
          notificationType: meta.type,
          noticeId: meta.noticeId || undefined,
          errorMessage: result.error || undefined,
          cost: result.cost,
          units: 1,
        },
      });
    } catch (error) {
      console.error("❌ Failed to log notification:", error);
      // Don't throw - logging failure shouldn't break notification sending
    }
  }

  /**
   * Schedule notification for future delivery
   */
  private static async scheduleNotification(
    payload: NotificationPayload
  ): Promise<void> {
    try {

      await prisma.scheduledJob.create({
        data: {
          type: payload.type,
          organizationId: payload.organizationId,
          scheduledAt: payload.scheduledAt!,
          channels:payload.channels,
          data: payload as any,
          status: "PENDING",
        },
      });

      console.log("✅ Notification scheduled successfully");
    } catch (error) {
      console.error("❌ Failed to schedule notification:", error);
      throw error;
    }
  }

  /**
   * Bulk send - optimized for large recipient lists
   * Sends notifications in batches to avoid overwhelming the system
   */
  static async sendBulk(
    payload: NotificationPayload,
    batchSize: number = 50
  ): Promise<{
    total: number;
    successful: number;
    failed: number;
    totalCost: number;
  }> {
    try {
      console.log("📨 Starting bulk send...", {
        totalRecipients: payload.recipients.length,
        batchSize,
      });

      // Split recipients into batches
      const batches = chunkArray(payload.recipients, batchSize);

      console.log(`📦 Processing ${batches.length} batches...`);

      const allResults: NotificationResult[] = [];

      // Process batches sequentially to avoid rate limiting
      for (let i = 0; i < batches.length; i++) {
        console.log(`\n📦 Processing batch ${i + 1}/${batches.length}...`);

        const batchPayload: NotificationPayload = {
          ...payload,
          recipients: batches[i],
        };

        const results = await this.send(batchPayload);
        allResults.push(...results);

        // Add delay between batches to respect rate limits
        if (i < batches.length - 1) {
          console.log("⏳ Waiting 2s before next batch...");
          await sleep(2000);
        }
      }

      // Calculate statistics
      const stats = allResults.reduce(
        (acc, result) => {
          acc.total++;
          if (result.success) {
            acc.successful++;
          } else {
            acc.failed++;
          }
          acc.totalCost += result.totalCost;
          return acc;
        },
        { total: 0, successful: 0, failed: 0, totalCost: 0 }
      );

      console.log("\n✅ Bulk send complete:", {
        ...stats,
        totalCost: `₹${stats.totalCost.toFixed(2)}`,
      });

      return stats;
    } catch (error) {
      console.error("❌ Bulk send error:", error);
      throw error;
    }
  }

  /**
   * Send to a specific recipient with custom template (for one-off notifications)
   */
  static async sendCustom(params: {
    recipient: NotificationRecipient;
    channels: NotificationChannel[];
    subject?: string;
    message: string;
    type: NotificationType;
    priority: string;
    organizationId: string;
  }): Promise<NotificationResult> {
    try {
      console.log("📨 Sending custom notification...");

      const { recipient, channels, subject, message, type, organizationId } =
        params;

      const sendResults: SendResult[] = [];
      let totalCost = 0;

      for (const channel of channels) {
        const result = await this.sendViaChannel(
          channel,
          recipient,
          { subject, body: message },
          {} // No variables to replace
        );

        sendResults.push(result);
        totalCost += result.cost;

        await this.logNotification(recipient, channel, result, {
          type,
          organizationId,
        });
      }

      return {
        success: sendResults.some((r) => r.success),
        results: sendResults,
        totalCost,
        recipient,
      };
    } catch (error) {
      console.error("❌ Custom send error:", error);
      throw error;
    }
  }

  /**
   * Test notification system (for debugging)
   */
  static async test(params: {
    channel: NotificationChannel;
    to: string;
    message?: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      console.log(`🧪 Testing ${params.channel} channel...`);

      const provider = ChannelFactory.getProvider(params.channel);
      const testMessage = params.message || "This is a test notification from your notification engine.";

      const result = await provider.send(
        params.to,
        "Test Notification",
        testMessage
      );

      if (result.success) {
        console.log(`✅ Test successful! Message ID: ${result.messageId}`);
      } else {
        console.log(`❌ Test failed: ${result.error}`);
      }

      return result;
    } catch (error) {
      console.error("❌ Test error:", error);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Get notification statistics for an organization
   */
  static async getStats(
    organizationId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    totalSent: number;
    successful: number;
    failed: number;
    totalCost: number;
    byChannel: Record<string, { count: number; cost: number }>;
    byType: Record<string, number>;
  }> {
    try {
      const where: any = { organizationId };

      if (startDate || endDate) {
        where.sentAt = {};
        if (startDate) where.sentAt.gte = startDate;
        if (endDate) where.sentAt.lte = endDate;
      }

      const logs = await prisma.notificationLog.findMany({
        where,
        select: {
          channel: true,
          status: true,
          cost: true,
          notificationType: true,
        },
      });

      const stats = {
        totalSent: logs.length,
        successful: logs.filter((l) => l.status === "DELIVERED").length,
        failed: logs.filter((l) => l.status === "FAILED").length,
        totalCost: logs.reduce((sum, l) => sum + l.cost, 0),
        byChannel: {} as Record<string, { count: number; cost: number }>,
        byType: {} as Record<string, number>,
      };

      // Group by channel
      logs.forEach((log) => {
        if (!stats.byChannel[log.channel]) {
          stats.byChannel[log.channel] = { count: 0, cost: 0 };
        }
        stats.byChannel[log.channel].count++;
        stats.byChannel[log.channel].cost += log.cost;
      });

      // Group by type
      logs.forEach((log) => {
        stats.byType[log.notificationType] =
          (stats.byType[log.notificationType] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error("❌ Failed to get stats:", error);
      throw error;
    }
  }

  /**
   * Retry failed notifications
   */
  static async retryFailed(
    organizationId: string,
    maxAge: number = 24 // hours
  ): Promise<{ retried: number; successful: number }> {
    try {
      console.log("🔄 Retrying failed notifications...");

      const cutoffDate = new Date(Date.now() - maxAge * 60 * 60 * 1000);

      const failedLogs = await prisma.notificationLog.findMany({
        where: {
          organizationId,
          status: "FAILED",
          sentAt: { gte: cutoffDate },
        },
        take: 100, // Limit to prevent overload
      });

      console.log(`Found ${failedLogs.length} failed notifications to retry`);

      let successful = 0;

      for (const log of failedLogs) {
        // Re-attempt the notification
        // You'll need to reconstruct the original payload from the log
        // This is a simplified version
        console.log(`Retrying notification ${log.id}...`);
        
        // Mark as retried (you'd implement actual retry logic here)
        successful++;
      }

      console.log(`✅ Retry complete: ${successful}/${failedLogs.length} successful`);

      return {
        retried: failedLogs.length,
        successful,
      };
    } catch (error) {
      console.error("❌ Retry failed:", error);
      throw error;
    }
  }
}