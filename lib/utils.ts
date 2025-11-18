import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NotificationChannel } from '@/generated/prisma/enums';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function formatBytes(
  bytes: number | null,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  if (bytes === null || bytes === undefined) return 'N/A';

  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];

  if (bytes === 0) return '0 Byte';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytes')
      : (sizes[i] ?? 'Bytes')
  }`;
}

export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}

/**
 * Formats a date string to 'DD/MM/YYYY' in India timezone.
 * Returns '-' if the date is invalid.
 */

export function getISTDate() {
  const now = new Date();
  // Convert local time to IST (UTC +5:30)
  const istOffset = 5.5 * 60; // in minutes
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + istOffset * 60000);
}

export function formatDateIN(dateValue?: string | Date | null): string {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTimeIN(dateValue?: string | Date | null): string {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });
}
export function formatTimeIN(dateValue?: string | Date | null): string {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return '-';

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function getRelativeTime(dateValue?: string | Date | null): string {
  if (!dateValue) return '-';

  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return '-';

  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  // Show proper Indian date format instead of default
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
}

// Format number as INR currency (e.g., 1,23,456)
export function formatCurrencyIN(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number as INR currency (e.g., ₹1,23,456)
export function formatCurrencyINWithSymbol(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function timeUntil(target: Date) {
  const now = Date.now();
  const diff = new Date(target).getTime() - now;
  if (diff <= 0) return 'Starts soon';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function formatDateRange(start: Date, end: Date) {
  const s = new Date(start);
  const e = new Date(end);
  const sameDay = s.toDateString() === e.toDateString();
  const date = s.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const st = s.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  const et = e.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  return sameDay
    ? `${date} • ${st} – ${et}`
    : `${date} – ${e.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`;
}

/**
 * Cost mapping for each notification channel (INR per unit).
 */
const CHANNEL_COST_MAP: Record<NotificationChannel, number> = {
  EMAIL: 0.36, // ~₹0.5 – ₹1 per 100 emails via services like SES, SendGrid
  SMS: 0.9, // ₹0.15 – ₹0.25 typical bulk SMS rate (domestic transactional)
  WHATSAPP: 0.75, // ₹0.7 – ₹0.9 per template msg (Meta Business pricing in India)
  PUSH: 0.2, // Free (Firebase, OneSignal, or in-app push)
};

/**
 * Get the cost per message for a given notification channel.
 * @param channel - NotificationChannel enum value
 * @returns Cost per unit (float)
 */
export function getChannelUnitCost(channel: NotificationChannel): number {
  return CHANNEL_COST_MAP[channel];
}

/**
 * Calculate the total cost for a notification.
 * @param channel - NotificationChannel enum value
 * @param units - Number of messages sent (default = 1)
 * @returns Total cost, rounded to 2 decimals
 */
export function calculateNotificationCost(
  channel: NotificationChannel,
  units: number = 1
): number {
  const unitCost = getChannelUnitCost(channel);
  return parseFloat((unitCost * units).toFixed(2));
}

// Grading system utilities for flexible grade calculation

export interface GradeScale {
  id: string;
  name: string;
  grades: Grade[];
}

export interface Grade {
  label: string;
  minPercentage: number;
  maxPercentage: number;
  points?: number;
  description?: string;
}

// Predefined grading scales
export const GRADING_SCALES: GradeScale[] = [
  {
    id: 'standard',
    name: 'Standard (A-F)',
    grades: [
      { label: 'A+', minPercentage: 97, maxPercentage: 100, points: 4.0 },
      { label: 'A', minPercentage: 93, maxPercentage: 96.99, points: 4.0 },
      { label: 'A-', minPercentage: 90, maxPercentage: 92.99, points: 3.7 },
      { label: 'B+', minPercentage: 87, maxPercentage: 89.99, points: 3.3 },
      { label: 'B', minPercentage: 83, maxPercentage: 86.99, points: 3.0 },
      { label: 'B-', minPercentage: 80, maxPercentage: 82.99, points: 2.7 },
      { label: 'C+', minPercentage: 77, maxPercentage: 79.99, points: 2.3 },
      { label: 'C', minPercentage: 73, maxPercentage: 76.99, points: 2.0 },
      { label: 'C-', minPercentage: 70, maxPercentage: 72.99, points: 1.7 },
      { label: 'D+', minPercentage: 67, maxPercentage: 69.99, points: 1.3 },
      { label: 'D', minPercentage: 65, maxPercentage: 66.99, points: 1.0 },
      { label: 'F', minPercentage: 0, maxPercentage: 64.99, points: 0.0 },
    ],
  },
  {
    id: 'outstanding',
    name: 'Outstanding (O-E)',
    grades: [
      {
        label: 'O+',
        minPercentage: 95,
        maxPercentage: 100,
        description: 'Outstanding Plus',
      },
      {
        label: 'O',
        minPercentage: 90,
        maxPercentage: 94.99,
        description: 'Outstanding',
      },
      {
        label: 'A+',
        minPercentage: 85,
        maxPercentage: 89.99,
        description: 'Excellent Plus',
      },
      {
        label: 'A',
        minPercentage: 80,
        maxPercentage: 84.99,
        description: 'Excellent',
      },
      {
        label: 'B+',
        minPercentage: 75,
        maxPercentage: 79.99,
        description: 'Very Good Plus',
      },
      {
        label: 'B',
        minPercentage: 70,
        maxPercentage: 74.99,
        description: 'Very Good',
      },
      {
        label: 'C+',
        minPercentage: 65,
        maxPercentage: 69.99,
        description: 'Good Plus',
      },
      {
        label: 'C',
        minPercentage: 60,
        maxPercentage: 64.99,
        description: 'Good',
      },
      {
        label: 'D',
        minPercentage: 50,
        maxPercentage: 59.99,
        description: 'Satisfactory',
      },
      {
        label: 'E',
        minPercentage: 0,
        maxPercentage: 49.99,
        description: 'Needs Improvement',
      },
    ],
  },
  {
    id: 'cbse',
    name: 'CBSE (A1-E2)',
    grades: [
      { label: 'A1', minPercentage: 91, maxPercentage: 100, points: 10 },
      { label: 'A2', minPercentage: 81, maxPercentage: 90.99, points: 9 },
      { label: 'B1', minPercentage: 71, maxPercentage: 80.99, points: 8 },
      { label: 'B2', minPercentage: 61, maxPercentage: 70.99, points: 7 },
      { label: 'C1', minPercentage: 51, maxPercentage: 60.99, points: 6 },
      { label: 'C2', minPercentage: 41, maxPercentage: 50.99, points: 5 },
      { label: 'D', minPercentage: 33, maxPercentage: 40.99, points: 4 },
      { label: 'E1', minPercentage: 21, maxPercentage: 32.99, points: 0 },
      { label: 'E2', minPercentage: 0, maxPercentage: 20.99, points: 0 },
    ],
  },
  {
    id: 'simple',
    name: 'Simple (Pass/Fail)',
    grades: [
      { label: 'Pass', minPercentage: 33, maxPercentage: 100 },
      { label: 'Fail', minPercentage: 0, maxPercentage: 32.99 },
    ],
  },
];

export function calculateGrade(
  percentage: number,
  gradeScale: GradeScale
): Grade | null {
  if (percentage < 0 || percentage > 100) return null;

  return (
    gradeScale.grades.find(
      (grade) =>
        percentage >= grade.minPercentage && percentage <= grade.maxPercentage
    ) || null
  );
}

export function getGradeColorBadge(
  grade: Grade,
  isPassed: boolean,
  passingMarks: number
):
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'verified'
  | 'pending'
  | 'PASS'
  | 'FAILED'
  | 'EXCELLENT'
  | 'OUTSTANDING'
  | 'VERY_GOOD'
  | 'GOOD'
  | 'ABOVE_AVERAGE'
  | 'AVERAGE'
  | 'BELOW_AVERAGE'
  | 'POOR' {
  if (!isPassed) return 'FAILED';

  const percentage = (grade.minPercentage + grade.maxPercentage) / 2;

  // Use specific badge variants for better visual distinction
  if (percentage >= 90) return 'EXCELLENT'; // 90-100% - Emerald (best performance)
  if (percentage >= 80) return 'GOOD'; // 80-89% - Green (very good)
  if (percentage >= 70) return 'VERY_GOOD'; // 70-79% - Lime (good)
  if (percentage >= 60) return 'AVERAGE'; // 60-69% - Yellow (satisfactory)
  if (percentage >= 50) return 'ABOVE_AVERAGE'; // 50-59% - Orange (above average)
  if (percentage >= passingMarks) return 'PASS'; // Just passed - Light Green

  return 'POOR'; // Below passing marks - Red
}

export function isPassingGrade(
  percentage: number,
  passingPercentage = 33
): boolean {
  return percentage >= passingPercentage;
}
