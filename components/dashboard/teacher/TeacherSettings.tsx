import ComingSoon from '@/components/Coming-soon';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  NotepadTextDashed,
  PersonStanding,
  Settings,
  WalletCards,
  ShieldPlus,
} from 'lucide-react';
import { TeacherProfileForm } from './TeacherProfileForm';
import prisma from '@/lib/db';
import { getCurrentUserId } from '@/lib/user';
import { EmptyState } from '@/components/EmptyState';

export async function getTeacher(userId: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { userId, isActive: true },
    select: {
      id: true,
      isActive: true,
      employmentStatus: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          profileImage: true,
        },
      },
      profile: {
        select: {
          dateOfBirth: true,
          contactEmail: true,
          contactPhone: true,
          address: true,
          qualification: true,
          experienceInYears: true,
          city: true,
          state: true,
          idProofUrl: true,
          linkedinPortfolio: true,
          languagesKnown: true,
          teachingPhilosophy: true,
          joinedAt: true,
          resumeUrl: true,
          specializedSubjects: true,
          preferredGrades: true,
          certificateUrls: true,
          bio: true,
        },
      },
    },
  });

  if (!teacher || !teacher.user || !teacher.profile) return null;

  return {
    id: teacher.id,
    firstName: teacher.user.firstName,
    middleName: '', // optional, adjust if needed
    lastName: teacher.user.lastName,
    profilePhoto: teacher.user.profileImage,
    contactEmail: teacher.user.email,
    contactPhone: teacher.profile.contactPhone,
    address: teacher.profile.address,
    city: teacher.profile.city || '',
    state: teacher.profile.state || '',
    dateOfBirth: teacher.profile.dateOfBirth,
    qualification: teacher.profile.qualification,
    experienceInYears: teacher.profile.experienceInYears,
    resumeUrl: teacher.profile.resumeUrl || '',
    specializedSubjects: teacher.profile.specializedSubjects,
    preferredGrades: teacher.profile.preferredGrades,
    bio: teacher.profile.bio || '',
    linkedinPortfolio: teacher.profile.linkedinPortfolio || '',
    languagesKnown: teacher.profile.languagesKnown,
    teachingPhilosophy: teacher.profile.teachingPhilosophy || '',
    certificateUrls: teacher.profile.certificateUrls.map((url, index) => ({
      title: `Certificate ${index + 1}`,
      url,
    })),
    idProofUrl: teacher.profile.idProofUrl,
  };
}

const TeacherSettings = async () => {
  const userId = await getCurrentUserId();

  const teacher = await getTeacher(userId);

  if (!teacher) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <EmptyState
          title="No Teacher Found"
          description=" You are not registered as a teacher or your profile is not created
          yet."
          icons={[PersonStanding, ShieldPlus, NotepadTextDashed]}
          action={{
            label: 'Go to Support',
            href: '/support',
          }}
        />
      </div>
    );
  }
  return (
    <div className="px-4 space-y-4">
      <Card className="px-4 py-3">
        <CardTitle className="text-lg">Teacher Settings</CardTitle>
        <CardDescription>
          Manage your profile and management settings
        </CardDescription>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-6 border rounded-lg">
          <div>
            <h2 className="text-lg font-semibold"> Teacher Profile</h2>
            <p className="text-sm text-muted-foreground">
              Configure your Teacher Profile
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <Settings className="h-4 w-4" />
                Profile Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader className="space-y-3">
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <WalletCards className="h-5 w-5" />
                  Profile Settings
                </DialogTitle>
                <DialogDescription>
                  Configure your Teacher Profile
                </DialogDescription>
              </DialogHeader>
              <TeacherProfileForm teacher={teacher} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center justify-between p-6 border rounded-lg">
          <div>
            <h2 className="text-lg font-semibold">
              {' '}
              Salary / Payout Information
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure your salary and payout information
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <Settings className="h-4 w-4" />
                Payout Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader className="space-y-3">
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <WalletCards className="h-5 w-5" />
                  Payout Settings
                </DialogTitle>
                <DialogDescription>
                  Configure your salary and payout information
                </DialogDescription>
              </DialogHeader>
              <ComingSoon />
            </DialogContent>
          </Dialog>
        </div>

        {/* Add more settings sections here */}
      </div>
    </div>
  );
};

export default TeacherSettings;
