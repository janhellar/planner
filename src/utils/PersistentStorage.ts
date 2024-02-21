import {
  CalendarItem,
  Habit,
  InboxItem,
  NextAction,
  Project,
  Reference,
} from "entities";
import { debounce, DebouncedFunc } from "lodash";
import React from "react";
import {
  INBOX_STORAGE_KEY,
  NEXT_ACTIONS_STORAGE_KEY,
  PROJECTS_STORAGE_KEY,
  CALENDAR_STORAGE_KEY,
  REFERENCE_STORAGE_KEY,
  HABITS_STORAGE_KEY,
} from "storageKeys";
import LocalStorage from "./LocalStorage";

export abstract class PersistentStorage {
  private inboxStorage: LocalStorage<InboxItem>;
  private nextActionsStorage: LocalStorage<NextAction>;
  private projectsStorage: LocalStorage<Project>;
  private calendarStorage: LocalStorage<CalendarItem>;
  private referencesStorage: LocalStorage<Reference>;
  private habitsStorage: LocalStorage<Habit>;

  public save: DebouncedFunc<typeof this.saveRemote>;
  public load: typeof this.loadRemote;

  constructor() {
    this.inboxStorage = new LocalStorage<InboxItem>(INBOX_STORAGE_KEY);
    this.nextActionsStorage = new LocalStorage<NextAction>(
      NEXT_ACTIONS_STORAGE_KEY
    );
    this.projectsStorage = new LocalStorage<Project>(PROJECTS_STORAGE_KEY);
    this.calendarStorage = new LocalStorage<CalendarItem>(CALENDAR_STORAGE_KEY);
    this.referencesStorage = new LocalStorage<Reference>(REFERENCE_STORAGE_KEY);
    this.habitsStorage = new LocalStorage<Habit>(HABITS_STORAGE_KEY);

    this.save = debounce(this.saveRemote.bind(this), 2000);
    this.load = this.loadRemote.bind(this);
  }

  protected getData() {
    const inbox = this.inboxStorage.list();
    const nextActions = this.nextActionsStorage.list();
    const projects = this.projectsStorage.list();
    const calendar = this.calendarStorage.list();
    const references = this.referencesStorage.list();
    const habits = this.habitsStorage.list();

    return JSON.stringify(
      {
        inbox,
        "next-actions": nextActions,
        projects,
        calendar,
        references,
        habits,
        "inbox-last-id": localStorage.getItem("inbox-last-id"),
        "next-actions-last-id": localStorage.getItem("next-actions-last-id"),
        "projects-last-id": localStorage.getItem("projects-last-id"),
        "calendar-last-id": localStorage.getItem("calendar-last-id"),
        "references-last-id": localStorage.getItem("references-last-id"),
        "habits-last-id": localStorage.getItem("habits-last-id"),
      },
      null,
      2
    );
  }

  protected setData(json: string) {
    const data = JSON.parse(json);

    Object.entries(data).forEach(([key, value]) =>
      localStorage.setItem(
        key,
        key.endsWith("last-id") ? (value as string) : JSON.stringify(value)
      )
    );
  }

  protected abstract saveRemote(): void;

  protected abstract loadRemote(): Promise<void>;
}

export const PersistentStorageContext =
  React.createContext<PersistentStorage | null>(null);
