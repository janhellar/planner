import { Reference } from "entities";
import { REFERENCE_STORAGE_KEY } from "storageKeys";
import LocalStorage from "utils/LocalStorage";
import ListPage from "./ListPage";

export default function References() {
  const createReference = (storage: LocalStorage<Reference>, title: string) =>
    storage.create({
      title,
      notes: "",
    });

  return (
    <ListPage
      heading="References"
      path="/references"
      storageKey={REFERENCE_STORAGE_KEY}
      createItem={createReference}
      hideCheckboxes
    />
  );
}
