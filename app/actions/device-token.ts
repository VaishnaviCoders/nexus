'use server';

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

/**
 * Platform types for device tokens
 */
type Platform = 'web' | 'android' | 'ios';

/**
 * Save FCM device token for push notifications.
 * Token persists in DB for long-term notifications even when user is offline.
 * 
 * A user can have MULTIPLE tokens (one per device/browser):
 * - Phone: Gets a unique token
 * - Laptop Chrome: Gets a unique token  
 * - Laptop Firefox: Gets a unique token
 * 
 * IMPORTANT: DeviceToken.userId must be the database User.id (CUID),
 * NOT the Clerk ID. We look up the User by clerkId first.
 */
export async function saveDeviceToken(token: string, platform: Platform = 'web') {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }

    // Find the database User by their Clerk ID
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true }
    });

    if (!dbUser) {
      console.error(`❌ No database user found for Clerk ID: ${clerkUser.id}`);
      return { success: false, error: "User not found in database" };
    }

    // Use the database User.id (CUID) for DeviceToken
    await prisma.deviceToken.upsert({
      where: { token },
      update: {
        lastUsedAt: new Date(),
        userId: dbUser.id,  // Database User.id (CUID)
        platform,
      },
      create: {
        token,
        userId: dbUser.id,  // Database User.id (CUID)
        platform,
      },
    });

    console.log(`✅ Device token saved for user: ${dbUser.id} on platform: ${platform}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to save device token:", error);
    return { success: false, error: "Failed to save device token" };
  }
}

