import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        present:
          'border-transparent bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer',
        absent:
          'border-transparent bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer',
        late: 'border-transparent bg-yellow-100 text-yellow-600 hover:bg-yellow-200 cursor-pointer',
        PRESENT:
          'border-transparent bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer',
        ABSENT:
          'border-transparent bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer',
        LATE: 'border-transparent bg-yellow-100 text-yellow-600 hover:bg-yellow-200 cursor-pointer',

        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        meta: 'bg-blue-50 text-blue-700 border-blue-200  ',
        beta: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 border-yellow-500 hover:from-yellow-500 hover:to-yellow-700',
        premium:
          'bg-gradient-to-r from-purple-500 to-purple-700 text-white border-purple-600 hover:from-purple-600 hover:to-purple-800',
        free: 'bg-gradient-to-r from-green-400 to-green-600 text-white border-green-500 hover:from-green-500 hover:to-green-700',
        pending:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        verified:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',

        // Leave Status
        PENDING:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        APPROVED:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',

        // Fees
        PAID: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200',
        UNPAID:
          'bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200',
        OVERDUE: 'bg-red-50 text-red-700 hover:bg-red-50 border-red-200',

        // For Exams Status
        LIVE: 'bg-green-50 text-green-500 hover:bg-green-50 border-green-200',
        UPCOMING:
          'bg-yellow-50 text-yellow-500 hover:bg-yellow-50 border-yellow-200',
        OPEN: 'bg-blue-50 text-blue-500 hover:bg-blue-50 border-blue-200',
        COMPLETED: 'bg-muted text-foreground/70 border-border',
        CANCELLED: 'bg-red-50 text-red-500 hover:bg-red-50 border-red-200',

        // Exam Enrollment Status
        ENROLLED: 'bg-green-50 text-green-500 border-green-200',
        NOT_ENROLLED: 'bg-red-50 text-red-500 border-red-200',
        ATTENDED: 'bg-green-50 text-green-500 border-green-200',
        // ABSENT: 'bg-red-50 text-red-500 border-red-200',
        EXEMPT: 'bg-yellow-50 text-yellow-500 border-yellow-200',
        DISQUALIFIED: 'bg-red-50 text-red-500 border-red-200',

        HALL_TICKET_ISSUED: 'bg-green-50 text-green-500 border-green-200',
        HALL_TICKET_NOT_ISSUED: 'bg-red-50 text-red-500 border-red-200',
        //  Student Exam Status

        PASS: 'border-transparent bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer',
        FAILED:
          'border-transparent bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer',
        EXCELLENT:
          'border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer',
        OUTSTANDING:
          'border-transparent bg-indigo-100 text-indigo-700 hover:bg-indigo-200 cursor-pointer',
        VERY_GOOD:
          'border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer',
        GOOD: 'border-transparent bg-lime-100 text-lime-700 hover:bg-lime-200 cursor-pointer',
        ABOVE_AVERAGE:
          'border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-200 cursor-pointer',
        AVERAGE:
          'border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer',
        BELOW_AVERAGE:
          'border-transparent bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer',
        POOR: 'border-transparent bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer',

        // Notice Priority
        URGENT: 'bg-red-100 text-red-800 border-red-200',
        HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
        MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        LOW: 'bg-gray-100 text-gray-800 border-gray-200',

        // Notice Status
        DRAFT: 'bg-gray-100 text-gray-800',
        PENDING_REVIEW: 'bg-blue-100 text-blue-800',
        PUBLISHED: 'bg-green-100 text-green-800',
        EXPIRED: 'bg-red-100 text-red-800',
        ARCHIVED: 'bg-amber-100 text-amber-800',
        REJECTED:
          'border-transparent bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer',

        // Notice Types
        GENERAL:
          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
        TRIP: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
        EVENT:
          'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
        EXAM: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
        HOLIDAY:
          'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300',
        DEADLINE:
          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
        TIMETABLE:
          'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
        RESULT:
          'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',

        // Lead Status
        NEW: 'bg-blue-100 text-blue-800 border-blue-200',
        CONTACTED: 'bg-purple-100 text-purple-800 border-purple-200',
        QUALIFIED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        INTERESTED: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        VISIT_SCHEDULED: 'bg-orange-100 text-orange-800 border-orange-200',
        VISITED: 'bg-amber-100 text-amber-800 border-amber-200',
        PROPOSAL_SENT: 'bg-teal-100 text-teal-800 border-teal-200',
        NEGOTIATION: 'bg-violet-100 text-violet-800 border-violet-200',
        CONVERTED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        NOT_INTERESTED: 'bg-red-100 text-red-800 border-red-200',
        UNRESPONSIVE: 'bg-gray-100 text-gray-800 border-gray-200',
        INVALID: 'bg-slate-100 text-slate-800 border-slate-200',
        LOST: 'bg-rose-100 text-rose-800 border-rose-200',
        ON_HOLD: 'bg-yellow-100 text-yellow-800 border-yellow-200',

        // Lead Priority

        VIP: 'bg-purple-100 text-purple-800 border-purple-200',

        // Lead Source
        WEBSITE: 'bg-blue-100 text-blue-800 border-blue-200',
        GOOGLE_ADS: 'bg-red-100 text-red-800 border-red-200',
        FACEBOOK_ADS: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        INSTAGRAM_ADS: 'bg-pink-100 text-pink-800 border-pink-200',
        LINKEDIN_ADS: 'bg-sky-100 text-sky-800 border-sky-200',
        EMAIL_MARKETING: 'bg-teal-100 text-teal-800 border-teal-200',
        SEO_ORGANIC: 'bg-green-100 text-green-800 border-green-200',
        SOCIAL_MEDIA: 'bg-purple-100 text-purple-800 border-purple-200',
        WALK_IN: 'bg-amber-100 text-amber-800 border-amber-200',
        PHONE_CALL: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        REFERRAL_PROGRAM: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        EDUCATION_FAIR: 'bg-orange-100 text-orange-800 border-orange-200',
        PRINT_MEDIA: 'bg-stone-100 text-stone-800 border-stone-200',
        RADIO: 'bg-rose-100 text-rose-800 border-rose-200',
        OUTDOOR_ADVERTISING: 'bg-lime-100 text-lime-800 border-lime-200',
        AGENT_PARTNER: 'bg-violet-100 text-violet-800 border-violet-200',
        ALUMNI_REFERRAL: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
        WEBINAR: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        WORKSHOP: 'bg-amber-100 text-amber-800 border-amber-200',
        WORD_OF_MOUTH: 'bg-emerald-100 text-emerald-800 border-emerald-200',

        // Lead Activity Type
        CALL: 'bg-green-100 text-green-800 border-green-200',
        EMAIL: 'bg-blue-100 text-blue-800 border-blue-200',
        SMS: 'bg-purple-100 text-purple-800 border-purple-200',
        WHATSAPP: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        MEETING: 'bg-orange-100 text-orange-800 border-orange-200',
        VISIT: 'bg-amber-100 text-amber-800 border-amber-200',
        SCHOOL_TOUR: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        DEMO_CLASS: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        FOLLOW_UP: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        DOCUMENT_SENT: 'bg-teal-100 text-teal-800 border-teal-200',
        DOCUMENT_RECEIVED: 'bg-violet-100 text-violet-800 border-violet-200',
        APPLICATION_SUBMITTED:
          'bg-emerald-100 text-emerald-800 border-emerald-200',
        FEE_DISCUSSED: 'bg-lime-100 text-lime-800 border-lime-200',
        COUNSELING: 'bg-sky-100 text-sky-800 border-sky-200',
        PARENT_MEETING: 'bg-rose-100 text-rose-800 border-rose-200',
        STUDENT_INTERACTION: 'bg-pink-100 text-pink-800 border-pink-200',
        OTHER: 'bg-gray-100 text-gray-800 border-gray-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
