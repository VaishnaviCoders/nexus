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
