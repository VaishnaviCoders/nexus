'use server';

import prisma from '@/lib/db';
import { getOrganizationId } from '@/lib/organization';
import { studentSchema } from '@/lib/schemas';
import { clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Configuration constants
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

// Utility function for delays
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Utility function for retrying operations
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxAttempts: number = RETRY_ATTEMPTS,
  delayMs: number = RETRY_DELAY
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`⚠️ Attempt ${attempt}/${maxAttempts} failed:`, error);

      if (attempt < maxAttempts) {
        await delay(delayMs * attempt); // Exponential backoff
      }
    }
  }

  throw lastError!;
}

// Enhanced error classes for better error handling
class StudentCreationError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'StudentCreationError';
  }
}

class ClerkOperationError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'ClerkOperationError';
  }
}

// Cleanup function for failed operations
async function cleanupFailedStudent(
  clerkUserIds: string[],
  organizationId: string
) {
  console.log('🧹 Starting cleanup for failed student creation...');

  const client = await clerkClient();

  for (const clerkId of clerkUserIds) {
    try {
      // Remove from organization first
      await client.organizations.deleteOrganizationMembership({
        organizationId,
        userId: clerkId,
      });
      console.log(`🗑️ Removed ${clerkId} from organization`);

      // Delete the Clerk user
      await client.users.deleteUser(clerkId);
      console.log(`🗑️ Deleted Clerk user ${clerkId}`);
    } catch (error) {
      console.error(`❌ Cleanup failed for ${clerkId}:`, error);
    }
  }
}

export async function createStudent(data: z.infer<typeof studentSchema>) {
  const organizationId = await getOrganizationId();
  const client = await clerkClient();
  const createdClerkUsers: string[] = []; // Track created users for cleanup

  console.log('🏢 Using organizationId:', organizationId);

  try {
    // Validate input data
    const validated = studentSchema.parse(data);
    console.log('📦 Student data validated successfully');

    // Get organization details including limits
    const organization = await client.organizations.getOrganization({
      organizationId,
    });

    console.log('✅ Clerk Organization Details:', organization);

    // Extract membership limit from organization details
    // This might be in organization.maxAllowedMemberships or similar property
    const membershipLimit = organization.maxAllowedMemberships || 100; // fallback to 100 if not available

    console.log('📊 Organization membership limit:', membershipLimit);

    // Check organization membership limit
    console.log('🔍 Checking organization membership limits...');
    const membershipList = await retryOperation(async () => {
      return await client.organizations.getOrganizationMembershipList({
        organizationId,
        limit: 1, // We only need the count
      });
    });

    const currentMemberCount = membershipList.totalCount;
    const requiredSlots = 1 + (validated.parents?.length || 0); // Student + parents

    if (currentMemberCount + requiredSlots > membershipLimit) {
      throw new StudentCreationError(
        `Organization has reached its maximum membership limit. Current: ${currentMemberCount}, Required: ${requiredSlots}, Limit: ${membershipLimit}`
      );
    }

    console.log(
      `✅ Membership check passed. Current: ${currentMemberCount}, Adding: ${requiredSlots}, Limit: ${membershipLimit}`
    );

    // Create or get student Clerk user
    console.log('👤 Processing student Clerk user...');
    const existingStudentClerkUser = await retryOperation(async () => {
      return await client.users.getUserList({
        emailAddress: [validated.email],
      });
    });

    let studentClerkUser;
    if (existingStudentClerkUser.data.length > 0) {
      studentClerkUser = existingStudentClerkUser.data[0];
      console.log(
        '✅ Found existing Clerk user for student:',
        studentClerkUser.id
      );
    } else {
      console.log('🔄 Creating new Clerk user for student...');
      studentClerkUser = await retryOperation(async () => {
        return await client.users.createUser({
          emailAddress: [validated.email],
          firstName: validated.firstName,
          lastName: validated.lastName,
          password: validated.phoneNumber,
          skipPasswordChecks: true,
          externalId: `student_${validated.rollNumber}_${Date.now()}`,
          privateMetadata: {
            role: 'STUDENT',
            organizationId,
          },
        });
      });
      createdClerkUsers.push(studentClerkUser.id);
      console.log('✅ Created Clerk user for student:', studentClerkUser.id);
    }

    // Add student to organization (only if not already a member)
    console.log('🏛️ Adding student to organization...');
    try {
      // Check if student is already a member
      const existingMembership =
        await client.organizations.getOrganizationMembershipList({
          organizationId,
        });

      if (existingMembership.data.length === 0) {
        await retryOperation(async () => {
          return await client.organizations.createOrganizationMembership({
            organizationId,
            userId: studentClerkUser.id,
            role: 'org:student',
          });
        });
        console.log('✅ Student added to organization successfully');
      } else {
        console.log('✅ Student already exists in organization');
      }
    } catch (error) {
      throw new ClerkOperationError(
        `Failed to add student to organization: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        error as Error
      );
    }

    // Process parents
    const parentClerkUsers: Array<{ clerkUser: any; parentData: any }> = [];

    if (validated.parents?.length) {
      console.log(`👨‍👩‍👧 Processing ${validated.parents.length} parents...`);

      for (const [index, parentData] of validated.parents.entries()) {
        console.log(`📧 Processing parent ${index + 1}: ${parentData.email}`);

        try {
          // Check for existing parent Clerk user
          const existingParentClerkUser = await retryOperation(async () => {
            return await client.users.getUserList({
              emailAddress: [parentData.email],
            });
          });

          let parentClerkUser;
          if (existingParentClerkUser.data.length > 0) {
            parentClerkUser = existingParentClerkUser.data[0];
            console.log(
              `✅ Found existing Clerk user for parent ${index + 1}:`,
              parentClerkUser.id
            );
          } else {
            console.log(
              `🔄 Creating new Clerk user for parent ${index + 1}...`
            );
            parentClerkUser = await retryOperation(async () => {
              return await client.users.createUser({
                emailAddress: [parentData.email],
                firstName: parentData.firstName,
                lastName: parentData.lastName,
                password: parentData.phoneNumber,
                skipPasswordChecks: true,
                externalId: `parent_${parentData.email}_${Date.now()}`,
                privateMetadata: {
                  role: 'PARENT',
                  organizationId,
                },
              });
            });
            createdClerkUsers.push(parentClerkUser.id);
            console.log(
              `✅ Created Clerk user for parent ${index + 1}:`,
              parentClerkUser.id
            );
          }

          // Add parent to organization (only if not already a member)
          console.log(`🏛️ Adding parent ${index + 1} to organization...`);
          const existingParentMembership =
            await client.organizations.getOrganizationMembershipList({
              organizationId,
            });

          if (existingParentMembership.data.length === 0) {
            await retryOperation(async () => {
              return await client.organizations.createOrganizationMembership({
                organizationId,
                userId: parentClerkUser.id,
                role: 'org:parent',
              });
            });
            console.log(
              `✅ Parent ${index + 1} added to organization successfully`
            );
          } else {
            console.log(
              `✅ Parent ${index + 1} already exists in organization`
            );
          }

          parentClerkUsers.push({ clerkUser: parentClerkUser, parentData });
        } catch (error) {
          console.error(`❌ Failed to process parent ${index + 1}:`, error);
          throw new ClerkOperationError(
            `Failed to process parent ${parentData.email}: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
            error as Error
          );
        }
      }
    }

    // Database transaction
    console.log('💾 Starting database transaction...');
    const student = await prisma.$transaction(
      async (tx) => {
        // Create student
        const newStudent = await tx.student.create({
          data: {
            organizationId,
            rollNumber: validated.rollNumber,
            firstName: validated.firstName,
            middleName: validated.middleName,
            lastName: validated.lastName,
            fullName: `${validated.firstName} ${validated.middleName ?? ''} ${
              validated.lastName
            }`.trim(),
            email: validated.email,
            phoneNumber: validated.phoneNumber,
            whatsAppNumber: validated.whatsAppNumber,
            sectionId: validated.sectionId,
            gradeId: validated.gradeId,
            gender: validated.gender,
            profileImage: validated.profileImage,
            dateOfBirth: new Date(validated.dateOfBirth),
            emergencyContact: validated.emergencyContact,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        console.log('✅ Student created in database:', newStudent.id);

        // Create or update student user record
        const studentUser = await tx.user.upsert({
          where: { clerkId: studentClerkUser.id },
          create: {
            clerkId: studentClerkUser.id,
            organizationId,
            email: validated.email,
            firstName: validated.firstName,
            lastName: validated.lastName,
            password: validated.phoneNumber,
            profileImage:
              validated.profileImage || studentClerkUser.imageUrl || '',
            role: 'STUDENT',
            studentId: newStudent.id,
            createdAt: new Date(),
          },
          update: {
            organizationId,
            email: validated.email,
            firstName: validated.firstName,
            lastName: validated.lastName,
            password: validated.phoneNumber,
            profileImage:
              validated.profileImage || studentClerkUser.imageUrl || '',
            role: 'STUDENT',
            studentId: newStudent.id,
            updatedAt: new Date(),
          },
        });
        console.log('✅ Student user record processed:', studentUser.id);

        // Process parents in database
        for (const { clerkUser, parentData } of parentClerkUsers) {
          console.log(`💾 Creating parent in database: ${parentData.email}`);

          // Create/update parent user record
          const prismaParentUser = await tx.user.upsert({
            where: { clerkId: clerkUser.id },
            create: {
              email: parentData.email,
              profileImage: clerkUser.imageUrl || '',
              firstName: parentData.firstName,
              lastName: parentData.lastName,
              clerkId: clerkUser.id,
              role: 'PARENT',
              organizationId,
              createdAt: new Date(),
            },
            update: {
              firstName: parentData.firstName,
              lastName: parentData.lastName,
              updatedAt: new Date(),
            },
          });
          console.log('✅ Parent user record processed:', prismaParentUser.id);

          // Create/update parent record
          const parent = await tx.parent.upsert({
            where: { email: parentData.email },
            update: {
              phoneNumber: parentData.phoneNumber,
              whatsAppNumber: parentData.whatsAppNumber ?? '',
              userId: prismaParentUser.id,
              updatedAt: new Date(),
            },
            create: {
              email: parentData.email,
              firstName: parentData.firstName,
              lastName: parentData.lastName,
              phoneNumber: parentData.phoneNumber,
              whatsAppNumber: parentData.whatsAppNumber ?? '',
              userId: prismaParentUser.id,
              createdAt: new Date(),
            },
          });
          console.log('✅ Parent record processed:', parent.id);

          // Create parent-student relationship
          await tx.parentStudent.create({
            data: {
              relationship: parentData.relationship,
              studentId: newStudent.id,
              parentId: parent.id,
            },
          });
          console.log('✅ Parent-student relationship created');
        }

        return newStudent;
      },
      {
        timeout: 30000, // 30 second timeout
      }
    );

    console.log('🎉 Student creation completed successfully:', student.id);

    // Revalidate cache
    revalidatePath('/dashboard/students/create');

    return {
      success: true,
      student,
      message: 'Student created successfully with all associated records.',
    };
  } catch (error) {
    console.error('❌ Student creation failed:', error);

    // Cleanup Clerk users if database transaction failed
    if (createdClerkUsers.length > 0) {
      console.log('🧹 Attempting cleanup of created Clerk users...');
      await cleanupFailedStudent(createdClerkUsers, organizationId);
    }

    // Determine error type and throw appropriate error
    if (
      error instanceof StudentCreationError ||
      error instanceof ClerkOperationError
    ) {
      throw error;
    } else if (error instanceof z.ZodError) {
      throw new StudentCreationError(
        `Validation failed: ${error.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ')}`
      );
    } else {
      throw new StudentCreationError(
        `Unexpected error during student creation: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        error as Error
      );
    }
  }
}
