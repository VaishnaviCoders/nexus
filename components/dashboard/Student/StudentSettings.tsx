import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import NotificationSettings from '@/components/settings/notification-settings';
// import DocumentManager from '@/components/settings/document-manager';
// import EmergencyContactForm from '@/components/settings/emergency-contact-form';
// import SecuritySettings from '@/components/settings/security-settings';
// import FeeSettings from '@/components/settings/fee-settings';
import { StudentProfileEditForm } from './StudentProfileEditForm';

import SidebarPreferences from '@/components/dashboard-layout/sidebar-preferences';
import prisma from '@/lib/db';
import { getCurrentUserId } from '@/lib/user';
import { getCurrentUserByRole } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export async function getStudentProfile(studentId?: string) {
  try {
    const userId = await getCurrentUserId();

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
    }

    if (!student) {
      return null;
    }

    // Check permissions
    const isOwnProfile = student.user?.clerkId === userId;
    const isParent = student.parents.some(
      (ps) => ps.parent.user?.clerkId === userId
    );

    if (!isOwnProfile && !isParent) {
      throw new Error('Unauthorized to view this profile');
    }

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

export default async function StudentSettings() {
  const currentUser = await getCurrentUserByRole();

  // ✅ Only allow students here
  if (currentUser.role !== 'STUDENT') {
    return (
      <div className="p-8 text-center text-red-600 font-semibold text-lg">
        Only students can access this page.
      </div>
    );
  }

  const student = await getStudentProfile(currentUser.studentId);

  if (!student) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold text-lg">
        Student profile not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2">
      <Card className="py-4 px-2 flex items-center justify-between">
        <div>
          <CardTitle className="text-lg">Settings</CardTitle>
          <CardDescription className="text-sm">
            Manage your account settings and preferences.
          </CardDescription>
        </div>
      </Card>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Profile</CardTitle>
              <CardDescription>
                Update your personal information and profile details.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-1">
              <StudentProfileEditForm student={student} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications about fees,
                announcements, and updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<NotificationSkeleton />}>
                {/* <NotificationSettings /> */}
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription>
                Update your emergency contact information for urgent situations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<EmergencyContactSkeleton />}>
                <Label>Emergency Contact </Label>
                <Input value={student.emergencyContact} readOnly disabled />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage your password and account security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<SecuritySkeleton />}>
                {/* <SecuritySettings /> */}
                <SidebarPreferences />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Skeleton components for loading states
function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-12" />
        </div>
      ))}
    </div>
  );
}

function DocumentSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmergencyContactSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

function FeeSettingsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
}
