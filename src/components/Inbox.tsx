import { InboxItem as InboxItemEntity } from "entities";
import { INBOX_STORAGE_KEY } from "storageKeys";
import LocalStorage from "utils/LocalStorage";
import ListPage from "./ListPage";

export default function Inbox() {
  const createInboxItem = (
    storage: LocalStorage<InboxItemEntity>,
    title: string
  ) =>
    storage.create({
      title,
      done: false,
    });

  return (
    <ListPage<InboxItemEntity>
      heading="Inbox"
      path="/inbox"
      storageKey={INBOX_STORAGE_KEY}
      createItem={createInboxItem}
    />
  );
}
