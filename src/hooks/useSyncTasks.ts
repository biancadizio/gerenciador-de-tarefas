import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

/**
 * Synchronizes starter tasks from the remote API when the local list is empty.
 *
 * @param addTask - Callback used to insert each remote task title locally.
 * @param existingTasksCount - Current number of local tasks.
 * @param enabled - Guards sync until the initial local load has completed.
 * @returns Sync progress and user-facing error message.
 */
export function useSyncTasks(
  addTask: (title: string) => void,
  existingTasksCount: number,
  enabled = true
) {
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (existingTasksCount > 0) return;

    const sync = async () => {
      setSyncing(true);
      setSyncError(null);
      try {
        const remoteTasks = await apiService.fetchRemoteTasks();
        remoteTasks.forEach((task) => addTask(task.title));
      } catch (error) {
        const message = error instanceof Error
          ? error.message
          : 'Erro inesperado ao sincronizar tarefas.';
        setSyncError(message);
      } finally {
        setSyncing(false);
      }
    };

    sync();
  }, [addTask, enabled, existingTasksCount]);

  return { syncing, syncError };
}
