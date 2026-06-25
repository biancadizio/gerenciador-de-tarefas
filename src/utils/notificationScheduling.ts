export const NOTIFICATION_HOUR = 9;
export const NOTIFICATION_MINUTE = 0;

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
