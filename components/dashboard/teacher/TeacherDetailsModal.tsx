'use client';

import type React from 'react';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  FileText,
  Languages,
  BookOpen,
  Users,
  Download,
  ExternalLink,
  Clock,
  Building,
  Award,
  X,
  Briefcase,
  Globe,
  Heart,
  LucideIcon,
} from 'lucide-react';
import { SelectedTeacher } from './TeachersTable';
import { EmploymentStatus } from '@/generated/prisma';

interface TeacherDetailsModalProps {
  teacher: SelectedTeacher;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (teacherId: string) => void;
  onDeactivate?: (teacherId: string) => void;
  onActivate?: (teacherId: string) => void;
}

const getStatusConfig = (status: EmploymentStatus, isActive: boolean) => {
  if (!isActive) {
    return {
      color: 'bg-red-50 text-red-700 border-red-200',
      dot: 'bg-red-500',
      label: 'Inactive',
    };
  }

  switch (status) {
    case 'ACTIVE':
      return {
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Active',
      };
    case 'ON_LEAVE':
      return {
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        label: 'On Leave',
      };
    case 'PROBATION':
      return {
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        label: 'Probation',
      };
    case 'CONTRACTUAL':
      return {
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        dot: 'bg-purple-500',
        label: 'Contractual',
      };
    case 'SUSPENDED':
      return {
        color: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500',
        label: 'Suspended',
      };
    default:
      return {
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        dot: 'bg-gray-500',
        label: status
          .replace('_', ' ')
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase()),
      };
  }
};

const InfoCard = ({
  icon: Icon,
  title,
  children,
  className = '',
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6  transition-all hover:shadow-sm hover:border-gray-300 ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative">
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
          <Icon className="h-5 w-5 text-gray-600" />
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  </div>
);

const DataPoint = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number | null | undefined;
  icon?: LucideIcon;
}) => (
  <div className="flex items-start space-x-3 py-0">
    {Icon && (
      <div className="flex h-5 w-5 items-center justify-center mt-0.5">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-sm text-gray-900 font-medium mt-0.5">
        {value || 'Not specified'}
      </p>
    </div>
  </div>
);

export function TeacherDetailsModal({
  teacher,
  isOpen,
  onClose,
  onEdit,
  onDeactivate,
  onActivate,
}: TeacherDetailsModalProps) {
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);

  if (!teacher) return null;

  const { user, profile } = teacher;
  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  const statusConfig = getStatusConfig(
    teacher.employmentStatus,
    teacher.isActive
  );

  const handleDeactivate = () => {
    onDeactivate?.(teacher.id);
    setShowDeactivateDialog(false);
    onClose();
  };

  const handleActivate = () => {
    onActivate?.(teacher.id);
    setShowActivateDialog(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogHeader>
          <DialogTitle>Teacher Details</DialogTitle>
        </DialogHeader>
        <DialogContent className="max-w-6xl max-h-[95vh] flex flex-col p-0 gap-0 min-h-0">
          {/* Header */}
          <div className="flex items-start space-x-6 p-5">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                <AvatarImage
                  src={user.profileImage || '/placeholder.svg'}
                  alt={fullName}
                />
                <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-white ${statusConfig.dot}`}
              />
            </div>
            <div className="space-y-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                <p className="text-lg text-gray-600 font-medium">
                  {profile?.qualification || 'Teacher'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge
                  className={`${statusConfig.color} border font-medium px-3 py-1`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-2`}
                  />
                  {statusConfig.label}
                </Badge>
                {teacher.employeeCode && (
                  <Badge
                    variant="outline"
                    className="font-mono bg-gray-50 border-gray-300"
                  >
                    ID: {teacher.employeeCode}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="bg-blue-50 border-blue-200 text-blue-700"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {profile?.experienceInYears || 0} years exp.
                </Badge>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Contact
                </TabsTrigger>
                <TabsTrigger
                  value="professional"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Professional
                </TabsTrigger>
                <TabsTrigger
                  value="teaching"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Teaching
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <ScrollArea className="flex-1 ">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <InfoCard
                      icon={User}
                      title="Personal Information"
                      className="lg:col-span-2"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DataPoint
                          label="Full Name"
                          value={fullName}
                          icon={User}
                        />
                        <DataPoint
                          label="Email Address"
                          value={user.email}
                          icon={Mail}
                        />
                        <DataPoint
                          label="Employee ID"
                          value={teacher.employeeCode}
                          icon={Building}
                        />
                        <DataPoint
                          label="Role"
                          value={user.role
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                          icon={Briefcase}
                        />
                      </div>
                    </InfoCard>

                    <InfoCard icon={Calendar} title="Important Dates">
                      <div className="space-y-4">
                        {profile?.dateOfBirth && (
                          <DataPoint
                            label="Date of Birth"
                            value={format(
                              new Date(profile.dateOfBirth),
                              'MMM dd, yyyy'
                            )}
                            icon={Calendar}
                          />
                        )}
                        {profile?.joinedAt && (
                          <DataPoint
                            label="Joined Date"
                            value={format(
                              new Date(profile.joinedAt),
                              'MMM dd, yyyy'
                            )}
                            icon={Calendar}
                          />
                        )}
                        <DataPoint
                          label="Account Created"
                          value={format(
                            new Date(teacher.createdAt),
                            'MMM dd, yyyy'
                          )}
                          icon={Calendar}
                        />
                      </div>
                    </InfoCard>
                  </div>

                  {profile?.bio && (
                    <InfoCard icon={FileText} title="Biography">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {profile.bio}
                        </p>
                      </div>
                    </InfoCard>
                  )}

                  {profile?.teachingPhilosophy && (
                    <InfoCard icon={Heart} title="Teaching Philosophy">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {profile.teachingPhilosophy}
                        </p>
                      </div>
                    </InfoCard>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="contact" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <InfoCard icon={Mail} title="Email & Communication">
                    <div className="space-y-4">
                      <DataPoint
                        label="Primary Email"
                        value={user.email}
                        icon={Mail}
                      />
                      {profile?.contactEmail &&
                        profile.contactEmail !== user.email && (
                          <DataPoint
                            label="Contact Email"
                            value={profile.contactEmail}
                            icon={Mail}
                          />
                        )}
                      {profile?.contactPhone && (
                        <DataPoint
                          label="Phone Number"
                          value={profile.contactPhone}
                          icon={Phone}
                        />
                      )}
                      {profile?.linkedinPortfolio && (
                        <div className="pt-2">
                          <a
                            href={profile.linkedinPortfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            View LinkedIn Profile
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      )}
                    </div>
                  </InfoCard>

                  <InfoCard icon={MapPin} title="Address Information">
                    <div className="space-y-4">
                      {profile?.address && (
                        <>
                          <DataPoint
                            label="Street Address"
                            value={profile.address}
                            icon={MapPin}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <DataPoint label="City" value={profile.city} />
                            <DataPoint label="State" value={profile.state} />
                          </div>
                        </>
                      )}
                    </div>
                  </InfoCard>
                </div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <InfoCard icon={GraduationCap} title="Education & Experience">
                    <div className="space-y-4">
                      <DataPoint
                        label="Highest Qualification"
                        value={profile?.qualification}
                        icon={GraduationCap}
                      />
                      <DataPoint
                        label="Teaching Experience"
                        value={
                          profile?.experienceInYears
                            ? `${profile.experienceInYears} years`
                            : undefined
                        }
                        icon={Award}
                      />
                      {profile?.resumeUrl && (
                        <div className="pt-2">
                          <a
                            href={profile.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Resume
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      )}
                    </div>
                  </InfoCard>

                  <InfoCard icon={Languages} title="Languages & Skills">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-3">
                          Languages Known
                        </p>
                        {profile?.languagesKnown &&
                        profile.languagesKnown.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {profile.languagesKnown.map((language) => (
                              <Badge
                                key={language}
                                variant="secondary"
                                className="bg-blue-50 text-blue-700 border-blue-200"
                              >
                                {language}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No languages specified
                          </p>
                        )}
                      </div>
                    </div>
                  </InfoCard>
                </div>
              </TabsContent>

              <TabsContent value="teaching" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <InfoCard icon={BookOpen} title="Subject Expertise">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-3">
                        Specialized Subjects
                      </p>
                      {profile?.specializedSubjects &&
                      profile.specializedSubjects.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.specializedSubjects.map((subject) => (
                            <Badge
                              key={subject}
                              className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            >
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No subjects specified
                        </p>
                      )}
                    </div>
                  </InfoCard>

                  <InfoCard icon={Users} title="Grade Preferences">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-3">
                        Preferred Teaching Grades
                      </p>
                      {profile?.preferredGrades &&
                      profile.preferredGrades.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.preferredGrades.map((grade) => (
                            <Badge
                              key={grade}
                              variant="outline"
                              className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                            >
                              {grade}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No grade preferences specified
                        </p>
                      )}
                    </div>
                  </InfoCard>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={showDeactivateDialog}
        onOpenChange={setShowDeactivateDialog}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-900">
              Deactivate Teacher Account
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to deactivate <strong>{fullName}</strong>?
              This will prevent them from accessing the system, but their data
              will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Deactivate Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showActivateDialog}
        onOpenChange={setShowActivateDialog}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-green-900">
              Activate Teacher Account
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to activate <strong>{fullName}</strong>?
              This will restore their access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActivate}
              className="bg-green-600 hover:bg-green-700 focus:ring-green-600"
            >
              Activate Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
