"use server"

import prisma from "@/lib/db"
import { NotificationChannel } from "@/generated/prisma/enums"
import { revalidatePath } from "next/cache"

export async function updateNotificationSetting(
  settingId: string,
  channel: NotificationChannel,
  enabled: boolean,
  eventKey?: string
) {
  try {
    const setting = await prisma.notificationSetting.findUnique({
      where: { id: settingId },
      select: { channels: true }
    })

    if (!setting) throw new Error("Setting not found")

    const currentChannels = (setting.channels as any) || {}
    
    // Update logic: handle nested events or direct channel config
    if (eventKey) {
      if (!currentChannels[eventKey]) currentChannels[eventKey] = {}
      currentChannels[eventKey][channel] = {
        ...(currentChannels[eventKey][channel] || {}),
        enabled
      }
    } else {
      currentChannels[channel] = {
        ...(currentChannels[channel] || {}),
        enabled
      }
    }

    await prisma.notificationSetting.update({
      where: { id: settingId },
      data: {
        channels: currentChannels
      }
    })

    revalidatePath("/dashboard/settings")
    return { success: true }
  } catch (error) {
    console.error("Failed to update notification setting:", error)
    return { success: false, error: "Failed to update setting" }
  }
}
