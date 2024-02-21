import { act, renderHook } from "@testing-library/react";

import useListSelect from "./useListSelect";

describe("useListSelect", () => {
  it("should select item", () => {
    const { result } = renderHook(() => useListSelect());

    act(() => {
      result.current.select(1);
    });

    expect(result.current.selected).toEqual([1]);
  });

  it("should unselect item", () => {
    const { result } = renderHook(() => useListSelect());

    act(() => {
      result.current.select(1);
    });

    act(() => {
      result.current.select(1);
    });

    expect(result.current.selected).toEqual([]);
  });

  it("should select different item", () => {
    const { result } = renderHook(() => useListSelect());

    act(() => {
      result.current.select(1);
    });

    act(() => {
      result.current.select(2);
    });

    expect(result.current.selected).toEqual([2]);
  });

  it("should select multiple items", () => {
    const { result } = renderHook(() => useListSelect());

    act(() => {
      result.current.select(1);
    });

    act(() => {
      result.current.select(3, { metaKey: true, ctrlKey: true });
    });

    expect(result.current.selected).toEqual([1, 3]);
  });

  it("should shift select items", () => {
    const { result } = renderHook(() => useListSelect());

    act(() => {
      result.current.select(1);
    });

    act(() => {
      result.current.select(3, { shiftKey: true });
    });

    expect(result.current.selected).toEqual([1, 2, 3]);
  });

  it("should select item when multiple are selected previously", () => {
    const { result } = renderHook(() => useListSelect());

    act(() => {
      result.current.select(1);
    });

    act(() => {
      result.current.select(3, { shiftKey: true });
    });

    act(() => {
      result.current.select(1);
    });

    expect(result.current.selected).toEqual([1]);
  });

  it("should unselect item with meta key when multiple selected previously", () => {
    const { result } = renderHook(() => useListSelect());

    act(() => {
      result.current.select(1);
    });

    act(() => {
      result.current.select(3, { shiftKey: true });
    });

    act(() => {
      result.current.select(1, { metaKey: true, ctrlKey: true });
    });

    expect(result.current.selected).toEqual([2, 3]);
  });
});
