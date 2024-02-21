import classNames from "classnames";
import dayjs from "dayjs";
import { Habit } from "entities";
import { useState } from "react";
import { HABITS_STORAGE_KEY } from "storageKeys";
import LocalStorage from "utils/LocalStorage";
import ListPage from "./ListPage";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Props {
  projectId?: number;
}

export default function Habits(props: Props) {
  const [onlyTodayHabits, setOnlyTodayHabits] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const createCalendarItem = (storage: LocalStorage<Habit>, title: string) =>
    storage.create({
      title,
      notes: "",
      projectId: props.projectId,
      startDate: "",
      endDate: "",
      records: [],
    });

  const renderActions = () => (
    <>
      <p className="control">
        <button
          className={classNames("button", "is-small", "is-light")}
          onClick={() => setOnlyTodayHabits(!onlyTodayHabits)}
        >
          show {onlyTodayHabits ? "all" : "only today"}
        </button>
      </p>
      <p className="control">
        <input
          className="input is-small"
          type="date"
          value={selectedDate}
          onChange={(event) =>
            setSelectedDate(dayjs(event.target.value).format("YYYY-MM-DD"))
          }
        />
      </p>
    </>
  );

  const filterItems = (item: Habit) => {
    const now = dayjs(selectedDate);

    if (!onlyTodayHabits) {
      return true;
    }

    return (
      (dayjs(item.startDate).isSame(now, "day") ||
        dayjs(item.startDate).isBefore(now, "day")) &&
      (dayjs(item.endDate).isSame(now, "day") ||
        dayjs(item.endDate).isAfter(now, "day"))
    );
  };

  const setDone = (item: Habit, done: boolean) => {
    const now = dayjs(selectedDate);
    const todayRecord = item.records.find((record) =>
      dayjs(record.date).isSame(now, "day")
    );

    if (todayRecord) {
      todayRecord.success = done;
    } else {
      item.records.push({ date: now.format("YYYY-MM-DD"), success: done });
    }

    return item;
  };

  const getDone = (item: Habit) =>
    item.records.find((record) =>
      dayjs(record.date).isSame(dayjs(selectedDate), "day")
    )?.success ?? false;

  const renderProgress = (item: Habit) => {
    const endDate = dayjs(item.endDate).isBefore(dayjs(), "day")
      ? dayjs(item.endDate)
      : dayjs();
    const passedDays =
      Math.abs(dayjs(item.startDate).diff(endDate, "days")) + 1;
    const successCount = item.records.filter(({ success }) => success).length;
    const progress = successCount / passedDays;

    return (
      <div style={{ width: 30, height: 30 }} className="is-inline-block mr-3">
        <CircularProgressbar
          value={progress * 100}
          background
          strokeWidth={20}
          styles={buildStyles({
            pathColor:
              progress > 0.9
                ? "hsl(141, 71%, 48%)"
                : progress > 0.8
                ? "hsl(48, 100%, 67%)"
                : "hsl(348, 100%, 61%)",
            trailColor: "hsl(0, 0%, 96%)",
            backgroundColor: "rgba(0,0,0,0)",
          })}
        />
      </div>
    );
  };

  return (
    <ListPage
      heading="Habits"
      path="/habits"
      storageKey={HABITS_STORAGE_KEY}
      createItem={createCalendarItem}
      projectId={props.projectId}
      showPriorities
      renderActions={renderActions}
      filterFn={filterItems}
      hideCheckboxes={!onlyTodayHabits}
      setDone={setDone}
      getDone={getDone}
      renderItemPrefix={renderProgress}
    />
  );
}
