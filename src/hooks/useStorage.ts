import { useCallback, useContext, useMemo } from "react";
import LocalStorage, { StorageItem } from "utils/LocalStorage";
import { PersistentStorageContext } from "utils/PersistentStorage";

export default function useStorage<I extends StorageItem>(storageKey: string) {
  const storage = useMemo(() => new LocalStorage<I>(storageKey), [storageKey]);

  const remoteStorage = useContext(PersistentStorageContext);

  const create = useCallback(
    (item: Omit<I, "id">) => {
      const id = storage.create(item);
      remoteStorage?.save();
      return id;
    },
    [storage, remoteStorage]
  );

  const read = useCallback(
    (id: number) => {
      const item = storage.read(id);
      remoteStorage?.save();
      return item;
    },
    [storage, remoteStorage]
  );

  const update = useCallback(
    (item: I) => {
      storage.update(item);
      remoteStorage?.save();
    },
    [storage, remoteStorage]
  );

  const remove = useCallback(
    (id: number) => {
      storage.remove(id);
      remoteStorage?.save();
    },
    [storage, remoteStorage]
  );

  const result = useMemo(
    () => ({
      create,
      read,
      update,
      remove,
      list: storage.list.bind(storage),
    }),
    [create, read, update, remove, storage]
  );

  return result;
}
