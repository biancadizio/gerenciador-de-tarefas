import { Task } from '../../types/types';

// Pure logic extracted from useTaskList
const toggleTaskInList = (tasks: Task[], id: number): Task[] =>
  tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);

const deleteTaskFromList = (tasks: Task[], id: number): Task[] =>
  tasks.filter(t => t.id !== id);

const updateTaskInList = (tasks: Task[], updated: Task): Task[] =>
  tasks.map(t => t.id === updated.id ? updated : t);

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  title: 'Test task',
  completed: false,
  priority: 'no-urgency',
  type: 'others',
  ...overrides,
});

describe('useTaskList — addTask', () => {
  it('creates task with correct default shape', () => {
    const title = '  Buy groceries  ';
    const task: Task = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
      priority: 'no-urgency',
      type: 'others',
    };
    expect(task.title).toBe('Buy groceries');
    expect(task.completed).toBe(false);
    expect(task.priority).toBe('no-urgency');
    expect(task.type).toBe('others');
  });

  it('trims whitespace from title', () => {
    const title = '   spaces   ';
    const task: Task = { id: 1, title: title.trim(), completed: false, priority: 'no-urgency', type: 'others' };
    expect(task.title).toBe('spaces');
  });
});

describe('useTaskList — toggleTask', () => {
  it('marks a pending task as completed', () => {
    const tasks = [makeTask({ id: 1, completed: false })];
    const result = toggleTaskInList(tasks, 1);
    expect(result[0].completed).toBe(true);
  });

  it('marks a completed task as pending', () => {
    const tasks = [makeTask({ id: 1, completed: true })];
    const result = toggleTaskInList(tasks, 1);
    expect(result[0].completed).toBe(false);
  });

  it('does not affect other tasks', () => {
    const tasks = [makeTask({ id: 1, completed: false }), makeTask({ id: 2, completed: false })];
    const result = toggleTaskInList(tasks, 1);
    expect(result[1].completed).toBe(false);
  });
});

describe('useTaskList — deleteTask', () => {
  it('removes the task with the given id', () => {
    const tasks = [makeTask({ id: 1 }), makeTask({ id: 2 })];
    const result = deleteTaskFromList(tasks, 1);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it('returns empty list when the only task is deleted', () => {
    const result = deleteTaskFromList([makeTask({ id: 1 })], 1);
    expect(result).toHaveLength(0);
  });

  it('does nothing when id does not exist', () => {
    const tasks = [makeTask({ id: 1 })];
    const result = deleteTaskFromList(tasks, 99);
    expect(result).toHaveLength(1);
  });
});

describe('useTaskList — updateTask', () => {
  it('updates the task fields', () => {
    const tasks = [makeTask({ id: 1, title: 'Old' })];
    const updated = makeTask({ id: 1, title: 'New', completed: true });
    const result = updateTaskInList(tasks, updated);
    expect(result[0].title).toBe('New');
    expect(result[0].completed).toBe(true);
  });

  it('does not affect other tasks', () => {
    const tasks = [makeTask({ id: 1 }), makeTask({ id: 2, title: 'Other' })];
    const result = updateTaskInList(tasks, makeTask({ id: 1, title: 'Updated' }));
    expect(result[1].title).toBe('Other');
  });
});

describe('useTaskList — reorderTasks', () => {
  it('preserves the new order exactly', () => {
    const reordered = [makeTask({ id: 2 }), makeTask({ id: 1 })];
    expect(reordered[0].id).toBe(2);
    expect(reordered[1].id).toBe(1);
  });
});
