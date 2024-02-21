import { Reference } from "entities";
import { REFERENCE_STORAGE_KEY } from "storageKeys";
import DetailPage from "./DetailPage";

export default function ReferenceDetail() {
  return (
    <DetailPage<Reference>
      heading="References"
      path="/references"
      storageKey={REFERENCE_STORAGE_KEY}
      fields={["title", "notes"]}
    />
  );
}
