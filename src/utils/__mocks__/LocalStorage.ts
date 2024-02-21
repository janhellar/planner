import {
  REFERENCE_STORAGE_KEY,
  INBOX_STORAGE_KEY,
  NEXT_ACTIONS_STORAGE_KEY,
  PROJECTS_STORAGE_KEY,
  CALENDAR_STORAGE_KEY,
  HABITS_STORAGE_KEY,
} from "storageKeys";
import { vi } from "vitest";

export const mockInboxCreate = vi.fn();
export const mockInboxRead = vi.fn();
export const mockInboxUpdate = vi.fn();
export const mockInboxRemove = vi.fn();
export const mockInboxList = vi.fn();

export const mockProjectsCreate = vi.fn();
export const mockProjectsRead = vi.fn();
export const mockProjectsUpdate = vi.fn();
export const mockProjectsRemove = vi.fn();
export const mockProjectsList = vi.fn();

export const mockNextActionsCreate = vi.fn();
export const mockNextActionsRead = vi.fn();
export const mockNextActionsUpdate = vi.fn();
export const mockNextActionsRemove = vi.fn();
export const mockNextActionsList = vi.fn();

export const mockCalendarCreate = vi.fn();
export const mockCalendarRead = vi.fn();
export const mockCalendarUpdate = vi.fn();
export const mockCalendarRemove = vi.fn();
export const mockCalendarList = vi.fn();

export const mockReferenceCreate = vi.fn();
export const mockReferenceRead = vi.fn();
export const mockReferenceUpdate = vi.fn();
export const mockReferenceRemove = vi.fn();
export const mockReferenceList = vi.fn();

export const mockHabitsCreate = vi.fn();
export const mockHabitsRead = vi.fn();
export const mockHabitsUpdate = vi.fn();
export const mockHabitsRemove = vi.fn();
export const mockHabitsList = vi.fn();

export const mockCreate = vi.fn();
export const mockRead = vi.fn();
export const mockUpdate = vi.fn();
export const mockRemove = vi.fn();
export const mockList = vi.fn();

const mock = vi.fn().mockImplementation((storageKey: string) => {
  if (storageKey === INBOX_STORAGE_KEY) {
    return {
      create: mockInboxCreate,
      read: mockInboxRead,
      update: mockInboxUpdate,
      remove: mockInboxRemove,
      list: mockInboxList,
    };
  }

  if (storageKey === PROJECTS_STORAGE_KEY) {
    return {
      create: mockProjectsCreate,
      read: mockProjectsRead,
      update: mockProjectsUpdate,
      remove: mockProjectsRemove,
      list: mockProjectsList,
    };
  }

  if (storageKey === NEXT_ACTIONS_STORAGE_KEY) {
    return {
      create: mockNextActionsCreate,
      read: mockNextActionsRead,
      update: mockNextActionsUpdate,
      remove: mockNextActionsRemove,
      list: mockNextActionsList,
    };
  }

  if (storageKey === CALENDAR_STORAGE_KEY) {
    return {
      create: mockCalendarCreate,
      read: mockCalendarRead,
      update: mockCalendarUpdate,
      remove: mockCalendarRemove,
      list: mockCalendarList,
    };
  }

  if (storageKey === REFERENCE_STORAGE_KEY) {
    return {
      create: mockReferenceCreate,
      read: mockReferenceRead,
      update: mockReferenceUpdate,
      remove: mockReferenceRemove,
      list: mockReferenceList,
    };
  }

  if (storageKey === HABITS_STORAGE_KEY) {
    return {
      create: mockHabitsCreate,
      read: mockHabitsRead,
      update: mockHabitsUpdate,
      remove: mockHabitsRemove,
      list: mockHabitsList,
    };
  }

  return {
    create: mockCreate,
    read: mockRead,
    update: mockUpdate,
    remove: mockRemove,
    list: mockList,
  };
});

export default mock;
