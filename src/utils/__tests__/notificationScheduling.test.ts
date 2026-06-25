import {
  getTaskNotificationDate,
  NOTIFICATION_HOUR,
  NOTIFICATION_MINUTE,
} from '../notificationScheduling';

describe('notification scheduling', () => {
  it('schedules notifications on the due date at 09:00', () => {
    const now = new Date(2026, 5, 20, 10, 0, 0);
    const notificationDate = getTaskNotificationDate('2026-06-25', now);

    expect(notificationDate).toEqual(new Date(2026, 5, 25, NOTIFICATION_HOUR, NOTIFICATION_MINUTE, 0));
  });

  it('supports ISO due dates', () => {
    const now = new Date(2026, 5, 20, 10, 0, 0);
    const notificationDate = getTaskNotificationDate('2026-06-25T12:00:00.000Z', now);

    expect(notificationDate).toEqual(new Date(2026, 5, 25, 9, 0, 0));
  });

  it('does not schedule notifications for past dates', () => {
    const now = new Date(2026, 5, 25, 10, 0, 0);

    expect(getTaskNotificationDate('2026-06-25', now)).toBeNull();
  });

  it('does not schedule notifications without a valid due date', () => {
    expect(getTaskNotificationDate(undefined)).toBeNull();
    expect(getTaskNotificationDate('data-invalida')).toBeNull();
  });
});
