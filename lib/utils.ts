import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NotificationChannel } from './generated/prisma';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

/**
 * Cost mapping for each notification channel (INR per unit).
 */
const CHANNEL_COST_MAP: Record<NotificationChannel, number> = {
  EMAIL: 0.05,
  SMS: 0.3,
  WHATSAPP: 0.5,
  PUSH: 0,
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
