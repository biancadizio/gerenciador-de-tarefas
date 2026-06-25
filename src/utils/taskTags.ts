export const TASK_TAGS_MAX_LENGTH = 120;

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

export function formatTaskTags(tags?: string[]): string {
  return tags?.join(', ') ?? '';
}
