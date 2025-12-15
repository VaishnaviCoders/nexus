'use server';

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";


export async function saveDeviceToken(token: string) {
  try {

    const user = await currentUser();

    if (!user) {
      // It's okay if there is no user, we just can't save the customized token 
      // but we shouldn't throw an error that breaks the client 
        return { success: false, error: "User not authenticated" };
    }

    await prisma.deviceToken.upsert({
      where: {
        token: token,
      },
      update: {
        lastUsedAt: new Date(),
        userId: user.id, // Ensure it's linked to the current user
      },
      create: {
        token: token,
        userId: user.id,
        platform: 'web', // Default to web for now
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to save device token:", error);
    return { success: false, error: "Failed to save device token" };
  }
}
