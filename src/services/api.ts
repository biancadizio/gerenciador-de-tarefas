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
