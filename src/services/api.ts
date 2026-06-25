import axios from 'axios';
import { Task } from '../types/types';

const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';
const INITIAL_TASKS_ERROR = 'Não foi possível carregar as tarefas iniciais.';
const REMOTE_TASKS_ERROR = 'Não foi possível sincronizar as tarefas remotas.';

interface RemoteTask {
  id: number;
  title: string;
  completed: boolean;
}

/**
 * Builds the user-facing error message shown when an API request fails.
 *
 * @param error - Error thrown by fetch, axios, or another caller.
 * @param fallbackMessage - Base Portuguese message for the failing operation.
 * @returns A Portuguese message suitable for UI feedback.
 */
export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (axios.isAxiosError(error) || error instanceof Error) {
    return `${fallbackMessage} Verifique sua conexão e tente novamente.`;
  }

  return fallbackMessage;
}

/**
 * Adapter for remote task data.
 * Maps JSONPlaceholder responses into the local Task shape used by the app.
 */
export const apiService = {
  /**
   * Fetches the initial task list used when local storage is empty.
   *
   * @returns Remote tasks normalized with local default metadata.
   * @throws Error with a Portuguese message when the request fails.
   */
  fetchInitialTasks: async (): Promise<Task[]> => {
    try {
      const response = await fetch(`${BASE_URL}?_limit=5`);

      if (response.ok === false) {
        throw new Error(`Status ${response.status}`);
      }

      const data: RemoteTask[] = await response.json();
      return data.map(task => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
        priority: 'no-urgency' as const,
        type: 'others',
        dueDate: undefined,
        details: undefined,
        tags: [],
        notificationId: undefined,
        relatedTasks: undefined,
      }));
    } catch (error) {
      throw new Error(getApiErrorMessage(error, INITIAL_TASKS_ERROR));
    }
  },

  /**
   * Fetches remote task titles used by the sync hook.
   *
   * @returns Raw remote tasks from the API.
   * @throws Error with a Portuguese message when synchronization fails.
   */
  fetchRemoteTasks: async (): Promise<RemoteTask[]> => {
    try {
      const response = await axios.get<RemoteTask[]>(`${BASE_URL}?_limit=10`);
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, REMOTE_TASKS_ERROR));
    }
  },
};

// backward compatibility — hooks e testes já existentes importam isso diretamente
export const fetchInitialTasks = apiService.fetchInitialTasks;
