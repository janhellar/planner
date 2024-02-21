import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

import useOnUnmount from "./useOnUnmount";

describe("useOnUnmount", () => {
  it("should call callback on unmount", () => {
    const callback = vi.fn();

    const { unmount } = renderHook(() => useOnUnmount(callback, []));

    unmount();

    expect(callback).toHaveBeenCalled();
  });

  it("should call latest callback if it change", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    let callback = callback1;

    const { unmount, rerender, result } = renderHook(() =>
      useOnUnmount(() => {
        callback();
      }, [callback])
    );

    callback = callback2;

    rerender();

    unmount();

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });
});
