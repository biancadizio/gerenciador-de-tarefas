jest.mock('axios');
import axios from 'axios';

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockFetch = jest.fn();
(globalThis as any).fetch = mockFetch;

import { apiService } from '../api';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('apiService.fetchInitialTasks', () => {
  it('returns mapped tasks from the API', async () => {
    const raw = [
      { id: 1, title: 'Task one', completed: false },
      { id: 2, title: 'Task two', completed: true },
    ];
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(raw),
    });

    const tasks = await apiService.fetchInitialTasks();
    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toBe('Task one');
    expect(tasks[0].priority).toBe('no-urgency');
    expect(tasks[0].type).toBe('others');
    expect(tasks[1].completed).toBe(true);
  });

  it('returns empty array on fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    const tasks = await apiService.fetchInitialTasks();
    expect(tasks).toEqual([]);
  });
});

describe('apiService.fetchRemoteTasks', () => {
  it('returns remote tasks from axios', async () => {
    const remote = [
      { id: 1, title: 'Remote A', completed: false },
      { id: 2, title: 'Remote B', completed: true },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: remote });

    const tasks = await apiService.fetchRemoteTasks();
    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toBe('Remote A');
    expect(tasks[1].title).toBe('Remote B');
  });

  it('throws on axios error so the caller can handle it', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Timeout'));
    await expect(apiService.fetchRemoteTasks()).rejects.toThrow('Timeout');
  });
});
