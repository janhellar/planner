import { act, renderHook } from "@testing-library/react";
import { useCallback, useEffect, useState } from "react";
import { vi } from "vitest";

import useDebounce from "./useDebounce";

describe("useDebounce", () => {
  it("should debounce action", () => {
    const action = vi.fn();

    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useDebounce(() => {
        action();
      }, [])
    );

    act(() => {
      result.current();

      vi.advanceTimersByTime(1000);
    });

    vi.useRealTimers();

    expect(action).toHaveBeenCalled();
  });

  it("should not call action immediately", () => {
    const action = vi.fn();

    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useDebounce(() => {
        action();
      }, [])
    );

    act(() => {
      result.current();

      vi.advanceTimersByTime(200);
    });

    vi.useRealTimers();

    expect(action).not.toHaveBeenCalled();
  });

  it("should call action immediately on unmount", () => {
    const action = vi.fn();

    const { unmount, result } = renderHook(() =>
      useDebounce(() => {
        action();
      }, [])
    );

    act(() => {
      result.current();
    });

    unmount();

    expect(action).toHaveBeenCalled();
  });

  it("should debounce", () => {
    let action = vi.fn();

    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useDebounce((...args) => {
        action(...args);
      }, [])
    );

    act(() => {
      result.current("t");
      result.current("te");
      result.current("tes");
      result.current("test");

      vi.advanceTimersByTime(2000);
    });

    vi.useRealTimers();

    expect(action).toHaveBeenCalledTimes(1);
    expect(action).toHaveBeenCalledWith("test");
  });
});
