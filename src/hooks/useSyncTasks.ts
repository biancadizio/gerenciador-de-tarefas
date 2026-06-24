import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiService } from '../services/api';

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
        const remoteTasks = await apiService.fetchRemoteTasks();
        remoteTasks.forEach((task) => addTask(task.title));
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
