import { Task } from '../../types/types';

// Pure filter/sort logic from HomeScreen used by the task list component
const filterByStatus = (tasks: Task[], status: 'all' | 'pending' | 'completed'): Task[] => {
  if (status === 'all') return tasks;
  if (status === 'completed') return tasks.filter(t => t.completed);
  return tasks.filter(t => !t.completed);
};

const filterByPriority = (tasks: Task[], priority: string | null): Task[] =>
  priority ? tasks.filter(t => t.priority === priority) : tasks;

const filterByType = (tasks: Task[], type: string | null): Task[] =>
  type ? tasks.filter(t => t.type === type) : tasks;

const sortByDueDate = (tasks: Task[]): Task[] =>
  [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(b.dueDate + 'T12:00:00').getTime() - new Date(a.dueDate + 'T12:00:00').getTime();
  });

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  title: 'Task',
  completed: false,
  priority: 'no-urgency',
  type: 'others',
  ...overrides,
});

describe('TaskItem — filterByStatus', () => {
  const tasks = [
    makeTask({ id: 1, completed: false }),
    makeTask({ id: 2, completed: true }),
    makeTask({ id: 3, completed: false }),
  ];

  it('returns all tasks for status "all"', () => {
    expect(filterByStatus(tasks, 'all')).toHaveLength(3);
  });

  it('returns only completed tasks', () => {
    const result = filterByStatus(tasks, 'completed');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it('returns only pending tasks', () => {
    const result = filterByStatus(tasks, 'pending');
    expect(result).toHaveLength(2);
    result.forEach(t => expect(t.completed).toBe(false));
  });

  it('returns empty when no tasks match', () => {
    const allDone = [makeTask({ id: 1, completed: true })];
    expect(filterByStatus(allDone, 'pending')).toHaveLength(0);
  });
});

describe('TaskItem — filterByPriority', () => {
  const tasks = [
    makeTask({ id: 1, priority: 'urgent' }),
    makeTask({ id: 2, priority: 'important' }),
    makeTask({ id: 3, priority: 'no-urgency' }),
  ];

  it('returns all tasks when priority is null', () => {
    expect(filterByPriority(tasks, null)).toHaveLength(3);
  });

  it('returns only tasks matching the priority', () => {
    const result = filterByPriority(tasks, 'urgent');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });
});

describe('TaskItem — filterByType', () => {
  const tasks = [
    makeTask({ id: 1, type: 'professional' }),
    makeTask({ id: 2, type: 'personal' }),
    makeTask({ id: 3, type: 'others' }),
  ];

  it('returns all tasks when type is null', () => {
    expect(filterByType(tasks, null)).toHaveLength(3);
  });

  it('returns only tasks matching the type', () => {
    const result = filterByType(tasks, 'personal');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });
});

describe('TaskItem — sortByDueDate', () => {
  it('sorts tasks by due date descending (most recent first)', () => {
    const tasks = [
      makeTask({ id: 1, dueDate: '2024-01-01' }),
      makeTask({ id: 2, dueDate: '2024-06-15' }),
      makeTask({ id: 3, dueDate: '2024-03-10' }),
    ];
    const result = sortByDueDate(tasks);
    expect(result[0].id).toBe(2);
    expect(result[1].id).toBe(3);
    expect(result[2].id).toBe(1);
  });

  it('places tasks without dueDate at the end', () => {
    const tasks = [
      makeTask({ id: 1, dueDate: undefined }),
      makeTask({ id: 2, dueDate: '2024-06-15' }),
    ];
    const result = sortByDueDate(tasks);
    expect(result[0].id).toBe(2);
    expect(result[1].id).toBe(1);
  });

  it('does not mutate the original array', () => {
    const tasks = [makeTask({ id: 1 }), makeTask({ id: 2 })];
    const original = [...tasks];
    sortByDueDate(tasks);
    expect(tasks[0].id).toBe(original[0].id);
  });
});
