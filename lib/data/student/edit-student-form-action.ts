'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

import { z } from 'zod'; // Import zod to declare z variable
import { StudentProfileFormData, studentProfileSchema } from '@/lib/schemas';
import prisma from '@/lib/db';

export async function editStudentProfileForm(
  studentId: string,
  data: StudentProfileFormData
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: 'Unauthorized. Please sign in.',
      };
    }

    // Validate the form data
    const validatedData = studentProfileSchema.parse(data);

    // Check if user has permission to edit this student profile
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        parents: {
          include: {
            parent: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      return {
        success: false,
        error: 'Student not found.',
      };
    }

    // Check permissions - student can edit their own profile, parents can edit their children's profiles
    const isOwnProfile = student.user?.clerkId === userId;
    const isParent = student.parents.some(
      (ps) => ps.parent.user?.clerkId === userId
    );

    if (!isOwnProfile && !isParent) {
      return {
        success: false,
        error: "You don't have permission to edit this profile.",
      };
    }

    // Update the student profile
    await prisma.student.update({
      where: { id: studentId },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        middleName: validatedData.middleName,
        motherName: validatedData.motherName,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        gender: validatedData.gender,
        phoneNumber: validatedData.phoneNumber,
        whatsAppNumber: validatedData.whatsAppNumber,
        email: validatedData.email,
        emergencyContact: validatedData.emergencyContact,
        profileImage: validatedData.profileImage,
        fullName: `${validatedData.firstName} ${validatedData.middleName ? validatedData.middleName + ' ' : ''}${validatedData.lastName}`,
        updatedAt: new Date(),
      },
    });

    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard/student-profile');

    return {
      success: true,
      message: 'Profile updated successfully!',
    };
  } catch (error) {
    console.error('Error updating student profile:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid form data. Please check your inputs.',
        fieldErrors: error.flatten().fieldErrors,
      };
    }

    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}
