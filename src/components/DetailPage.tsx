import dayjs from "dayjs";
import { PRIORITIES, Priority, Project } from "entities";
import useItems from "hooks/useItems";
import useStorage from "hooks/useStorage";
import useStorageItem from "hooks/useStorageItem";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { PROJECTS_STORAGE_KEY } from "storageKeys";
import { StorageItem } from "utils/LocalStorage";

interface TodoItem extends StorageItem {
  title: string;
  notes?: string;
  done?: boolean;
  projectId?: number;
  priority?: Priority;
  date?: string;
}

interface Props<I extends TodoItem> {
  storageKey: string;
  heading: string;
  path: string;
  fields: (
    | keyof I
    | ((item: I, save: (field: keyof I, value: any) => void) => React.ReactNode)
  )[];
}

export default function DetailPage<I extends TodoItem>(props: Props<I>) {
  const { storageKey, heading, path, fields } = props;

  const params = useParams<{ id: string }>();
  const storage = useStorage<I>(storageKey);

  const projectsStorage = useStorage<Project>(PROJECTS_STORAGE_KEY);
  const { items: projects } = useItems(projectsStorage);

  const id = Number(params.id);

  const { item, saveDebounced } = useStorageItem(storage, id);

  if (!item) {
    return <></>;
  }

  const parentProject = projects.find(
    (project) => project.id === item.projectId
  );

  const renderField = (
    field:
      | keyof I
      | ((
          item: I,
          save: (field: keyof I, value: any) => void
        ) => React.ReactNode)
  ) => {
    if (field === "title") {
      return (
        <input
          autoFocus
          spellCheck={false}
          className="input"
          placeholder="title"
          value={item.title}
          onChange={(event) => saveDebounced("title", event.target.value)}
        />
      );
    }

    if (field === "notes") {
      const rows = Math.min(
        Math.max(item.notes?.split("\n").length ?? 0, 5),
        20
      );

      return (
        <textarea
          spellCheck={false}
          className="textarea is-family-monospace"
          placeholder="notes"
          value={item.notes}
          rows={rows}
          onChange={(event) => saveDebounced("notes", event.target.value)}
        />
      );
    }

    if (field === "date") {
      return (
        <input
          spellCheck={false}
          className="input"
          placeholder="date"
          type="date"
          value={item.date}
          onChange={(event) =>
            saveDebounced(
              "date",
              dayjs(event.target.value).format("YYYY-MM-DD")
            )
          }
        />
      );
    }

    if (field === "priority") {
      return (
        <div className="is-flex is-align-items-center">
          Priority:
          <div className="ml-2 select">
            <select
              value={item.priority ?? (parentProject && "inherit") ?? "C"}
              onChange={(event) =>
                saveDebounced("priority", event.target.value)
              }
            >
              {parentProject && <option value="inherit">inherit</option>}
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    }

    return typeof field === "function" && field(item, saveDebounced);
  };

  return (
    <>
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to={path}>{heading}</Link>
          </li>
          <li className="is-active">
            <Link to={`${path}/${item.id}`}>Detail</Link>
          </li>
        </ul>
      </nav>
      {parentProject && (
        <div className="block">
          Project:{" "}
          <Link to={`/projects/${parentProject.id}`}>
            {parentProject.title}
          </Link>
        </div>
      )}
      {fields.map((field, index) => (
        <div key={index} className="block">
          {renderField(field)}
        </div>
      ))}
    </>
  );
}
