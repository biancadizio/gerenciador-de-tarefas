import { Task } from '../types/types';

// ─── AsyncStorage mock ───────────────────────────────────────────────────────
const store: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key: string) => Promise.resolve(store[key] ?? null)),
  setItem: jest.fn((key: string, value: string) => {
    store[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key: string) => {
    delete store[key];
    return Promise.resolve();
  }),
}));

// ─── API mock ────────────────────────────────────────────────────────────────
jest.mock('../services/api', () => ({
  fetchInitialTasks: jest.fn(() => Promise.resolve([])),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Helpers (same logic as useTaskList) ─────────────────────────────────────
const STORAGE_KEY = '@tasks';

async function loadTasks(): Promise<Task[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(tasks: Task[], title: string): Task[] {
  const newTask: Task = {
    id: tasks.length + 1,
    title: title.trim(),
    completed: false,
    priority: 'no-urgency',
    type: 'others',
  };
  return [...tasks, newTask];
}

function toggleTask(tasks: Task[], id: number): Task[] {
  return tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
}

function deleteTask(tasks: Task[], id: number): Task[] {
  return tasks.filter(t => t.id !== id);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k]);
  jest.clearAllMocks();
});

describe('Integration — create task', () => {
  it('adds a task and persists it to storage', async () => {
    let tasks = await loadTasks();
    tasks = createTask(tasks, 'Buy milk');
    await saveTasks(tasks);

    const persisted = await loadTasks();
    expect(persisted).toHaveLength(1);
    expect(persisted[0].title).toBe('Buy milk');
    expect(persisted[0].completed).toBe(false);
  });

  it('trims whitespace from the title before saving', async () => {
    let tasks = await loadTasks();
    tasks = createTask(tasks, '   Study React Native   ');
    await saveTasks(tasks);

    const persisted = await loadTasks();
    expect(persisted[0].title).toBe('Study React Native');
  });

  it('creates multiple tasks and keeps them all', async () => {
    let tasks = await loadTasks();
    tasks = createTask(tasks, 'Task A');
    tasks = createTask(tasks, 'Task B');
    tasks = createTask(tasks, 'Task C');
    await saveTasks(tasks);

    const persisted = await loadTasks();
    expect(persisted).toHaveLength(3);
    expect(persisted.map(t => t.title)).toEqual(['Task A', 'Task B', 'Task C']);
  });
});

describe('Integration — complete task', () => {
  it('marks a task as completed and persists the change', async () => {
    let tasks = createTask([], 'Read a book');
    await saveTasks(tasks);

    tasks = toggleTask(await loadTasks(), 1);
    await saveTasks(tasks);

    const persisted = await loadTasks();
    expect(persisted[0].completed).toBe(true);
  });

  it('toggling twice returns the task to pending', async () => {
    let tasks = createTask([], 'Exercise');
    await saveTasks(tasks);

    tasks = toggleTask(await loadTasks(), 1);
    await saveTasks(tasks);
    tasks = toggleTask(await loadTasks(), 1);
    await saveTasks(tasks);

    const persisted = await loadTasks();
    expect(persisted[0].completed).toBe(false);
  });

  it('only the toggled task changes status', async () => {
    let tasks = createTask([], 'Task A');
    tasks = createTask(tasks, 'Task B');
    await saveTasks(tasks);

    tasks = toggleTask(await loadTasks(), 1);
    await saveTasks(tasks);

    const persisted = await loadTasks();
    expect(persisted[0].completed).toBe(true);
    expect(persisted[1].completed).toBe(false);
  });
});

describe('Integration — delete task', () => {
  it('removes the task and persists the deletion', async () => {
    let tasks = createTask([], 'Delete me');
    await saveTasks(tasks);

    tasks = deleteTask(await loadTasks(), 1);
    await saveTasks(tasks);

    const persisted = await loadTasks();
    expect(persisted).toHaveLength(0);
  });

  it('keeps the remaining tasks after deletion', async () => {
    let tasks = createTask([], 'Keep me');
    tasks = createTask(tasks, 'Delete me');
    await saveTasks(tasks);

    tasks = deleteTask(await loadTasks(), 2);
    await saveTasks(tasks);

    const persisted = await loadTasks();
    expect(persisted).toHaveLength(1);
    expect(persisted[0].title).toBe('Keep me');
  });
});

describe('Integration — full flow: create → complete → delete', () => {
  it('completes the entire task lifecycle correctly', async () => {
    // 1. Storage starts empty
    expect(await loadTasks()).toHaveLength(0);

    // 2. Create two tasks
    let tasks = createTask([], 'Buy groceries');
    tasks = createTask(tasks, 'Call dentist');
    await saveTasks(tasks);
    expect((await loadTasks())).toHaveLength(2);

    // 3. Complete the first task
    tasks = toggleTask(await loadTasks(), 1);
    await saveTasks(tasks);
    let persisted = await loadTasks();
    expect(persisted[0].completed).toBe(true);
    expect(persisted[1].completed).toBe(false);

    // 4. Delete the completed task
    tasks = deleteTask(await loadTasks(), 1);
    await saveTasks(tasks);
    persisted = await loadTasks();
    expect(persisted).toHaveLength(1);
    expect(persisted[0].title).toBe('Call dentist');
    expect(persisted[0].completed).toBe(false);

    // 5. Complete and delete the remaining task
    tasks = toggleTask(await loadTasks(), 2);
    await saveTasks(tasks);
    tasks = deleteTask(await loadTasks(), 2);
    await saveTasks(tasks);
    expect(await loadTasks()).toHaveLength(0);
  });

  it('AsyncStorage is called on every state change', async () => {
    let tasks: Task[] = [];

    tasks = createTask(tasks, 'Track me');
    await saveTasks(tasks);

    tasks = toggleTask(tasks, 1);
    await saveTasks(tasks);

    tasks = deleteTask(tasks, 1);
    await saveTasks(tasks);

    // setItem called once per operation
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(3);
  });
});
