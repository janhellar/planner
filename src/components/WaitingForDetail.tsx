import { NextAction } from "entities";
import { NEXT_ACTIONS_STORAGE_KEY } from "storageKeys";
import DetailPage from "./DetailPage";

export default function WaitingForDetail() {
  return (
    <DetailPage<NextAction>
      heading="Waiting For"
      path="/waiting-for"
      storageKey={NEXT_ACTIONS_STORAGE_KEY}
      fields={["title", "notes", "priority"]}
    />
  );
}
