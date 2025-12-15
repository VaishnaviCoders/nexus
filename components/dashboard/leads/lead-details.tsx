'use client';

import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Phone,
  Mail,
  MessageCircle,
  User,
  Edit2,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  School,
  Calendar,
  MessageSquare,
  Loader2,
  UserCircle,
  IndianRupee,
  CalendarClock,
  Activity,
  Globe,
} from 'lucide-react';
import { Prisma } from '@/generated/prisma/client';
import { formatDateIN } from '@/lib/utils';
import { LeadActivityTimeline } from './lead-activity-timeline';
import { AssignLeadDialog } from './assign-lead-dialog';
import { convertLead } from '@/lib/data/leads/convert-lead';
import { deleteLead } from '@/lib/data/leads/delete-lead';
import { toast } from 'sonner';
import Link from 'next/link';

type LeadWithActivities = Prisma.LeadGetPayload<{
  include: {
    createdBy: {
      select: {
        firstName: true;
        lastName: true;
        profileImage: true;
      };
    };
    assignedTo: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        profileImage: true;
      };
    };
    activities: {
      include: {
        performedBy: {
          select: {
            firstName: true;
            lastName: true;
            profileImage: true;
          };
        };
      };
    };
  };
}>;

interface LeadDetailProps {
  lead: LeadWithActivities;
}

export default function LeadDetails({ lead }: LeadDetailProps) {
  const [notes, setNotes] = useState(lead.notes);
  const [notesChanged, setNotesChanged] = useState(false);
  const [isConverting, startConvertTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setNotesChanged(true);
  };

  const handleConvertLead = async (leadId: string) => {
    startConvertTransition(async () => {
      try {
        const result = await convertLead(leadId);

        if (result.success) {
          toast.success('Lead converted to student successfully.');
        } else {
          toast.error(
            result.message || 'Failed to convert lead. Please try again.'
          );
        }
      } catch (error) {
        toast.error('Failed to convert lead. Please try again.');
      }
    });
  };

  const handleDeleteLead = async (leadId: string) => {
    startDeleteTransition(async () => {
      try {
        const result = await deleteLead(leadId);

        if (result.success) {
          toast.success('Lead deleted successfully.');
          window.location.href = '/dashboard/leads';
        } else {
          toast.error(
            result.message || 'Failed to delete lead. Please try again.'
          );
        }
      } catch (error) {
        toast.error('Failed to delete lead. Please try again.');
      }
    });
  };

  const isOverdue = lead.nextFollowUpAt && new Date() > lead.nextFollowUpAt;

  return (
    <div className="space-y-6 px-2 my-4">
      {/* Header Section - Modern Design */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900 truncate">
                  {lead.studentName}
                </h1>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant={lead.status}>{lead.status}</Badge>
                  <Badge variant={lead.priority}>{lead.priority}</Badge>
                </div>
              </div>
              <p className="text-gray-600 mb-4">Parent: {lead.parentName}</p>

              {/* Contact Info Row */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{lead.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageCircle className="w-4 h-4" />
                  <span>{lead.whatsappNumber}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap lg:flex-nowrap">
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link href={`/dashboard/leads/${lead.id}/edit`} prefetch={true}>
                <Edit2 className="w-4 h-4" />
                Edit
              </Link>
            </Button>
            {lead.status === 'CONVERTED' ? (
              <Button
                size="sm"
                disabled
                className="gap-2 bg-green-100 hover:bg-green-200 text-green-500"
              >
                <CheckCircle className="w-4 h-4" />
                Converted
              </Button>
            ) : (
              <Button
                size="sm"
                className="gap-2 bg-green-100 hover:bg-green-200 text-green-500"
                onClick={() => handleConvertLead(lead.id)}
                disabled={isConverting}
              >
                {isConverting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {isConverting ? 'Converting...' : 'Convert To Student'}
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={() => handleDeleteLead(lead.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {/* Lead Score Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-700 mb-2 uppercase tracking-wide">
                    Lead Score
                  </p>
                  <p className="text-2xl font-bold text-blue-900 mb-3">
                    {lead.score}/100
                  </p>
                  <div className="w-full bg-blue-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${lead.score}%` }}
                    />
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 ml-4 border-blue-200 border">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Follow-ups Card */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-700 mb-2 uppercase tracking-wide">
                    Follow-ups
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {lead.followUpCount}
                  </p>
                  <p className="text-xs text-green-600 mt-1 font-medium">
                    Total interactions
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 ml-4 border-green-200 border">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Contact Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-purple-700 mb-2 uppercase tracking-wide">
                    Last Contact
                  </p>
                  <p className="text-lg font-bold text-purple-900 leading-tight">
                    {formatDateIN(lead.lastContactedAt)}
                  </p>
                  <p className="text-xs text-purple-600 mt-1 font-medium">
                    Recent activity
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 ml-4 border-purple-200 border">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Follow-up Card */}
          <Card
            className={`bg-gradient-to-br ${isOverdue
              ? 'from-red-50 to-orange-50 border-red-200'
              : 'from-orange-50 to-amber-50 border-orange-200'
              } shadow-sm hover:shadow-md transition-shadow`}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-semibold text-orange-700 uppercase tracking-wide">
                      Next Follow-up
                    </p>
                    {isOverdue && (
                      <span className="bg-red-50 text-red-500 border-red-200 border text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                        URGENT
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-lg font-bold leading-tight ${isOverdue ? 'text-red-900' : 'text-orange-900'
                      }`}
                  >
                    {formatDateIN(lead.nextFollowUpAt)}
                  </p>
                  <p
                    className={`text-xs mt-1 font-medium ${isOverdue ? 'text-red-600' : 'text-orange-600'
                      }`}
                  >
                    {isOverdue ? 'Action required' : 'Scheduled'}
                  </p>
                </div>
                <div
                  className={`rounded-xl p-3 ml-4 ${isOverdue ? 'bg-red-50' : 'bg-orange-50'
                    } border-red-200 border`}
                >
                  {isOverdue ? (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  ) : (
                    <Calendar className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="xl:col-span-8 space-y-6">
          {/* Enquiry Details */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Enquiry Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Enquiry For
                  </Label>
                  <p className="text-base font-semibold text-gray-900">
                    {lead.enquiryFor}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Current School
                  </Label>
                  <p className="text-base font-semibold text-gray-900">
                    {lead.currentSchool}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Requirements
                </Label>
                <div className="flex flex-wrap gap-2">
                  {lead.requirements.map((req) => (
                    <Badge
                      key={req}
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 px-3 py-1.5 text-sm"
                    >
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-y-5 md:grid-cols-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Budget Range
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="bg-pink-100 rounded-lg p-2">
                      <IndianRupee className="w-5 h-5 text-pink-600" />
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {lead.budgetRange}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Source
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 rounded-lg p-2">
                      <Globe className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {lead.source
                        ?.replace(/[-_]/g, ' ')
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Created Date
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 rounded-lg p-2">
                      <CalendarClock className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {formatDateIN(lead.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Total Follow-ups
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 rounded-lg p-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {lead.followUpCount} interactions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Section */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <CardTitle className="text-lg">Address</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Street Address
                  </Label>
                  <p className="text-base font-medium text-gray-900">
                    {lead.address}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      City
                    </Label>
                    <p className="text-base font-medium text-gray-900">
                      {lead.city}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      State
                    </Label>
                    <p className="text-base font-medium text-gray-900">
                      {lead.state}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Pincode
                    </Label>
                    <p className="text-base font-medium text-gray-900">
                      {lead.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Notes</CardTitle>
              <CardDescription>Private notes about this lead</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Textarea
                  value={notes || ''}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Add your notes here..."
                  rows={6}
                  className="resize-none"
                />
                {notesChanged && (
                  <div className="flex items-center gap-2 text-xs text-orange-600 font-medium">
                    <Clock className="w-3 h-3" />
                    Unsaved changes
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="xl:col-span-4 space-y-6">
          {/* Assignment Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Assignment</CardTitle>
              <CardDescription>
                Assign this lead to a team member
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Currently Assigned To
                </Label>
                {lead.assignedTo ? (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <Avatar className="w-12 h-12 ring-2 ring-white">
                      <AvatarImage src={lead.assignedTo.profileImage || ''} />
                      <AvatarFallback className="bg-blue-500 text-white font-semibold text-sm">
                        {lead.assignedTo.firstName.charAt(0)}
                        {lead.assignedTo.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900">
                        {lead.assignedTo.firstName} {lead.assignedTo.lastName}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Assigned {formatDateIN(lead.assignedAt)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-xl bg-gray-50">
                    <UserCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">Not assigned</p>
                  </div>
                )}
              </div>

              <AssignLeadDialog
                leadId={lead.id}
                currentAssignedTo={lead.assignedTo}
                onAssignmentChange={() => { }}
              />
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <LeadActivityTimeline
                activities={lead.activities}
                leadId={lead.id}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
