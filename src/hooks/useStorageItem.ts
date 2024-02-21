import { debounce } from "lodash";
import { useEffect, useState } from "react";

import LocalStorage, { StorageItem } from "utils/LocalStorage";
import useDebounce from "hooks/useDebounce";
import useStorage from "./useStorage";

export default function useStorageItem<I extends StorageItem>(
  storage: ReturnType<typeof useStorage<I>>,
  itemId: number
) {
  const [item, setItem] = useState<I>();

  useEffect(() => {
    const item = storage.read(itemId);

    setItem(item);
  }, []);

  const debounced = useDebounce(
    (updatedItem) => {
      storage.update(updatedItem);
    },
    [storage]
  );

  const save = (field: keyof I, value: any) => {
    if (item) {
      const updatedItem = {
        ...item,
        [field]: value,
      };

      setItem(updatedItem);
      storage.update(updatedItem);
    }
  };

  const saveDebounced = (field: keyof I, value: any) => {
    if (item) {
      const updatedItem = {
        ...item,
        [field]: value,
      };

      setItem(updatedItem);
      debounced(updatedItem);
    }
  };

  return {
    item,
    save,
    saveDebounced,
  };
}
