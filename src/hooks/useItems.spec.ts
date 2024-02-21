import { act, renderHook } from "@testing-library/react";
import LocalStorage, { StorageItem } from "utils/LocalStorage";
import { mockList } from "utils/__mocks__/LocalStorage";
import { vi } from "vitest";
import useItems from "./useItems";

vi.mock("utils/LocalStorage");

describe("useItems", () => {
  it("should load items from storage", () => {
    const testItems = [{ id: 0 }, { id: 1 }];

    mockList.mockReturnValue(testItems);

    const storage = new LocalStorage("");

    const { result } = renderHook(() => useItems<StorageItem>(storage));

    expect(result.current.items).toEqual(testItems);
  });

  it("should allow items reload", () => {
    mockList.mockReturnValue([{ id: 0 }]);

    const storage = new LocalStorage("");

    const { result } = renderHook(() => useItems<StorageItem>(storage));

    mockList.mockReturnValue([{ id: 0 }, { id: 1 }]);

    act(() => {
      result.current.reloadItems();
    });

    expect(result.current.items).toEqual([{ id: 0 }, { id: 1 }]);
  });
});
