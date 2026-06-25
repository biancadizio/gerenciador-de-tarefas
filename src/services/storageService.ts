import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/types';

const STORAGE_KEY = '@tasks';

/**
 * Persistence adapter for the task list.
 * Keeps AsyncStorage access in one place so hooks do not depend directly on
 * storage details.
 */
export const storageService = {
  /**
   * Loads tasks saved on the device.
   *
   * @returns The persisted task array, or null when storage is empty.
   */
  getTasks: async (): Promise<Task[] | null> => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  /**
   * Persists the complete task list on the device.
   *
   * @param tasks - Current task list to serialize.
   */
  saveTasks: async (tasks: Task[]): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },
};
