import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };

export function sortByPriority<T extends { priority: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => 
    priorityOrder[a.priority as keyof typeof priorityOrder] - 
    priorityOrder[b.priority as keyof typeof priorityOrder]
  );
}

export function sortByDate<T extends { createdAt: string | Date }>(items: T[]): T[] {
  return [...items].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function filterTasks<T extends { completed: boolean }>(
  tasks: T[],
  filter: 'all' | 'active' | 'completed'
): T[] {
  switch (filter) {
    case 'active':
      return tasks.filter(task => !task.completed);
    case 'completed':
      return tasks.filter(task => task.completed);
    default:
      return tasks;
  }
}

export function searchTasks<T extends { title: string; description?: string | null }>(
  tasks: T[],
  searchQuery: string
): T[] {
  if (!searchQuery.trim()) return tasks;
  
  const query = searchQuery.toLowerCase();
  return tasks.filter(task => 
    task.title.toLowerCase().includes(query) || 
    (task.description && task.description.toLowerCase().includes(query))
  );
}
