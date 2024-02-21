import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

import LocalStorage from "utils/LocalStorage";
import { mockRead, mockUpdate } from "utils/__mocks__/LocalStorage";

import useStorageItem from "./useStorageItem";

vi.mock("utils/LocalStorage");

describe("useStorageItem", () => {
  it("should return item", () => {
    const storage = new LocalStorage("");
    const item = { id: 0 };

    mockRead.mockReturnValue(item);

    const { result } = renderHook(() => useStorageItem(storage, 0));

    expect(result.current.item).toEqual(item);
  });

  it("should update item on change", () => {
    const storage = new LocalStorage<{ id: number; title: string }>("");
    const item = { id: 0, title: "test" };

    mockRead.mockReturnValue(item);

    vi.useFakeTimers();

    const { result } = renderHook(() => useStorageItem(storage, 0));

    act(() => {
      result.current.saveDebounced("title", "up");

      vi.advanceTimersByTime(100);

      result.current.saveDebounced("title", "update");

      vi.advanceTimersByTime(1000);
    });

    vi.useRealTimers();

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({ id: 0, title: "update" });
  });
});
