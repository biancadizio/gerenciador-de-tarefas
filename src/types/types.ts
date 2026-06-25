/**
 * Domain model for a task shown and persisted by the app.
 *
 * `type` is used as the user-facing category, `tags` stores free-form labels,
 * and `notificationId` links the task to an Expo local notification.
 */
export interface Task {
    id: number;
    title: string;
    completed: boolean;
    selected?: boolean;
    priority?: "text" | "background" | "modalBackground" | "selectorBackground" | "primary" | "secondary" | "inputBackground" | "border" | "danger" | "completedText" | "urgent" | "important" | "remember" | "no-urgency";
    category?: string;
    type?: string;
    recurrence?: string;
    dueDate?: string;
    details?: string;
    tags?: string[];
    notificationId?: string;
    relatedTasks?: number[];
  }
