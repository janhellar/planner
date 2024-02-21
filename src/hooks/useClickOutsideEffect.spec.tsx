import { render, screen } from "@testing-library/react";
import { useRef } from "react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

import useClickOutsideEffect from "./useClickOutsideEffect";

const mockFn = vi.fn();

function TestWrapper() {
  const ref = useRef<HTMLSpanElement>(null);

  useClickOutsideEffect(
    ref,
    () => {
      mockFn();
    },
    []
  );

  return (
    <>
      <span ref={ref}>inside</span>
      <span>outside</span>
    </>
  );
}

describe("useClickOutsideEffect", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should call callback when clicked outside", async () => {
    render(<TestWrapper />);

    await userEvent.click(screen.getByText("outside"));

    expect(mockFn).toHaveBeenCalled();
  });

  it("should not call callback when clicked inside", async () => {
    render(<TestWrapper />);

    await userEvent.click(screen.getByText("inside"));

    expect(mockFn).not.toHaveBeenCalled();
  });
});
