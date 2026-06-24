import axios from 'axios';
import { Task } from '../types/types';

const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';

interface RemoteTask {
  id: number;
  title: string;
  completed: boolean;
}

export const apiService = {
  fetchInitialTasks: async (): Promise<Task[]> => {
    try {
      const response = await fetch(`${BASE_URL}?_limit=5`);
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
      console.error('Erro ao buscar tarefas:', error);
      return [];
    }
  },

  fetchRemoteTasks: async (): Promise<RemoteTask[]> => {
    const response = await axios.get<RemoteTask[]>(`${BASE_URL}?_limit=10`);
    return response.data;
  },
};

// backward compatibility — hooks e testes já existentes importam isso diretamente
export const fetchInitialTasks = apiService.fetchInitialTasks;
