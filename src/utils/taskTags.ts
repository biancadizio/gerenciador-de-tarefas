export const TASK_TAGS_MAX_LENGTH = 120;

/**
 * Converts a comma-separated text field into normalized task tags.
 * Empty values are removed and duplicated tags are ignored case-insensitively.
 *
 * @param input - Raw comma-separated tags typed by the user.
 * @returns Unique tags in the order they first appeared.
 */
export function parseTaskTags(input: string): string[] {
  const tags = input
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return tags.filter((tag, index) => {
    const normalizedTag = tag.toLowerCase();
    return tags.findIndex((item) => item.toLowerCase() === normalizedTag) === index;
  });
}

/**
 * Formats a task tag array back into the editable comma-separated form.
 *
 * @param tags - Tags stored in the task.
 * @returns Text that can be shown in the tags input.
 */
export function formatTaskTags(tags?: string[]): string {
  return tags?.join(', ') ?? '';
}
