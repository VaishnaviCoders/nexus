'use server';

import prisma from "@/lib/db";
import { getCurrentUserId } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function getUserNotifications() {
  const userId = await getCurrentUserId()

  // We need to match Clerk userId to our User model to get the internal ID if needed, 
  // OR if we stored Clerk ID in NotificationLog.
  // NotificationLog has `userId` which is likely the internal User ID.
  const notifications = await prisma.notificationLog.findMany({
    where: {
      userId: userId,
      status: "DELIVERED", // Show only successfully delivered ones, or maybe all?
    },
    orderBy: {
      sentAt: 'desc',
    },
    take: 10, // Limit to recent 50
    select: {
      id: true,
      title: true,
      message: true,
      notificationType: true,
      channel: true,
      status: true,
      sentAt: true,
      cost: true,
      isRead: true,

      // We don't store the *content* directly in NotificationLog typically, 
      // but the model might have it?
      // Checking schema... NotificationLog has `errorMessage`, but not `body`.
      // It has `noticeId`.
      // WAIT. The schema doesn't have the message body! 
      // The current NotificationLog model is:
      // userId, parentId, studentId, channel, status, notificationType, noticeId, cost...
      // It DOES NOT store the message content (title/body).
      // This is a problem for a notification panel unless we link it to something.
      // However, usually detailed logs might be stored elsewhere or we need to add a `title` / `message` field to NotificationLog 
      // if we want to show them in a generic inbox.
      // For now, I will add `title` and `message` to the model schema as well in a separate step 
      // OR I will assume for now we just show the type. 
      // Users usually expect to see "You were marked absent".
      // Let's modify the schema to include `title` and `message` as well.
    }
  });


  return notifications;
}

export async function markAsRead(notificationId: string) {
  const userId = await getCurrentUserId();


  try {
    await prisma.notificationLog.update({
      where: {
        id: notificationId,
        // Ensure user owns this notification
        userId: userId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return { success: false, error: "Failed to update notification" };
  }
}

export async function markAllAsRead() {
  const userId = await getCurrentUserId();

  try {
    await prisma.notificationLog.updateMany({
      where: {
        userId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    return { success: false, error: "Failed to update notifications" };
  }
}
