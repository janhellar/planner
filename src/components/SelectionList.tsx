import classNames from "classnames";
import { curry, range, uniq } from "lodash";
import { useMemo, useState } from "react";

import styles from "./SelectionList.module.css";

interface ItemWithId {
  id: number;
}

interface Props<I> {
  shrink?: boolean;
  items: I[];
  selected: number[];
  onSelect(selected: number[]): void;
  onDoubleClick?(item: I): void;
  renderItem(item: I): React.ReactNode;
}

export default function SelectionList<I extends ItemWithId>(props: Props<I>) {
  const {
    shrink,
    items,
    selected: selectedIds,
    onSelect: onSelectIds,
    onDoubleClick,
    renderItem,
  } = props;

  const [lastSelected, setLastSelected] = useState<number>();

  const selected = useMemo(
    () => selectedIds.map((id) => items.findIndex((item) => item.id === id)),
    [items, selectedIds]
  );

  const onSelect = (indexes: number[]) => {
    const ids = indexes.map((index) => items[index].id);

    onSelectIds(ids);
  };

  const select = (index: number, keys: React.MouseEvent) => {
    const metaKey = navigator.platform.startsWith("Mac")
      ? keys.metaKey
      : keys.ctrlKey;

    if (selected.includes(index)) {
      if (metaKey) {
        onSelect(selected.filter((selectedIndex) => selectedIndex !== index));
      } else if (selected.length > 1) {
        onSelect([index]);
        setLastSelected(index);
      } else {
        onSelect([]);
      }
    } else {
      if (keys.shiftKey && lastSelected !== undefined) {
        const indexA = lastSelected;
        const indexB = index;

        const [start, end] =
          indexA > indexB ? [indexB, indexA] : [indexA, indexB];

        const indexes = range(start, end + 1);

        onSelect(uniq([...selected, ...indexes]));
      } else if (metaKey) {
        onSelect([...selected, index]);
        setLastSelected(index);
      } else {
        onSelect([index]);
        setLastSelected(index);
      }
    }
  };

  const handleItemClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    select(index, event);
  };

  const unselectAll = () => onSelectIds([]);

  return (
    <ul
      className={classNames("block", {
        "is-flex-grow-1": !shrink,
      })}
      onClick={unselectAll}
    >
      {items.map((item, index) => (
        <li
          key={item.id}
          className={classNames("is-flex is-align-items-center", styles.item, {
            selected: selected.includes(index),
            [styles.selected]: selected.includes(index),
          })}
          onClick={curry(handleItemClick)(index)}
          onDoubleClick={() => onDoubleClick?.(item)}
        >
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}
