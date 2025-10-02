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

        // For Exams
        LIVE: 'bg-green-700/10 text-green-800 border-green-700/20',
        UPCOMING: 'bg-yellow-600/10 text-yellow-700 border-yellow-600/20',
        OPEN: 'bg-blue-700/10 text-blue-800 border-blue-700/20',
        COMPLETED: 'bg-muted text-foreground/70 border-border',
        CANCELLED: 'bg-red-600/10 text-red-700 border-red-600/20',
        //  Student Exam Status

        pass: 'border-transparent bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer',
        failed:
          'border-transparent bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer',
        excellent:
          'border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer',
        outstanding:
          'border-transparent bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer',
        veryGood:
          'border-transparent bg-lime-100 text-lime-700 hover:bg-lime-200 cursor-pointer',
        good: 'border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-200 cursor-pointer',
        aboveAverage:
          'border-transparent bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer',
        average:
          'border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer',
        belowAverage:
          'border-transparent bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer',
        poor: 'border-transparent bg-pink-100 text-pink-700 hover:bg-pink-200 cursor-pointer',

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
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
