import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

/**
 * Format date for display
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'dd MMM yyyy');
}

/**
 * Format date with time
 */
export function formatDateTime(dateStr) {
  return format(new Date(dateStr), 'dd MMM yyyy, hh:mm a');
}

/**
 * Relative time
 */
export function formatRelativeTime(dateStr) {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

/**
 * Format for input date field (yyyy-MM-dd)
 */
export function formatInputDate(dateStr) {
  return format(new Date(dateStr || new Date()), 'yyyy-MM-dd');
}

/**
 * Get month name
 */
export function getMonthName(month) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month - 1] || '';
}
