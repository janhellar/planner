import { NextAction } from "entities";
import { NEXT_ACTIONS_STORAGE_KEY } from "storageKeys";
import DetailPage from "./DetailPage";

export default function NextActionDetail() {
  return (
    <DetailPage<NextAction>
      heading="Next Actions"
      path="/next-actions"
      storageKey={NEXT_ACTIONS_STORAGE_KEY}
      fields={["title", "notes", "priority"]}
    />
  );
}
