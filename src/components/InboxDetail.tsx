import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";
import { CalendarItem, InboxItem, NextAction, Project } from "entities";
import {
  CALENDAR_STORAGE_KEY,
  INBOX_STORAGE_KEY,
  NEXT_ACTIONS_STORAGE_KEY,
  PROJECTS_STORAGE_KEY,
} from "storageKeys";
import useStorage from "hooks/useStorage";
import DetailPage from "./DetailPage";

export default function InboxDetail() {
  const inboxStorage = useStorage<InboxItem>(INBOX_STORAGE_KEY);
  const projectsStorage = useStorage<Project>(PROJECTS_STORAGE_KEY);
  const calendarStorage = useStorage<CalendarItem>(CALENDAR_STORAGE_KEY);
  const nextActionsStorage = useStorage<NextAction>(NEXT_ACTIONS_STORAGE_KEY);

  const navigate = useNavigate();

  const goBack = () => {
    navigate("/inbox");
  };

  const [seconds, setSeconds] = useState(120);

  useEffect(() => {
    const intervalId = setInterval(() => {
      flushSync(() => {
        setSeconds((seconds) => {
          const newSeconds = seconds - 1;

          if (newSeconds <= 0) {
            clearInterval(intervalId);
          }

          return newSeconds;
        });
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDone = (item: InboxItem) => {
    inboxStorage.update({ ...item, done: true });
    goBack();
  };

  const handleTrashClick = (item: InboxItem) => {
    inboxStorage.remove(item.id);
    goBack();
  };

  const handleProjectClick = (item: InboxItem) => {
    const id = projectsStorage.create({
      title: item.title,
      notes: "",
      done: false,
    });

    inboxStorage.remove(item.id);

    navigate(`/projects/${id}`);
  };

  const handleNextActionsClick = (item: InboxItem) => {
    const id = nextActionsStorage.create({
      title: item.title,
      done: false,
      notes: "",
    });

    inboxStorage.remove(item.id);

    navigate(`/next-actions/${id}`);
  };

  const handleSomedayClick = (item: InboxItem) => {
    const id = nextActionsStorage.create({
      title: item.title,
      done: false,
      notes: "",
      someday: true,
    });

    inboxStorage.remove(item.id);

    navigate(`/someday/${id}`);
  };

  const handleWaitingForClick = (item: InboxItem) => {
    const id = nextActionsStorage.create({
      title: item.title,
      done: false,
      notes: "",
      waitingFor: true,
    });

    inboxStorage.remove(item.id);

    navigate(`/waiting-for/${id}`);
  };

  const handleCalendarClick = (item: InboxItem) => {
    const id = calendarStorage.create({
      title: item.title,
      date: "",
      done: false,
      notes: "",
    });

    inboxStorage.remove(item.id);

    navigate(`/calendar/${id}`);
  };

  const handleReferenceClick = (item: InboxItem) => {
    navigate(`/inbox/${item.id}/reference-decide`);
  };

  return (
    <DetailPage<InboxItem>
      heading="Inbox"
      path="/inbox"
      storageKey={INBOX_STORAGE_KEY}
      fields={[
        (item, save) => (
          <>
            <div className="block">timer: {seconds}s</div>
            <textarea
              spellCheck={false}
              className="textarea block"
              rows={1}
              placeholder="title"
              value={item.title ?? ""}
              onChange={(event) => save("title", event.target.value)}
            />
            <div className="block field is-grouped">
              <p className="control">
                <button
                  className="button is-success is-small is-light"
                  onClick={() => handleDone(item)}
                >
                  done
                </button>
              </p>
              <p className="control">
                <button
                  className="button is-small is-light"
                  onClick={() => handleNextActionsClick(item)}
                >
                  next actions
                </button>
              </p>
              <p className="control">
                <button
                  className="button is-small is-light"
                  onClick={() => handleCalendarClick(item)}
                >
                  calendar
                </button>
              </p>
              <p className="control">
                <button
                  className="button is-small is-light"
                  onClick={() => handleProjectClick(item)}
                >
                  project
                </button>
              </p>
              <p className="control">
                <button
                  className="button is-small is-light"
                  onClick={() => handleSomedayClick(item)}
                >
                  someday maybe
                </button>
              </p>
              <p className="control">
                <button
                  className="button is-small is-light"
                  onClick={() => handleWaitingForClick(item)}
                >
                  waiting for
                </button>
              </p>
              <p className="control">
                <button
                  className="button is-small is-light"
                  onClick={() => handleReferenceClick(item)}
                >
                  reference
                </button>
              </p>
              <p className="control">
                <button
                  className="button is-danger is-small is-light"
                  onClick={() => handleTrashClick(item)}
                >
                  trash
                </button>
              </p>
            </div>
          </>
        ),
      ]}
    />
  );
}
