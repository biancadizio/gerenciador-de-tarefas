import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types/types';
import { storageService } from '../services/storageService';
import { apiService } from '../services/api';
import { cancelTaskNotification, rescheduleTaskNotification } from '../services/notificationService';

/**
 * Central hook for task state management.
 * It loads initial data, persists every mutation, and coordinates deadline
 * notification scheduling when tasks are edited, completed, or removed.
 *
 * @returns Task state, loading/error flags, and mutation handlers used by screens.
 */
export function useTaskList() {
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await storageService.getTasks();
        if (stored) {
          setTasksState(stored);
        } else {
          const apiTasks = await apiService.fetchInitialTasks();
          setTasksState(apiTasks);
          await storageService.saveTasks(apiTasks);
        }
      } catch (loadError) {
        const message = loadError instanceof Error
          ? loadError.message
          : 'Erro ao carregar tarefas.';
        setError(message);
        setTasksState([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /**
   * Saves the latest task list snapshot to local storage.
   *
   * @param updated - Full task list after a mutation.
   */
  const persist = useCallback(async (updated: Task[]) => {
    try {
      await storageService.saveTasks(updated);
    } catch (saveError) {
      const message = saveError instanceof Error
        ? saveError.message
        : 'Erro ao salvar tarefas.';
      setError(message);
    }
  }, []);

  /**
   * Creates a new pending task using default metadata.
   *
   * @param title - Already validated task title.
   */
  const addTask = useCallback((title: string) => {
    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
      priority: 'no-urgency',
      type: 'others',
      tags: [],
      notificationId: undefined,
    };
    setTasksState((prev) => {
      const updated = [...prev, newTask];
      persist(updated);
      return updated;
    });
  }, [persist]);

  /**
   * Toggles completion and cancels pending notifications when a task is done.
   *
   * @param id - Task identifier.
   */
  const toggleTask = useCallback((id: number) => {
    setTasksState((prev) => {
      const taskToToggle = prev.find((t) => t.id === id);
      const updated = prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, notificationId: !t.completed ? undefined : t.notificationId } : t
      );
      if (taskToToggle && !taskToToggle.completed) {
        cancelTaskNotification(taskToToggle.notificationId);
      }
      persist(updated);
      return updated;
    });
  }, [persist]);

  /**
   * Removes a task and cancels its scheduled reminder if one exists.
   *
   * @param id - Task identifier.
   */
  const deleteTask = useCallback((id: number) => {
    setTasksState((prev) => {
      const deletedTask = prev.find((t) => t.id === id);
      const updated = prev.filter((t) => t.id !== id);
      cancelTaskNotification(deletedTask?.notificationId);
      persist(updated);
      return updated;
    });
  }, [persist]);

  /**
   * Persists task edits and refreshes the local notification for its due date.
   *
   * @param updatedTask - Task data submitted by the details modal.
   */
  const updateTask = useCallback(async (updatedTask: Task) => {
    let taskToPersist = updatedTask;

    try {
      taskToPersist = await rescheduleTaskNotification(updatedTask);
    } catch {
      setError('Erro ao agendar notificação da tarefa.');
    }

    setTasksState((prev) => {
      const updated = prev.map((t) =>
        t.id === taskToPersist.id ? taskToPersist : t
      );
      persist(updated);
      return updated;
    });
  }, [persist]);

  /**
   * Persists the order produced by drag-and-drop.
   *
   * @param reordered - Task list in the new display order.
   */
  const reorderTasks = useCallback((reordered: Task[]) => {
    setTasksState(reordered);
    persist(reordered);
  }, [persist]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { tasks, loading, error, clearError, addTask, toggleTask, deleteTask, updateTask, reorderTasks };
}
