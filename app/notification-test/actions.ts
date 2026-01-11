"use server"

import { getCurrentUserId } from "@/lib/user"
import prisma from "@/lib/db"
import {
    sendTestPushNotification,
    sendTestEmailNotification,
    sendTestSMSNotification,
    sendTestWhatsAppNotification,
    sendTestAllChannels,
} from "@/lib/notifications/engine"
import { ChannelFactory } from "@/lib/notifications/channels"

/**
 * Test push notification for the current user
 */
export async function testPushNotification() {
    try {
        const userId = await getCurrentUserId()
        if (!userId) {
            return { success: false, message: "Not authenticated", error: "Not authenticated" }
        }

        const result = await sendTestPushNotification(
            userId,
            "🔔 Test Push Notification",
            "If you're seeing this, push notifications are working!"
        )

        return result
    } catch (error) {
        console.error("Test push error:", error)
        return { success: false, message: "Push failed", error: (error as Error).message }
    }
}

/**
 * Test push notification with a custom FCM token
 */
export async function testPushWithToken(fcmToken: string) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) {
            return { success: false, message: "Not authenticated", error: "Not authenticated" }
        }

        if (!fcmToken || fcmToken.trim() === "") {
            return { success: false, message: "No token provided", error: "FCM token is required" }
        }

        console.log(`[TEST] 🔔 Sending test push to custom token: ${fcmToken.substring(0, 20)}...`)

        const provider = ChannelFactory.getProvider("PUSH")
        const result = await provider.send(
            fcmToken.trim(),
            "🔔 Test Push Notification",
            "If you're seeing this, push notifications are working!",
            { link: "/dashboard", test: "true" }
        )

        if (result.success) {
            return {
                success: true,
                message: "Push sent to custom token",
                messageId: result.messageId,
            }
        } else {
            return {
                success: false,
                message: "Push to custom token failed",
                error: result.error,
            }
        }
    } catch (error) {
        console.error("Test push with token error:", error)
        return { success: false, message: "Push failed", error: (error as Error).message }
    }
}

/**
 * Test email notification
 */
export async function testEmailNotification(email: string) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            return { success: false, error: "Not authenticated" };
        }

        const result = await sendTestEmailNotification(
            email,
            "🔔 Test Email from Nexus",
            "If you received this email, email notifications are working correctly!"
        );

        return result;
    } catch (error) {
        console.error("Test email error:", error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Test SMS notification
 */
export async function testSMSNotification(phone: string) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            return { success: false, error: "Not authenticated" };
        }

        const result = await sendTestSMSNotification(phone);

        return result;
    } catch (error) {
        console.error("Test SMS error:", error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Test WhatsApp notification
 */
export async function testWhatsAppNotification(phone: string) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            return { success: false, error: "Not authenticated" };
        }

        const result = await sendTestWhatsAppNotification(phone);

        return result;
    } catch (error) {
        console.error("Test WhatsApp error:", error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Test all channels for the current user
 */
export async function testAllChannels(email?: string, phone?: string) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            return { success: false, error: "Not authenticated", results: [], summary: { total: 0, success: 0, failed: 0 } };
        }

        const result = await sendTestAllChannels(userId, email, phone);

        return { success: true, ...result };
    } catch (error) {
        console.error("Test all channels error:", error);
        return { success: false, error: (error as Error).message, results: [], summary: { total: 0, success: 0, failed: 0 } };
    }
}

/**
 * Get current user's notification info (device count, email, etc.)
 */
export async function getNotificationTestInfo() {
    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            return { success: false, error: "Not authenticated" };
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                email: true,
                student: { select: { phoneNumber: true, whatsAppNumber: true } },
                parent: { select: { phoneNumber: true, whatsAppNumber: true } },
                deviceTokens: {
                    select: { id: true, platform: true, lastUsedAt: true },
                    orderBy: { lastUsedAt: "desc" },
                },
            },
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        const phone = user.student?.phoneNumber || user.parent?.phoneNumber;
        const whatsapp = user.student?.whatsAppNumber || user.parent?.whatsAppNumber;

        return {
            success: true,
            userId,
            email: user.email,
            phone,
            whatsapp,
            deviceCount: user.deviceTokens.length,
            devices: user.deviceTokens.map((d) => ({
                platform: d.platform,
                lastUsed: d.lastUsedAt,
            })),
        };
    } catch (error) {
        console.error("Get notification info error:", error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Get device tokens for a specific user ID
 */
export async function getUserTokens(userId: string) {
    try {
        const currentUserId = await getCurrentUserId()
        if (!currentUserId) {
            return { success: false, error: "Not authenticated", tokens: [] }
        }

        if (!userId || userId.trim() === "") {
            return { success: false, error: "User ID is required", tokens: [] }
        }

        const user = await prisma.user.findUnique({
            where: { id: userId.trim() },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                deviceTokens: {
                    select: {
                        id: true,
                        token: true,
                        platform: true,
                        lastUsedAt: true,
                        createdAt: true,
                    },
                    orderBy: { lastUsedAt: "desc" },
                },
            },
        })

        if (!user) {
            return { success: false, error: "User not found", tokens: [] }
        }

        return {
            success: true,
            user: {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
            },
            tokens: user.deviceTokens.map((t) => ({
                id: t.id,
                token: t.token,
                platform: t.platform,
                lastUsedAt: t.lastUsedAt,
                createdAt: t.createdAt,
            })),
        }
    } catch (error) {
        console.error("Get user tokens error:", error)
        return { success: false, error: (error as Error).message, tokens: [] }
    }
}

/**
 * Delete a specific device token
 */
export async function deleteDeviceToken(tokenId: string) {
    try {
        const currentUserId = await getCurrentUserId()
        if (!currentUserId) {
            return { success: false, error: "Not authenticated" }
        }

        await prisma.deviceToken.delete({
            where: { id: tokenId },
        })

        return { success: true }
    } catch (error) {
        console.error("Delete token error:", error)
        return { success: false, error: (error as Error).message }
    }
}
