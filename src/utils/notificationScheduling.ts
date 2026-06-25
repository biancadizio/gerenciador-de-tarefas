export const NOTIFICATION_HOUR = 9;
export const NOTIFICATION_MINUTE = 0;

/**
 * Calculates the local reminder time for a task deadline.
 * Notifications are scheduled for 09:00 on the due date and skipped for past
 * or invalid dates.
 *
 * @param dueDate - Task deadline stored as YYYY-MM-DD or an ISO-like string.
 * @param now - Current date used for comparison; injectable for tests.
 * @returns The notification date, or null when no notification should be scheduled.
 */
export function getTaskNotificationDate(dueDate?: string, now = new Date()): Date | null {
  if (!dueDate) return null;

  const [datePart] = dueDate.split('T');
  const [year, month, day] = datePart.split('-').map(Number);

  if (!year || !month || !day) return null;

  const notificationDate = new Date(year, month - 1, day, NOTIFICATION_HOUR, NOTIFICATION_MINUTE, 0);

  if (notificationDate.getTime() <= now.getTime()) {
    return null;
  }

  return notificationDate;
}
