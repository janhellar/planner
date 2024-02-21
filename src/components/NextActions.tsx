import { NextAction } from "entities";
import { NEXT_ACTIONS_STORAGE_KEY } from "storageKeys";
import ListPage from "./ListPage";
import LocalStorage from "utils/LocalStorage";

interface Props {
  projectId?: number;
}

export default function NextActions(props: Props) {
  const createNextAction = (storage: LocalStorage<NextAction>, title: string) =>
    storage.create({
      title,
      done: false,
      notes: "",
      projectId: props.projectId,
    });

  return (
    <ListPage
      heading="Next Actions"
      path="/next-actions"
      storageKey={NEXT_ACTIONS_STORAGE_KEY}
      createItem={createNextAction}
      projectId={props.projectId}
      showPriorities
      filterFn={(item) => !item.someday && !item.waitingFor}
    />
  );
}
