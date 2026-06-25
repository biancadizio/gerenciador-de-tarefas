import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types/types';
import { storageService } from '../services/storageService';
import { apiService } from '../services/api';
import { cancelTaskNotification, rescheduleTaskNotification } from '../services/notificationService';

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

  const deleteTask = useCallback((id: number) => {
    setTasksState((prev) => {
      const deletedTask = prev.find((t) => t.id === id);
      const updated = prev.filter((t) => t.id !== id);
      cancelTaskNotification(deletedTask?.notificationId);
      persist(updated);
      return updated;
    });
  }, [persist]);

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

  const reorderTasks = useCallback((reordered: Task[]) => {
    setTasksState(reordered);
    persist(reordered);
  }, [persist]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { tasks, loading, error, clearError, addTask, toggleTask, deleteTask, updateTask, reorderTasks };
}
