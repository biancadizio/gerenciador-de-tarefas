import axios from 'axios';
import { Task } from '../types/types';

// Load BASE_URL from environment when available (e.g. via .env or CI),
// fall back to a safe default for local/dev if not provided.
const FALLBACK_BASE_URL = 'https://jsonplaceholder.typicode.com/todos';
const BASE_URL = (() => {
  try {
    // Prefer process.env if available (Node/Jest, some RN env plugins)
    if (typeof process !== 'undefined' && process.env && process.env.BASE_URL) {
      return process.env.BASE_URL as string;
    }

    // Allow overriding via a global variable for environments that inject it
    // (keeps backwards compatibility for simple test setups).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof global !== 'undefined' && (global as any).BASE_URL) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (global as any).BASE_URL as string;
    }
  } catch (e) {
    // ignore and fallback
  }

  return FALLBACK_BASE_URL;
})();
const INITIAL_TASKS_ERROR = 'Não foi possível carregar as tarefas iniciais.';
const REMOTE_TASKS_ERROR = 'Não foi possível sincronizar as tarefas remotas.';

interface RemoteTask {
  id: number;
  title: string;
  completed: boolean;
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (axios.isAxiosError(error) || error instanceof Error) {
    return `${fallbackMessage} Verifique sua conexão e tente novamente.`;
  }

  return fallbackMessage;
}

export const apiService = {
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
