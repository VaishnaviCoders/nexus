

// lib/notifications/utils.ts
/**
 * Replace {{variable}} in template with actual values
 * Example: "Hello {{name}}" + {name: "John"} = "Hello John"
 */
export function replaceTemplateVariables(
  template: string,
  variables: Record<string, any>
): string {
  let result = template;

  // Replace each variable
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    result = result.replaceAll(placeholder, String(value ?? ""));
  });

  // Remove any unreplaced variables
  result = result.replace(/{{[^}]+}}/g, "");

  return result;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Indian phone number (10 digits starting with 6-9)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Clean phone number (remove spaces, +91, etc.)
 */
export function sanitizePhone(phone: string): string {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, "");

  // Remove country code if present
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  }

  return cleaned;
}



/**
 * Calculate days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Generate unique receipt number
 */
export function generateReceiptNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `RCP${timestamp}${random}`;
}