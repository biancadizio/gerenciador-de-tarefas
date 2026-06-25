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

async function ensureNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const currentPermissions = await Notifications.getPermissionsAsync();
  const finalPermissions = currentPermissions.granted
    ? currentPermissions
    : await Notifications.requestPermissionsAsync();

  return finalPermissions.granted;
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
    name: 'Prazos de tarefas',
    importance: Notifications.AndroidImportance.HIGH,
  });
}

export async function cancelTaskNotification(notificationId?: string): Promise<void> {
  if (!notificationId || Platform.OS === 'web') return;

  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

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

export async function rescheduleTaskNotification(task: Task): Promise<Task> {
  await cancelTaskNotification(task.notificationId);
  const notificationId = await scheduleTaskNotification(task);

  return {
    ...task,
    notificationId,
  };
}
