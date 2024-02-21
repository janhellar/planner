import { range, uniq } from "lodash";
import { useCallback, useState } from "react";

interface Keys {
  shiftKey?: boolean;
  metaKey?: boolean;
  ctrlKey?: boolean;
}

export default function useListSelect() {
  const [selected, setSelected] = useState<number[]>([]);

  const [lastSelected, setLastSelected] = useState<number>();

  const select = useCallback(
    (index: number, keys: Keys = {}) => {
      const metaKey = navigator.platform.startsWith("Mac")
        ? keys.metaKey
        : keys.ctrlKey;

      if (selected.includes(index)) {
        if (metaKey) {
          setSelected(
            selected.filter((selectedIndex) => selectedIndex !== index)
          );
        } else if (selected.length > 1) {
          setSelected([index]);
          setLastSelected(index);
        } else {
          setSelected([]);
        }
      } else {
        if (keys.shiftKey && lastSelected !== undefined) {
          const indexA = lastSelected;
          const indexB = index;

          const [start, end] =
            indexA > indexB ? [indexB, indexA] : [indexA, indexB];

          const indexes = range(start, end + 1);

          setSelected(uniq([...selected, ...indexes]));
        } else if (metaKey) {
          setSelected([...selected, index]);
          setLastSelected(index);
        } else {
          setSelected([index]);
          setLastSelected(index);
        }
      }
    },
    [selected, lastSelected]
  );

  const unselectAll = useCallback(() => {
    setSelected([]);
  }, []);

  return { selected, select, unselectAll };
}
