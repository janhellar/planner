import { NextAction } from "entities";
import { NEXT_ACTIONS_STORAGE_KEY } from "storageKeys";
import ListPage from "./ListPage";
import LocalStorage from "utils/LocalStorage";

interface Props {
  projectId?: number;
}

export default function WaitingFor(props: Props) {
  const createNextAction = (storage: LocalStorage<NextAction>, title: string) =>
    storage.create({
      title,
      done: false,
      notes: "",
      waitingFor: true,
      projectId: props.projectId,
    });

  return (
    <ListPage
      heading="Waiting For"
      path="/waiting-for"
      storageKey={NEXT_ACTIONS_STORAGE_KEY}
      createItem={createNextAction}
      filterFn={(item) => Boolean(item.waitingFor)}
      showPriorities
      projectId={props.projectId}
    />
  );
}
