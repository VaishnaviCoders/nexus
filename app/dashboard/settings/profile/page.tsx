import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StudentProfileEditForm } from '@/components/dashboard/Student/StudentProfileEditForm';

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

export async function getStudentProfile(studentId?: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error('Unauthorized');
    }

    let student;

    if (studentId) {
      // Get specific student (for parents/admins)
      student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
          user: true,
          grade: true,
          section: true,
          organization: true,
          ParentStudent: {
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
    } else {
      // Get current user's student profile
      student = await prisma.student.findFirst({
        where: {
          user: {
            clerkId: userId,
          },
        },
        include: {
          user: true,
          grade: true,
          section: true,
          organization: true,
          ParentStudent: {
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
    }

    if (!student) {
      return null;
    }

    // Check permissions
    const isOwnProfile = student.user?.clerkId === userId;
    const isParent = student.ParentStudent.some(
      (ps) => ps.parent.user?.clerkId === userId
    );

    if (!isOwnProfile && !isParent) {
      throw new Error('Unauthorized to view this profile');
    }

    console.log(
      'Student profile:',
      student.ParentStudent.filter((ps) => ps.isPrimary === true)
    );

    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      middleName: student.middleName,
      motherName: student.motherName,
      fullName: student.fullName,
      dateOfBirth: student.dateOfBirth,
      profileImage: student.profileImage,
      rollNumber: student.rollNumber,
      phoneNumber: student.phoneNumber,
      whatsAppNumber: student.whatsAppNumber,
      email: student.email,
      emergencyContact: student.emergencyContact,
      gender: student.gender,
      grade: student.grade.grade,
      section: student.section.name,
      organization: student.organization.name || '',
      canEditGrade: false, // Students/parents cannot edit grade
      canEditParentDetails: false, // Cannot edit parent details after submission
      isOwnProfile,
      isParent,
    };
  } catch (error) {
    console.error('Error fetching student profile:', error);
    throw error;
  }
}

async function StudentProfileEditContent() {
  const student = await getStudentProfile();

  if (!student) {
    redirect('/dashboard');
  }

  return <StudentProfileEditForm student={student} />;
}

function StudentProfileEditSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Card className="border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function StudentProfileEditPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<StudentProfileEditSkeleton />}>
        <StudentProfileEditContent />
      </Suspense>
    </div>
  );
}
