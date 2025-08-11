'use client';
import React, { useState } from 'react';
import { cn, formatCurrencyIN } from '@/lib/utils';
import {
  Users,
  GraduationCap,
  IndianRupee,
  Calendar,
  UserPlus,
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  Bell,
  CreditCard,
  BookOpen,
  UserCheck,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

interface ActivityItem {
  id: string;
  type:
    | 'student'
    | 'teacher'
    | 'fee'
    | 'attendance'
    | 'notice'
    | 'complaint'
    | 'document'
    | 'payment'
    | 'user'
    | 'system';
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  iconStyle: string;
  time: string;
  badge?: {
    text: string;
    variant: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'orange' | 'pink';
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  metadata?: {
    amount?: number;
    count?: number;
    status?: string;
    grade?: string;
    section?: string;
  };
}

const iconStyles = {
  student:
    'from-blue-500/20 to-blue-500/10 text-blue-600 dark:from-blue-400/20 dark:to-blue-400/10 dark:text-blue-400',
  teacher:
    'from-green-500/20 to-green-500/10 text-green-600 dark:from-green-400/20 dark:to-green-400/10 dark:text-green-400',
  fee: 'from-emerald-500/20 to-emerald-500/10 text-emerald-600 dark:from-emerald-400/20 dark:to-emerald-400/10 dark:text-emerald-400',
  attendance:
    'from-orange-500/20 to-orange-500/10 text-orange-600 dark:from-orange-400/20 dark:to-orange-400/10 dark:text-orange-400',
  notice:
    'from-purple-500/20 to-purple-500/10 text-purple-600 dark:from-purple-400/20 dark:to-purple-400/10 dark:text-purple-400',
  complaint:
    'from-red-500/20 to-red-500/10 text-red-600 dark:from-red-400/20 dark:to-red-400/10 dark:text-red-400',
  document:
    'from-indigo-500/20 to-indigo-500/10 text-indigo-600 dark:from-indigo-400/20 dark:to-indigo-400/10 dark:text-indigo-400',
  payment:
    'from-teal-500/20 to-teal-500/10 text-teal-600 dark:from-teal-400/20 dark:to-teal-400/10 dark:text-teal-400',
  user: 'from-pink-500/20 to-pink-500/10 text-pink-600 dark:from-pink-400/20 dark:to-pink-400/10 dark:text-pink-400',
  system:
    'from-gray-500/20 to-gray-500/10 text-gray-600 dark:from-gray-400/20 dark:to-gray-400/10 dark:text-gray-400',
};

const badgeVariants = {
  green:
    'bg-green-500/10 text-green-600 dark:bg-green-400/10 dark:text-green-300',
  blue: 'bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300',
  yellow:
    'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-400/10 dark:text-yellow-300',
  red: 'bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-300',
  purple:
    'bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-300',
  orange:
    'bg-orange-500/10 text-orange-600 dark:bg-orange-400/10 dark:text-orange-300',
  pink: 'bg-pink-500/10 text-pink-600 dark:bg-pink-400/10 dark:text-pink-300',
};

// Comprehensive activity data based on the schema
const SAMPLE_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'payment',
    title: 'Fee Payment Received',
    description: 'Arjun Sharma (Grade 10-A) paid ₹15,000 annual fee via UPI',
    icon: CreditCard,
    iconStyle: 'payment',
    time: '2 minutes ago',
    badge: { text: 'Paid', variant: 'green' },
    priority: 'medium',
    metadata: { amount: 15000, grade: '10', section: 'A' },
  },
  {
    id: '2',
    type: 'student',
    title: 'New Student Registration',
    description:
      'Priya Patel registered for Grade 9-B. Pending document verification.',
    icon: UserPlus,
    iconStyle: 'student',
    time: '5 minutes ago',
    badge: { text: 'New', variant: 'blue' },
    priority: 'high',
    metadata: { grade: '9', section: 'B' },
  },
  {
    id: '3',
    type: 'complaint',
    title: 'Anonymous Complaint Filed',
    description: 'New complaint about cafeteria hygiene (ID: #CM2024001)',
    icon: AlertTriangle,
    iconStyle: 'complaint',
    time: '12 minutes ago',
    badge: { text: 'Critical', variant: 'red' },
    priority: 'critical',
  },
  {
    id: '4',
    type: 'attendance',
    title: 'Attendance Alert',
    description: 'Grade 8-C has only 65% attendance today. 12 students absent.',
    icon: UserCheck,
    iconStyle: 'attendance',
    time: '25 minutes ago',
    badge: { text: 'Low', variant: 'orange' },
    priority: 'high',
    metadata: { count: 12, grade: '8', section: 'C' },
  },
  {
    id: '5',
    type: 'teacher',
    title: 'Teacher Profile Updated',
    description:
      'Ms. Sunita Verma updated qualification details and added Mathematics subject',
    icon: GraduationCap,
    iconStyle: 'teacher',
    time: '35 minutes ago',
    badge: { text: 'Updated', variant: 'blue' },
    priority: 'low',
  },
  {
    id: '6',
    type: 'document',
    title: 'Document Verification',
    description: '3 student documents verified by admin. 2 pending approval.',
    icon: FileText,
    iconStyle: 'document',
    time: '45 minutes ago',
    badge: { text: 'Verified', variant: 'green' },
    priority: 'medium',
    metadata: { count: 3 },
  },
  {
    id: '7',
    type: 'notice',
    title: 'Notice Published',
    description:
      'Annual Sports Day notice sent to all parents via email and WhatsApp',
    icon: Bell,
    iconStyle: 'notice',
    time: '1 hour ago',
    badge: { text: 'Published', variant: 'purple' },
    priority: 'medium',
  },
  {
    id: '8',
    type: 'fee',
    title: 'Fee Overdue Alert',
    description:
      '15 students have overdue fees totaling ₹2,45,000. Auto-reminders sent.',
    icon: IndianRupee,
    iconStyle: 'fee',
    time: '1 hour ago',
    badge: { text: 'Overdue', variant: 'red' },
    priority: 'high',
    metadata: { amount: 245000, count: 15 },
  },
  {
    id: '9',
    type: 'user',
    title: 'Parent Account Created',
    description:
      'Mr. Raj Kumar created account and linked to student Amit Kumar (Grade 7-A)',
    icon: Users,
    iconStyle: 'user',
    time: '2 hours ago',
    badge: { text: 'Linked', variant: 'green' },
    priority: 'low',
    metadata: { grade: '7', section: 'A' },
  },
  {
    id: '10',
    type: 'system',
    title: 'Academic Calendar Updated',
    description:
      'Diwali break added from Oct 30 - Nov 3. Students and parents notified.',
    icon: Calendar,
    iconStyle: 'system',
    time: '3 hours ago',
    badge: { text: 'Updated', variant: 'blue' },
    priority: 'medium',
  },
  {
    id: '11',
    type: 'payment',
    title: 'Bulk Payment Processing',
    description:
      '8 fee payments processed successfully. Total amount: ₹1,20,000',
    icon: TrendingUp,
    iconStyle: 'payment',
    time: '4 hours ago',
    badge: { text: 'Bulk', variant: 'green' },
    priority: 'medium',
    metadata: { amount: 120000, count: 8 },
  },
  {
    id: '12',
    type: 'complaint',
    title: 'Complaint Resolved',
    description:
      'Bus timing complaint (#CM2024002) marked as resolved by transport admin',
    icon: CheckCircle,
    iconStyle: 'complaint',
    time: '5 hours ago',
    badge: { text: 'Resolved', variant: 'green' },
    priority: 'low',
  },
];

const filterTypes = [
  { id: 'all', label: 'All Activities', icon: Activity },
  { id: 'student', label: 'Students', icon: Users },
  { id: 'teacher', label: 'Teachers', icon: GraduationCap },
  { id: 'payment', label: 'Payments', icon: CreditCard },
  { id: 'fee', label: 'Fees', icon: IndianRupee },
  { id: 'attendance', label: 'Attendance', icon: UserCheck },
  { id: 'complaint', label: 'Complaints', icon: AlertTriangle },
  { id: 'notice', label: 'Notices', icon: Bell },
  { id: 'document', label: 'Documents', icon: FileText },
];

const priorityColors = {
  low: 'border-l-gray-400',
  medium: 'border-l-blue-400',
  high: 'border-l-orange-400',
  critical: 'border-l-red-500',
};

export default function AdminRecentActivity() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activities] = useState(SAMPLE_ACTIVITIES);

  const filteredActivities =
    selectedFilter === 'all'
      ? activities
      : activities.filter((activity) => activity.type === selectedFilter);

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold ">Recent Activity</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Monitor all organizational activities in real-time
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-xl rounded-2xl px-4 py-2 border border-white/20 dark:border-zinc-700/50">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Today
            </div>
            <div className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {
                activities.filter(
                  (a) => a.time.includes('minutes') || a.time.includes('hour')
                ).length
              }
            </div>
          </div>
          <div className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-xl rounded-2xl px-4 py-2 border border-white/20 dark:border-zinc-700/50">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Critical
            </div>
            <div className="text-xl font-semibold text-red-600 dark:text-red-400">
              {activities.filter((a) => a.priority === 'critical').length}
            </div>
          </div>
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="relative">
        {/* Filter Tabs Container */}
        <div className="flex gap-3 p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-blue-500/30 scrollbar-track-transparent md:gap-4 md:p-3 snap-x snap-mandatory">
          {filterTypes.map((filter) => {
            const Icon = filter.icon;
            const isActive = selectedFilter === filter.id;
            const count =
              filter.id === 'all'
                ? activities.length
                : activities.filter((a) => a.type === filter.id).length;

            return (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-300 snap-center min-w-[100px] sm:min-w-[120px]',
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/70'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{filter.label}</span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-semibold',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gradient fade effect for scroll indication */}
        <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white/80 dark:from-zinc-900/80 to-transparent pointer-events-none" />
      </div>
      {/* Activity List */}

      <CardContent className="">
        <ScrollArea className="h-80 ">
          <div
            className={cn(
              'bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl',
              'rounded-3xl border border-white/20 dark:border-zinc-800/50',
              'shadow-sm overflow-hidden '
            )}
          >
            <div className="divide-y divide-white/10 dark:divide-zinc-800/50 ">
              {filteredActivities.map((activity) => {
                const Icon = activity.icon;

                return (
                  <div
                    key={activity.id}
                    className={cn(
                      'group relative flex items-start gap-4 p-6 ',
                      'hover:bg-white/80 dark:hover:bg-zinc-800/50',
                      'transition-all duration-300 ease-out',
                      'border-l-4',
                      priorityColors[activity.priority]
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        'shrink-0 p-3 rounded-2xl',
                        'bg-gradient-to-br',
                        iconStyles[
                          activity.iconStyle as keyof typeof iconStyles
                        ],
                        'shadow-sm border border-white/10 dark:border-zinc-700/50',
                        'transition-all duration-300 group-hover:scale-105'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                              {activity.title}
                            </h3>
                            {activity.badge && (
                              <span
                                className={cn(
                                  'px-2.5 py-0.5 rounded-full text-xs font-medium',
                                  'transition-colors duration-300 shadow-sm',
                                  badgeVariants[
                                    activity.badge
                                      .variant as keyof typeof badgeVariants
                                  ]
                                )}
                              >
                                {activity.badge.text}
                              </span>
                            )}
                          </div>

                          <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mb-2">
                            {activity.description}
                          </p>

                          {/* Metadata */}
                          {activity.metadata && (
                            <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                              {activity.metadata.amount && (
                                <span className="flex items-center gap-1">
                                  {formatCurrencyIN(activity.metadata.amount)}
                                </span>
                              )}
                              {activity.metadata.count && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {activity.metadata.count}{' '}
                                  {activity.metadata.count === 1
                                    ? 'item'
                                    : 'items'}
                                </span>
                              )}
                              {activity.metadata.grade &&
                                activity.metadata.section && (
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    Grade {activity.metadata.grade}-
                                    {activity.metadata.section}
                                  </span>
                                )}
                            </div>
                          )}
                        </div>

                        {/* Time */}
                        <div className="text-right shrink-0 hidden sm:block">
                          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredActivities.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  No activities found
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  No recent activities match your current filter selection.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Load More
        {filteredActivities.length > 0 && (
          <div className="text-center">
            <button className="px-6 py-3 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-white/80 dark:hover:bg-zinc-700/50 transition-all duration-300">
              Load More Activities
            </button>
          </div>
        )} */}
    </Card>
  );
}
