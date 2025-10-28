'use client';

import type React from 'react';
import { useState, useMemo } from 'react';
import {
  Phone,
  Mail,
  MessageSquare,
  Users,
  MapPin,
  BookOpen,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { cn, formatDateIN } from '@/lib/utils';
import { AddLeadActivityDialog } from './add-lead-activity-dialog';
import { WhatsAppIcon } from '@/public/icons/WhatsAppIcon';
import { ScrollArea } from '@/components/ui/scroll-area';

// Activity type to icon mapping
const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  CALL: <Phone className="h-5 w-5" />,
  EMAIL: <Mail className="h-5 w-5" />,
  SMS: <MessageSquare className="h-5 w-5" />,
  WHATSAPP: <WhatsAppIcon className="" />,
  MEETING: <Users className="h-5 w-5" />,
  VISIT: <MapPin className="h-5 w-5" />,
  SCHOOL_TOUR: <MapPin className="h-5 w-5" />,
  DEMO_CLASS: <BookOpen className="h-5 w-5" />,
  FOLLOW_UP: <Clock className="h-5 w-5" />,
  DOCUMENT_SENT: <FileText className="h-5 w-5" />,
  DOCUMENT_RECEIVED: <FileText className="h-5 w-5" />,
  APPLICATION_SUBMITTED: <CheckCircle2 className="h-5 w-5" />,
  FEE_DISCUSSED: <AlertCircle className="h-5 w-5" />,
  COUNSELING: <Users className="h-5 w-5" />,
  PARENT_MEETING: <Users className="h-5 w-5" />,
  STUDENT_INTERACTION: <BookOpen className="h-5 w-5" />,
  OTHER: <AlertCircle className="h-5 w-5" />,
};

// Activity type to color mapping
const ACTIVITY_COLORS: Record<string, string> = {
  CALL: 'bg-blue-50 text-blue-600 border-blue-200',
  EMAIL: 'bg-purple-50 text-purple-600 border-purple-200',
  SMS: 'bg-green-50 text-green-600 border-green-200',
  WHATSAPP: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  MEETING: 'bg-orange-50 text-orange-600 border-orange-200',
  VISIT: 'bg-red-50 text-red-600 border-red-200',
  SCHOOL_TOUR: 'bg-red-50 text-red-600 border-red-200',
  DEMO_CLASS: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  FOLLOW_UP: 'bg-amber-50 text-amber-600 border-amber-200',
  DOCUMENT_SENT: 'bg-slate-50 text-slate-600 border-slate-200',
  DOCUMENT_RECEIVED: 'bg-slate-50 text-slate-600 border-slate-200',
  APPLICATION_SUBMITTED: 'bg-teal-50 text-teal-600 border-teal-200',
  FEE_DISCUSSED: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  COUNSELING: 'bg-pink-50 text-pink-600 border-pink-200',
  PARENT_MEETING: 'bg-orange-50 text-orange-600 border-orange-200',
  STUDENT_INTERACTION: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  OTHER: 'bg-gray-50 text-gray-600 border-gray-200',
};

// Activity type labels
const ACTIVITY_LABELS: Record<string, string> = {
  CALL: 'Call',
  EMAIL: 'Email',
  SMS: 'SMS',
  WHATSAPP: 'WhatsApp',
  MEETING: 'Meeting',
  VISIT: 'Visit',
  SCHOOL_TOUR: 'School Tour',
  DEMO_CLASS: 'Demo Class',
  FOLLOW_UP: 'Follow Up',
  DOCUMENT_SENT: 'Document Sent',
  DOCUMENT_RECEIVED: 'Document Received',
  APPLICATION_SUBMITTED: 'Application Submitted',
  FEE_DISCUSSED: 'Fee Discussed',
  COUNSELING: 'Counseling',
  PARENT_MEETING: 'Parent Meeting',
  STUDENT_INTERACTION: 'Student Interaction',
  OTHER: 'Other',
};

interface LeadActivity {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  outcome?: string | null;
  performedAt: Date;
  followUpDate?: Date | null;
  followUpNote?: string | null;
  performedBy?: {
    firstName?: string;
    lastName?: string;
    profileImage?: string | null;
  } | null;
}

interface LeadActivityTimelineProps {
  activities: LeadActivity[];
  leadId: string;
  onActivityAdded?: () => void;
}

export function LeadActivityTimeline({
  activities,
  leadId,
  onActivityAdded,
}: LeadActivityTimelineProps) {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter and sort activities
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    if (filterType !== 'ALL') {
      filtered = filtered.filter((a) => a.type === filterType);
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.performedAt).getTime();
      const dateB = new Date(b.performedAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [activities, filterType, sortOrder]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(activities.map((a) => a.type)));
  }, [activities]);

  const getPerformedByName = (activity: LeadActivity) => {
    if (activity.performedBy?.firstName || activity.performedBy?.lastName) {
      return `${activity.performedBy.firstName || ''} ${activity.performedBy.lastName || ''}`.trim();
    }
    return 'Unknown';
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Activity Timeline
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track all interactions and communications
          </p>
        </div>
        <AddLeadActivityDialog
          leadId={leadId}
          onActivityAdded={onActivityAdded}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Activities</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {ACTIVITY_LABELS[type] || type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(value) =>
              setSortOrder(value as 'newest' | 'oldest')
            }
          >
            <SelectTrigger className="w-32 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="text-sm text-muted-foreground">
          {filteredActivities.length} of {activities.length} activities
        </span>
      </div>

      {/* Timeline */}
      {filteredActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">
            No activities yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Start by adding your first activity
          </p>
        </div>
      ) : (
        <div className="space-y-0 ">
          <ScrollArea className="space-y-1 h-[80vh]">
            {filteredActivities.map((activity, index) => {
              const isExpanded = expandedId === activity.id;
              const colorClass =
                ACTIVITY_COLORS[activity.type] || ACTIVITY_COLORS.OTHER;
              const icon =
                ACTIVITY_ICONS[activity.type] || ACTIVITY_ICONS.OTHER;
              const isLast = index === filteredActivities.length - 1;
              const performedByName = getPerformedByName(activity);

              return (
                <div
                  key={activity.id}
                  className="relative group hover:bg-gray-50 transition-colors duration-200 rounded-lg p-3"
                >
                  {/* Timeline line */}
                  {!isLast && (
                    <div className="absolute left-8 top-14 bottom-0 w-0.5 bg-gray-200 group-hover:bg-gray-300 transition-colors" />
                  )}

                  {/* Activity item */}
                  <div className="flex gap-4">
                    {/* Icon circle */}
                    <div
                      className={cn(
                        'relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 group-hover:scale-105 shadow-sm',
                        colorClass
                      )}
                    >
                      {icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-base leading-tight">
                                {activity.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'text-xs font-medium border-2',
                                    colorClass
                                  )}
                                >
                                  {ACTIVITY_LABELS[activity.type] ||
                                    activity.type}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <User className="h-3 w-3" />
                                  {performedByName}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          {activity.description && (
                            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                              {activity.description}
                            </p>
                          )}

                          {/* Outcome badge */}
                          {activity.outcome && (
                            <div className="mt-2">
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700 border-green-200 text-xs font-medium"
                              >
                                {activity.outcome}
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1 flex-shrink-0 sm:items-end">
                          <time className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                            {formatDateIN(activity.performedAt)}
                          </time>
                          <time className="text-xs text-gray-500 whitespace-nowrap">
                            {format(new Date(activity.performedAt), 'hh:mm a')}
                          </time>
                        </div>
                      </div>

                      {/* Follow-up info */}
                      {(activity.followUpDate || activity.followUpNote) && (
                        <div className="mt-3">
                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : activity.id)
                            }
                            className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium"
                          >
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              Follow-up:{' '}
                              {format(
                                new Date(activity.followUpDate!),
                                'MMM dd, yyyy'
                              )}
                            </span>
                            <ChevronDown
                              className={cn(
                                'h-3.5 w-3.5 transition-transform duration-200',
                                isExpanded && 'rotate-180'
                              )}
                            />
                          </button>

                          {/* Expanded follow-up details */}
                          {isExpanded && activity.followUpNote && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-xs font-semibold text-blue-900 mb-1">
                                Follow-up Note:
                              </p>
                              <p className="text-xs text-blue-800 leading-relaxed">
                                {activity.followUpNote}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
