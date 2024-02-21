import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import calendar from "dayjs/plugin/calendar";
import relativeTime from "dayjs/plugin/relativeTime";
import { CalendarItem } from "entities";
import { CALENDAR_STORAGE_KEY } from "storageKeys";
import ListPage from "./ListPage";
import LocalStorage from "utils/LocalStorage";

dayjs.extend(localizedFormat);
dayjs.extend(calendar);
dayjs.extend(relativeTime);

interface Props {
  projectId?: number;
}

function getCalendarDate(date: string) {
  return dayjs(date).calendar(null, {
    sameDay: "[Today]",
    nextDay: "[Tomorrow]",
    nextWeek: "dddd",
    lastDay: "[Yesterday]",
    lastWeek: "[Last] dddd",
    sameElse: "DD/MM/YYYY",
  });
}

export default function Calendar(props: Props) {
  const renderDate = (item: CalendarItem) =>
    dayjs(item.date).isValid() && (
      <>
        {getCalendarDate(item.date)}
        {dayjs(item.date).isSame(dayjs(), "day") || (
          <> ({dayjs(item.date).from(dayjs().startOf("day"))})</>
        )}
        {": "}
      </>
    );

  const sortFn = (a: CalendarItem, b: CalendarItem) =>
    new Date(a.date).getTime() - new Date(b.date).getTime();

  const createCalendarItem = (
    storage: LocalStorage<CalendarItem>,
    title: string
  ) =>
    storage.create({
      title,
      done: false,
      notes: "",
      projectId: props.projectId,
      date: "",
    });

  return (
    <ListPage
      heading="Calendar"
      path="/calendar"
      storageKey={CALENDAR_STORAGE_KEY}
      createItem={createCalendarItem}
      projectId={props.projectId}
      renderItemPrefix={renderDate}
      sortFn={sortFn}
      showPriorities
    />
  );
}
