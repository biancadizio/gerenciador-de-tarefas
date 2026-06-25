import {
  sanitizeTaskTitle,
  TASK_TITLE_MAX_LENGTH,
  validateTaskTitle,
} from '../taskValidation';

describe('task title validation', () => {
  it('accepts a valid title', () => {
    expect(validateTaskTitle('Comprar leite')).toBeNull();
  });

  it('rejects an empty title', () => {
    expect(validateTaskTitle('')).toBe('Digite o título da tarefa.');
  });

  it('rejects a title with only spaces', () => {
    expect(validateTaskTitle('   ')).toBe('Digite o título da tarefa.');
  });

  it('accepts a title with the maximum allowed length', () => {
    expect(validateTaskTitle('a'.repeat(TASK_TITLE_MAX_LENGTH))).toBeNull();
  });

  it('rejects a title longer than the maximum allowed length', () => {
    expect(validateTaskTitle('a'.repeat(TASK_TITLE_MAX_LENGTH + 1))).toBe(
      `O título deve ter no máximo ${TASK_TITLE_MAX_LENGTH} caracteres.`
    );
  });

  it('trims whitespace before saving', () => {
    expect(sanitizeTaskTitle('  Estudar React Native  ')).toBe('Estudar React Native');
  });
});
