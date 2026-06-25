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
    relatedTasks?: number[];
  }
