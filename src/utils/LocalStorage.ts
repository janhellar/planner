export interface StorageItem {
  id: number;
}

export default class LocalStorage<I extends StorageItem> {
  private readonly storageKey: string;
  private readonly lastIdKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.lastIdKey = `${storageKey}-last-id`;
  }

  create(item: Omit<I, "id">): number {
    const itemsString = localStorage.getItem(this.storageKey) ?? "[]";
    const items = JSON.parse(itemsString);

    const lastId = localStorage.getItem(this.lastIdKey) ?? "0";
    const newId = Number(lastId) + 1;

    const newItem = { ...item, id: newId };

    items.push(newItem);

    localStorage.setItem(this.lastIdKey, newId.toString());
    localStorage.setItem(this.storageKey, JSON.stringify(items));

    return newId;
  }

  read(id: number): I | undefined {
    const itemsString = localStorage.getItem(this.storageKey) ?? "[]";
    const items = JSON.parse(itemsString) as I[];

    return items.find((item) => item.id === id);
  }

  update(item: I): void {
    const itemsString = localStorage.getItem(this.storageKey) ?? "[]";
    const items = JSON.parse(itemsString) as I[];
    const index = items.findIndex(({ id }) => id === item.id);

    if (index >= 0) {
      items[index] = item;

      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }
  }

  remove(id: number): void {
    const itemsString = localStorage.getItem(this.storageKey) ?? "[]";
    const items = JSON.parse(itemsString) as I[];
    const index = items.findIndex((item) => item.id === id);

    if (index >= 0) {
      items.splice(index, 1);

      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }
  }

  list(): I[] {
    const itemsString = localStorage.getItem(this.storageKey) ?? "[]";

    return JSON.parse(itemsString);
  }
}
