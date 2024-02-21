import dayjs from "dayjs";
import { Habit } from "entities";
import { HABITS_STORAGE_KEY } from "storageKeys";
import DetailPage from "./DetailPage";

export default function HabitDetail() {
  const renderDateField = (
    item: Habit,
    dateField: "startDate" | "endDate",
    label: string,
    save: (field: keyof Habit, value: any) => void
  ) => (
    <div className="is-flex is-align-items-center">
      {label}:
      <div className="ml-2">
        <input
          spellCheck={false}
          className="input"
          type="date"
          value={item[dateField]}
          onChange={(event) =>
            save(dateField, dayjs(event.target.value).format("YYYY-MM-DD"))
          }
        />
      </div>
    </div>
  );

  return (
    <DetailPage<Habit>
      heading="Habits"
      path="/habits"
      storageKey={HABITS_STORAGE_KEY}
      fields={[
        "title",
        "notes",
        "priority",
        (item, save) => renderDateField(item, "startDate", "Start", save),
        (item, save) => renderDateField(item, "endDate", "End", save),
      ]}
    />
  );
}
