import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { CALENDAR_STORAGE_KEY } from "storageKeys";
import { CalendarItem, PRIORITIES } from "entities";
import DetailPage from "./DetailPage";

dayjs.extend(localizedFormat);

export default function CalendarDetail() {
  return (
    <DetailPage<CalendarItem>
      heading="Calendar"
      path="/calendar"
      storageKey={CALENDAR_STORAGE_KEY}
      fields={["date", "title", "notes", "priority"]}
    />
  );
}
