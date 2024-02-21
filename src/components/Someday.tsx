import { NextAction } from "entities";
import { NEXT_ACTIONS_STORAGE_KEY } from "storageKeys";
import ListPage from "./ListPage";
import LocalStorage from "utils/LocalStorage";

export default function Someday() {
  const createNextAction = (storage: LocalStorage<NextAction>, title: string) =>
    storage.create({
      title,
      done: false,
      notes: "",
      someday: true,
    });

  return (
    <ListPage
      heading="Someday Maybe"
      path="/someday"
      storageKey={NEXT_ACTIONS_STORAGE_KEY}
      createItem={createNextAction}
      filterFn={(item) => Boolean(item.someday)}
    />
  );
}
