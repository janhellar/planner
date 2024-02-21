export interface InboxItem {
  id: number;
  title: string;
  done: boolean;
}

export const PRIORITIES = ["A", "B", "C", "D", "E"] as const;

export type Priority = typeof PRIORITIES[number] | "inherit";

export interface Project {
  id: number;
  title: string;
  done: boolean;
  notes: string;
  priority?: Priority;
}

export interface NextAction {
  id: number;
  title: string;
  done: boolean;
  notes: string;
  projectId?: number;
  someday?: boolean;
  waitingFor?: boolean;
  priority?: Priority;
}

export interface CalendarItem {
  id: number;
  title: string;
  done: boolean;
  notes: string;
  projectId?: number;
  date: string;
  priority?: Priority;
}

export interface Reference {
  id: number;
  title: string;
  notes: string;
}

export interface HabitRecord {
  date: string;
  success: boolean;
}

export interface Habit {
  id: number;
  title: string;
  notes: string;
  projectId?: number;
  priority?: Priority;
  startDate: string;
  endDate: string;
  records: HabitRecord[];
}
