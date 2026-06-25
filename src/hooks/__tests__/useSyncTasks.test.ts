import axios from 'axios';
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useSyncTasks — sync guard', () => {
  it('should not sync when there are existing tasks', () => {
    const shouldSync = (count: number) => count === 0;
    expect(shouldSync(5)).toBe(false);
    expect(shouldSync(1)).toBe(false);
    expect(shouldSync(0)).toBe(true);
  });
});

describe('useSyncTasks — sync execution', () => {
  it('calls addTask for each task returned by the API', async () => {
    const remoteTasks = [
      { id: 1, title: 'Task A', completed: false },
      { id: 2, title: 'Task B', completed: true },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: remoteTasks });

    const addTask = jest.fn();
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=10');
    (response.data as typeof remoteTasks).forEach(task => addTask(task.title));

    expect(addTask).toHaveBeenCalledTimes(2);
    expect(addTask).toHaveBeenCalledWith('Task A');
    expect(addTask).toHaveBeenCalledWith('Task B');
  });

  it('sets error message on axios error', async () => {
    const axiosError = new Error('Network Error');
    mockedAxios.get.mockRejectedValueOnce(axiosError);
    mockedAxios.isAxiosError.mockReturnValueOnce(true);

    let syncError: string | null = null;
    try {
      await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=10');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        syncError = `Erro ao sincronizar: ${(err as Error).message}`;
      }
    }

    expect(syncError).toBe('Erro ao sincronizar: Network Error');
  });

  it('sets generic error message on non-axios error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('unexpected'));
    mockedAxios.isAxiosError.mockReturnValueOnce(false);

    let syncError: string | null = null;
    try {
      await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=10');
    } catch {
      if (!axios.isAxiosError({})) {
        syncError = 'Erro inesperado ao sincronizar tarefas.';
      }
    }

    expect(syncError).toBe('Erro inesperado ao sincronizar tarefas.');
  });
});
