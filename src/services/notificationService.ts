import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Task } from '../types/types';
import { getTaskNotificationDate } from '../utils/notificationScheduling';

const NOTIFICATION_CHANNEL_ID = 'task-deadlines';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Requests local notification permission when needed.
 * Web is treated as unsupported because local notifications are only used on
 * native platforms in this app.
 *
 * @returns True when notifications can be scheduled.
 */
async function ensureNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const currentPermissions = await Notifications.getPermissionsAsync();
  const finalPermissions = currentPermissions.granted
    ? currentPermissions
    : await Notifications.requestPermissionsAsync();

  return finalPermissions.granted;
}

/**
 * Creates the Android notification channel used for deadline reminders.
 * iOS does not require channel configuration.
 */
async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
    name: 'Prazos de tarefas',
    importance: Notifications.AndroidImportance.HIGH,
  });
}

/**
 * Cancels a previously scheduled task notification.
 *
 * @param notificationId - Identifier returned by Expo when the reminder was scheduled.
 */
export async function cancelTaskNotification(notificationId?: string): Promise<void> {
  if (!notificationId || Platform.OS === 'web') return;

  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Schedules a local notification for a task due date.
 * Completed tasks, tasks without a future due date, and unsupported platforms
 * are ignored.
 *
 * @param task - Task that may receive a deadline reminder.
 * @returns The scheduled notification id, or undefined when nothing was scheduled.
 */
export async function scheduleTaskNotification(task: Task): Promise<string | undefined> {
  const notificationDate = getTaskNotificationDate(task.dueDate);

  if (!notificationDate || task.completed) {
    return undefined;
  }

  const hasPermission = await ensureNotificationPermissions();

  if (!hasPermission) {
    return undefined;
  }

  await ensureAndroidChannel();

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Prazo de tarefa',
      body: `Hoje vence: ${task.title}`,
      data: { taskId: task.id },
      sound: true,
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DATE,
      date: notificationDate,
      channelId: NOTIFICATION_CHANNEL_ID,
    },
  });
}

/**
 * Replaces the task's existing notification with one matching its current data.
 *
 * @param task - Task being edited.
 * @returns The task with its refreshed notification id.
 */
export async function rescheduleTaskNotification(task: Task): Promise<Task> {
  await cancelTaskNotification(task.notificationId);
  const notificationId = await scheduleTaskNotification(task);

  return {
    ...task,
    notificationId,
  };
}
