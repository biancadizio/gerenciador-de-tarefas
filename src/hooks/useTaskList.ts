import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/types';
import { fetchInitialTasks } from '../services/api';

const STORAGE_KEY = '@tasks';

export function useTaskList() {
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setTasksState(JSON.parse(stored));
        } else {
          const apiTasks = await fetchInitialTasks();
          setTasksState(apiTasks);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(apiTasks));
        }
      } catch {
        setError('Erro ao carregar tarefas.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const persist = useCallback(async (updated: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      setError('Erro ao salvar tarefas.');
    }
  }, []);

  const addTask = useCallback((title: string) => {
    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
      priority: 'no-urgency',
      type: 'others',
    };
    setTasksState((prev) => {
      const updated = [...prev, newTask];
      persist(updated);
      return updated;
    });
  }, [persist]);

  const toggleTask = useCallback((id: number) => {
    setTasksState((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      persist(updated);
      return updated;
    });
  }, [persist]);

  const deleteTask = useCallback((id: number) => {
    setTasksState((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      persist(updated);
      return updated;
    });
  }, [persist]);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasksState((prev) => {
      const updated = prev.map((t) =>
        t.id === updatedTask.id ? updatedTask : t
      );
      persist(updated);
      return updated;
    });
  }, [persist]);

  const reorderTasks = useCallback((reordered: Task[]) => {
    setTasksState(reordered);
    persist(reordered);
  }, [persist]);

  return { tasks, loading, error, addTask, toggleTask, deleteTask, updateTask, reorderTasks };
}
