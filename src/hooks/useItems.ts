import { useCallback, useEffect, useState } from "react";
import { StorageItem } from "utils/LocalStorage";
import useStorage from "./useStorage";

export default function useItems<I extends StorageItem>(
  storage: ReturnType<typeof useStorage<I>>
) {
  const [items, setItems] = useState<I[]>([]);

  const loadItems = useCallback(() => {
    setItems(storage.list());
  }, [storage]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return { items, reloadItems: loadItems };
}
