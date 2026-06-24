import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=10';

interface RemoteTask {
  id: number;
  title: string;
  completed: boolean;
}

export function useSyncTasks(
  addTask: (title: string) => void,
  existingTasksCount: number
) {
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    if (existingTasksCount > 0) return;

    const sync = async () => {
      setSyncing(true);
      setSyncError(null);
      try {
        const response = await axios.get<RemoteTask[]>(API_URL);
        response.data.forEach((task) => addTask(task.title));
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setSyncError(`Erro ao sincronizar: ${error.message}`);
        } else {
          setSyncError('Erro inesperado ao sincronizar tarefas.');
        }
      } finally {
        setSyncing(false);
      }
    };

    sync();
  }, []);

  return { syncing, syncError };
}
