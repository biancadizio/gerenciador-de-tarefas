export const TASK_TITLE_MAX_LENGTH = 80;

export function sanitizeTaskTitle(title: string): string {
  return title.trim();
}

export function validateTaskTitle(title: string): string | null {
  const sanitizedTitle = sanitizeTaskTitle(title);

  if (!sanitizedTitle) {
    return 'Digite o título da tarefa.';
  }

  if (sanitizedTitle.length > TASK_TITLE_MAX_LENGTH) {
    return `O título deve ter no máximo ${TASK_TITLE_MAX_LENGTH} caracteres.`;
  }

  return null;
}
