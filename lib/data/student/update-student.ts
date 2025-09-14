'use server';
import prisma from '@/lib/db';
import { updateStudentSchema } from '@/lib/schemas';
import z from 'zod';

export async function UpdateStudentAction(
  data: z.infer<typeof updateStudentSchema>
) {
  try {
    const validatedData = updateStudentSchema.parse(data);

    await prisma.student.update({
      where: {
        id: validatedData.id,
      },
      data: {
        firstName: validatedData.firstName,
        middleName: validatedData.middleName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
        whatsAppNumber: validatedData.whatsAppNumber,

        rollNumber: validatedData.rollNumber,
        emergencyContact: validatedData.emergencyContact,
        profileImage: validatedData.profileImage,
        motherName: validatedData.motherName,
        fullName: validatedData.fullName,
        dateOfBirth: validatedData.dateOfBirth,
        gender: validatedData.gender,
        grade: {
          connect: { id: validatedData.gradeId },
        },
        section: {
          connect: { id: validatedData.sectionId },
        },
        parents: {
          deleteMany: { studentId: validatedData.id },
          create:
            validatedData.parents?.map((parent) => ({
              parent: {
                connectOrCreate: {
                  where: { email: parent.email },
                  create: {
                    firstName: parent.firstName,
                    lastName: parent.lastName,
                    email: parent.email,
                    phoneNumber: parent.phoneNumber,
                    whatsAppNumber: parent.whatsAppNumber || '',
                  },
                },
              },
              relationship: parent.relationship,
              isPrimary: parent.isPrimary ?? false,
            })) ?? [],
        },
      },
    });
  } catch (error) {
    // Robust error handling with custom error type and logging
    if (error instanceof z.ZodError) {
      // Validation error
      throw new Error(
        `Validation failed: ${error.errors.map((e) => e.message).join(', ')}`
      );
    }
    // Prisma error or unknown erro`r
    console.error('UpdateStudentAction error:', error);
    // Optionally, you could define a custom error class for consistency
    throw new Error('Failed to update student. Please try again later.');
  }
}
