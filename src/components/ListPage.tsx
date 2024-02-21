import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useStorage from "hooks/useStorage";
import useItems from "hooks/useItems";
import { partition } from "lodash";
import SelectionList from "./SelectionList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { StorageItem } from "utils/LocalStorage";
import { Priority, Project } from "entities";
import { PROJECTS_STORAGE_KEY } from "storageKeys";

import styles from "./ListPage.module.css";

interface TodoItem extends StorageItem {
  title: string;
  done?: boolean;
  projectId?: number;
  priority?: Priority;
}

interface Props<I extends TodoItem> {
  storageKey: string;
  heading: string;
  path: string;
  projectId?: number;
  hideCheckboxes?: boolean;
  showPriorities?: boolean;
  renderItemPrefix?(item: I): React.ReactNode;
  renderItemSuffix?(item: I): React.ReactNode;
  renderActions?(): React.ReactNode;
  renderHeader?(
    storage: ReturnType<typeof useStorage<I>>,
    reloadItems: () => void
  ): React.ReactNode;
  sortFn?(a: I, b: I): number;
  filterFn?(item: I): boolean;
  createItem(storage: ReturnType<typeof useStorage<I>>, title: string): number;
  setDone?(item: I, done: boolean): I;
  getDone?(item: I): boolean;
  onRemove?(id: number): void;
}

const bgColorByPriority = {
  A: "has-background-danger-light",
  B: "has-background-warning-light",
  C: "has-background-success-light",
  D: "has-background-info-light",
  E: "has-background-link-light",
  inherit: "",
};

function trimLine(line: string) {
  return line
    .trim()
    .replace(/^- \[ \] /, "")
    .replace(/^- /, "");
}

export default function ListPage<I extends TodoItem>(props: Props<I>) {
  const {
    storageKey,
    heading,
    path,
    hideCheckboxes,
    showPriorities,
    renderItemPrefix,
    renderItemSuffix,
    renderActions,
    renderHeader,
    sortFn,
    filterFn,
    createItem,
    setDone,
    getDone,
    onRemove,
  } = props;

  const [selected, setSelected] = useState<number[]>([]);
  const storage = useStorage<I>(storageKey);
  const { items, reloadItems } = useItems(storage);
  const [keepPositionItem, setKeepPositionItem] = useState<number>();

  const navigate = useNavigate();

  const navigateToDetail = (id: number) => {
    navigate(`${path}/${id}`);
  };

  const projectsStorage = useStorage<Project>(PROJECTS_STORAGE_KEY);
  const { items: projects } = useItems(projectsStorage);

  const getProject = (id: number) =>
    projects.find((project) => project.id === id);

  const getPriority = (item: I) => {
    const parentProject =
      item.projectId !== undefined ? getProject(item.projectId) : undefined;

    return (
      (item.priority === "inherit" || item.priority === undefined
        ? parentProject?.priority
        : item.priority) ?? "C"
    );
  };

  const updateDone = (item: I, event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    keepPositionItem === undefined
      ? setKeepPositionItem(item.id)
      : setKeepPositionItem(undefined);

    storage.update(
      setDone ? setDone(item, checked) : { ...item, done: checked }
    );

    reloadItems();
  };

  const renderItemTitle = (item: I) => (
    <>
      {renderItemPrefix?.(item)}
      {item.projectId !== undefined && props.projectId === undefined && (
        <>
          <u>{getProject(item.projectId)?.title || <i>empty</i>}</u>
          {" - "}
        </>
      )}
      {item.title || <i>empty</i>}
      {renderItemSuffix?.(item)}
    </>
  );

  const renderItem = (item: I) => {
    const priority = getPriority(item);
    const itemDone = getDone ? getDone(item) : item.done;

    return (
      <>
        {!hideCheckboxes && (
          <label
            className="p-2 is-flex is-justify-content-center is-flex-direction-column"
            onClick={(event) => event.stopPropagation()}
            onMouseLeave={() =>
              keepPositionItem === item.id && setKeepPositionItem(undefined)
            }
          >
            <input
              spellCheck={false}
              className="is-hidden"
              type="checkbox"
              checked={itemDone}
              onChange={(event) => updateDone(item, event)}
              onClick={(event) => event.stopPropagation()}
            />
            <FontAwesomeIcon
              className={classNames(
                itemDone ? "has-text-success-dark" : "has-text-grey",
                "is-size-6"
              )}
              icon={itemDone ? faCircleCheck : faCircle}
            />
          </label>
        )}
        {showPriorities && (
          <span
            className={`${styles.priority} m-2 pl-1 pr-1 ${bgColorByPriority[priority]}`}
          >
            {priority}
          </span>
        )}
        <span
          className={classNames("is-block", "p-2", {
            "has-text-grey": itemDone,
          })}
        >
          {renderItemTitle(item)}
        </span>
      </>
    );
  };

  const filteredItems = filterFn ? items.filter(filterFn) : items;

  const sortedItems = sortFn
    ? filteredItems.sort(sortFn)
    : filteredItems.sort((a, b) =>
        getPriority(a).localeCompare(getPriority(b))
      );

  const projectItems =
    props.projectId !== undefined
      ? sortedItems.filter(({ projectId }) => projectId === props.projectId)
      : sortedItems;

  const [doneItems, pendingItems] = partition(projectItems, (item) => {
    const done = getDone ? getDone(item) : item.done;

    return keepPositionItem === item.id ? !done : done;
  });

  const removeSelected = () => {
    selected.forEach((id) => {
      storage.remove(id);
      onRemove?.(id);
    });
    reloadItems();
    setSelected([]);
  };

  const [input, setInput] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleInputKey = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const lines = input.trim().split("\n");
      const titles = lines.map(trimLine);

      titles.map((title) => createItem?.(storage, title));

      reloadItems();
      setInput("");
    }
  };

  return (
    <>
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li className="is-active">
            <Link to={path}>{heading}</Link>
          </li>
        </ul>
      </nav>
      {renderHeader?.(storage, reloadItems)}
      <textarea
        spellCheck={false}
        className="textarea block"
        value={input}
        rows={1}
        autoFocus={props.projectId === undefined}
        placeholder="New item(s)"
        onChange={handleInputChange}
        onKeyDown={handleInputKey}
      />
      <div className="block field is-grouped is-align-items-center">
        <p className="control">
          <button
            className={classNames("button", "is-small", "is-light", {
              "is-danger": selected.length > 0,
            })}
            onClick={removeSelected}
            disabled={selected.length === 0}
          >
            remove
          </button>
        </p>
        {renderActions?.()}
      </div>
      <SelectionList
        shrink={props.projectId !== undefined}
        items={[...pendingItems, ...doneItems]}
        selected={selected}
        onSelect={setSelected}
        onDoubleClick={(item) => navigateToDetail(item.id)}
        renderItem={renderItem}
      />
    </>
  );
}
