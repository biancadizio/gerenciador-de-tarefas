import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/types';

const STORAGE_KEY = '@tasks';

export const storageService = {
  getTasks: async (): Promise<Task[] | null> => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  saveTasks: async (tasks: Task[]): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },
};
