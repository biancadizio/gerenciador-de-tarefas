export const TASK_TITLE_MAX_LENGTH = 80;

/**
 * Removes leading and trailing whitespace before a task title is persisted.
 *
 * @param title - Raw title typed by the user.
 * @returns The normalized title used by the app.
 */
export function sanitizeTaskTitle(title: string): string {
  return title.trim();
}

/**
 * Validates the task title used when creating or editing a task.
 *
 * @param title - Raw title typed by the user.
 * @returns A Portuguese validation message, or null when the title is valid.
 */
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
