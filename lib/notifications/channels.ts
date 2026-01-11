// lib/notifications/channels.ts

import { NotificationChannel } from "@/generated/prisma/enums";
import admin from "firebase-admin";
import { Message } from "firebase-admin/messaging";
import { Resend } from "resend";
import { NotificationBody } from "./template";

// ============================================
// CHANNEL PROVIDER INTERFACE
// ============================================
export interface ChannelProvider {
  send(
    to: string,
    subject: string | undefined,
    body: NotificationBody,
    data?: { link?: string;[key: string]: any }
  ): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
    data?: any;
  }>;
}

// ============================================
// EMAIL PROVIDER (using Resend)
// ============================================
class EmailProvider implements ChannelProvider {
  async send(to: string, subject: string, body: NotificationBody) {
    try {

      const resend = new Resend(process.env.RESEND_API_KEY!);
      const { data, error } = await resend.emails.send({
        from: 'no-reply@shiksha.cloud',
        to,
        subject,
        react: body,
      });
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}

// ============================================
// SMS PROVIDER (using Fast2SMS)
// ============================================
class SMSProvider implements ChannelProvider {
  async send(to: string, _subject: string | undefined, body: NotificationBody) {
    try {
      const apiKey = process.env.FAST2SMS_API_KEY;

      if (!apiKey) {
        return { success: false, error: "FAST2SMS_API_KEY not configured" };
      }

      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: apiKey,
        },
        body: JSON.stringify({
          route: "q",
          message: body,
          language: "english",
          flash: 0,
          numbers: to,
        }),
      });

      const data = await response.json();

      if (data.return === true) {
        return { success: true, messageId: data.request_id };
      }

      return {
        success: false,
        error: data.message || "Failed to send SMS",
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}

// ============================================
// WHATSAPP PROVIDER (using Meta Business API)
// ============================================
class WhatsAppProvider implements ChannelProvider {
  async send(to: string, _subject: string | undefined, body: NotificationBody) {
    try {
      const payload = {
        messaging_product: "whatsapp",
        to: `91${to}`, // Add country code
        type: "text",
        text: { body },
      };
      const response = await fetch(`https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("WhatsApp API Response:", data);

      if (response.ok && data.messages) {
        return { success: true, messageId: data.messages[0].id };
      }// Optional logging
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("WhatsApp Send Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send message",
      };
    }
  }
}

// ============================================
// PUSH NOTIFICATION PROVIDER
// ============================================

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}


class PushProvider implements ChannelProvider {
  async send(
    fcmToken: string,
    subject: string | undefined,
    body: NotificationBody,
    data?: { link?: string;[key: string]: any }
  ) {
    try {
      if (!fcmToken) {
        return {
          success: false,
          error: "FCM token is required",
        };
      }

      console.log(`[PUSH] To: ${fcmToken}, Subject: ${subject}, Body: ${body}`);

      const payload: Message = {
        token: fcmToken,
        notification: {
          title: subject || "Notification",
          body: typeof body === "string" ? body : "Notification Detail",
        },
        // Add link if provided
        webpush: data?.link
          ? {
            fcmOptions: {
              link: data.link,
            },
            notification: {
              timestamp: Date.now(),
              icon: '/icons/icon-192x192.png',
              badge: '/icons/badge-72x72.png',
            },
          }
          : {
            notification: {
              timestamp: Date.now(),
              icon: '/icons/icon-192x192.png',
              badge: '/icons/badge-72x72.png',
            },
          },
        // Add custom data
        data: {
          ...(data ? Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, String(v)])
          ) : {}),
          notif_id: Math.random().toString(36).substring(7),
          sent_at: new Date().toISOString(),
        },
      };

      const response = await admin.messaging().send(payload);


      // For now, just log

      return {
        success: true,
        messageId: response,
      };
    } catch (error) {
      console.error("Push notification error:", error);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}

// ============================================
// CHANNEL FACTORY
// Returns the appropriate provider for each channel
// ============================================
export class ChannelFactory {
  private static providers: Map<NotificationChannel, ChannelProvider> = new Map();

  static getProvider(channel: NotificationChannel): ChannelProvider {
    // Create provider if not exists
    if (!this.providers.has(channel)) {
      let provider: ChannelProvider;

      switch (channel) {
        case "EMAIL":
          provider = new EmailProvider();
          break;
        case "SMS":
          provider = new SMSProvider();
          break;
        case "WHATSAPP":
          provider = new WhatsAppProvider();
          break;
        case "PUSH":
          provider = new PushProvider();
          break;
        default:
          throw new Error(`Unsupported channel: ${channel}`);
      }

      this.providers.set(channel, provider);
    }

    return this.providers.get(channel)!;
  }
}