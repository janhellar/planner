import { Habit, NextAction, Project } from "entities";
import {
  CALENDAR_STORAGE_KEY,
  HABITS_STORAGE_KEY,
  NEXT_ACTIONS_STORAGE_KEY,
  PROJECTS_STORAGE_KEY,
} from "storageKeys";
import useStorage from "hooks/useStorage";
import useItems from "hooks/useItems";
import LocalStorage from "utils/LocalStorage";
import ListPage from "./ListPage";
import dayjs from "dayjs";

export default function Projects() {
  const nextActionsStorage = useStorage<NextAction>(NEXT_ACTIONS_STORAGE_KEY);
  const { items: nextActions } = useItems(nextActionsStorage);
  const calendarStorage = useStorage<NextAction>(CALENDAR_STORAGE_KEY);
  const { items: calendarItems } = useItems(calendarStorage);
  const habitsStorage = useStorage<Habit>(HABITS_STORAGE_KEY);
  const { items: habits } = useItems(habitsStorage);

  const hasActions = (project: Project) => {
    const hasNextActions = nextActions.find(
      (action) => action.projectId === project.id && !action.done
    );
    const hasCalendarItems = calendarItems.find(
      (item) => item.projectId === project.id && !item.done
    );
    const hasHabits = habits.find(
      (item) =>
        item.projectId === project.id &&
        (dayjs(item.endDate).isAfter(dayjs(), "day") ||
          dayjs(item.endDate).isSame(dayjs(), "day"))
    );

    return Boolean(hasNextActions || hasCalendarItems || hasHabits);
  };

  const renderItemSuffix = (item: Project) =>
    item.done ||
    hasActions(item) || (
      <strong className="ml-2 has-text-danger">without actions</strong>
    );

  const removeChildren = (id: number) => {
    const nextActionsChildren = nextActions.filter(
      (item) => item.projectId === id
    );

    nextActionsChildren.forEach(({ id }) => nextActionsStorage.remove(id));

    const calendarChildren = calendarItems.filter(
      (item) => item.projectId === id
    );

    calendarChildren.forEach(({ id }) => calendarStorage.remove(id));
  };

  const createProject = (storage: LocalStorage<Project>, title: string) =>
    storage.create({
      title,
      done: false,
      notes: "",
    });

  return (
    <ListPage
      heading="Projects"
      path="/projects"
      storageKey={PROJECTS_STORAGE_KEY}
      createItem={createProject}
      onRemove={removeChildren}
      renderItemSuffix={renderItemSuffix}
      showPriorities
    />
  );
}
