import { NextAction } from "entities";
import { NEXT_ACTIONS_STORAGE_KEY } from "storageKeys";
import DetailPage from "./DetailPage";

export default function SomedayDetail() {
  return (
    <DetailPage<NextAction>
      heading="Someday Maybe"
      path="/someday"
      storageKey={NEXT_ACTIONS_STORAGE_KEY}
      fields={["title", "notes"]}
    />
  );
}
