import { vi } from "vitest";

import LocalStorage from "./LocalStorage";

const getItem = vi.spyOn(Storage.prototype, "getItem");
const setItem = vi.spyOn(Storage.prototype, "setItem");

interface TestItem {
  id: number;
  title: string;
}

const localStorage = new LocalStorage<TestItem>("test-key");

describe("create", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should add item to local storage", () => {
    localStorage.create({ title: "test item" });

    const [, value] = setItem.mock.lastCall ?? [];
    const [item] = value && JSON.parse(value);

    expect(item).toHaveProperty("title", "test item");
  });

  it("should add item to existing items", () => {
    getItem.mockImplementation((storageKey) =>
      storageKey.endsWith("last-id")
        ? "0"
        : JSON.stringify([{ id: 0, title: "test 0" }])
    );

    localStorage.create({ title: "test 1" });

    const [, value] = setItem.mock.lastCall ?? [];
    const items = value && JSON.parse(value);

    expect(items).toEqual([
      { id: 0, title: "test 0" },
      { id: 1, title: "test 1" },
    ]);
  });

  it("should update last id in storage", () => {
    getItem.mockReturnValueOnce("[]");
    getItem.mockReturnValueOnce("1");

    localStorage.create({ title: "test item" });

    expect(setItem).toHaveBeenCalledWith("test-key-last-id", "2");
  });
});

describe("read", () => {
  it("should return item from storage", () => {
    getItem.mockReturnValue(
      JSON.stringify([
        { id: 0, title: "test 0" },
        { id: 1, title: "test 1" },
      ])
    );

    const item = localStorage.read(1);

    expect(item).toEqual({ id: 1, title: "test 1" });
  });
});

describe("update", () => {
  it("should update item in storage", () => {
    getItem.mockReturnValue(
      JSON.stringify([
        { id: 0, title: "test 0" },
        { id: 1, title: "test 1" },
      ])
    );

    localStorage.update({ id: 1, title: "test update" });

    const [, value] = setItem.mock.lastCall ?? [];
    const items = value && JSON.parse(value);

    expect(items).toEqual([
      { id: 0, title: "test 0" },
      { id: 1, title: "test update" },
    ]);
  });
});

describe("delete", () => {
  it("should delete item from storage", () => {
    getItem.mockReturnValue(
      JSON.stringify([
        { id: 0, title: "test 0" },
        { id: 1, title: "test 1" },
      ])
    );

    localStorage.remove(1);

    const [, value] = setItem.mock.lastCall ?? [];
    const items = value && JSON.parse(value);

    expect(items).toEqual([{ id: 0, title: "test 0" }]);
  });
});

describe("list", () => {
  it("should return items from storage", () => {
    const storageItems = [
      { id: 0, title: "test 0" },
      { id: 1, title: "test 1" },
    ];

    getItem.mockReturnValue(JSON.stringify(storageItems));

    const items = localStorage.list();

    expect(items).toEqual(storageItems);
  });
});
