import { Task } from '../../types/types';

import { storageService } from '../storageService';

const store: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key: string) => Promise.resolve(store[key] ?? null)),
  setItem: jest.fn((key: string, value: string) => {
    store[key] = value;
    return Promise.resolve();
  }),
}));

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  title: 'Test',
  completed: false,
  priority: 'no-urgency',
  type: 'others',
  ...overrides,
});

beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k]);
  jest.clearAllMocks();
});

describe('storageService.getTasks', () => {
  it('returns null when storage is empty', async () => {
    const result = await storageService.getTasks();
    expect(result).toBeNull();
  });

  it('returns parsed tasks when storage has data', async () => {
    const tasks = [makeTask({ id: 1 }), makeTask({ id: 2 })];
    store['@tasks'] = JSON.stringify(tasks);

    const result = await storageService.getTasks();
    expect(result).toHaveLength(2);
    expect(result![0].id).toBe(1);
  });
});

describe('storageService.saveTasks', () => {
  it('persists tasks to storage', async () => {
    const tasks = [makeTask({ id: 1, title: 'Buy milk' })];
    await storageService.saveTasks(tasks);

    const raw = store['@tasks'];
    expect(raw).toBeDefined();
    expect(JSON.parse(raw)[0].title).toBe('Buy milk');
  });

  it('overwrites existing data on save', async () => {
    await storageService.saveTasks([makeTask({ id: 1 })]);
    await storageService.saveTasks([makeTask({ id: 2 }), makeTask({ id: 3 })]);

    const result = await storageService.getTasks();
    expect(result).toHaveLength(2);
    expect(result![0].id).toBe(2);
  });

  it('persists empty list correctly', async () => {
    await storageService.saveTasks([]);
    const result = await storageService.getTasks();
    expect(result).toEqual([]);
  });
});
