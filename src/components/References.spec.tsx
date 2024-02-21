import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockReferenceList } from "utils/__mocks__/LocalStorage";
import { vi } from "vitest";
import References from "./References";

vi.mock("utils/LocalStorage");

describe("References", () => {
  it("should show references titles", () => {
    mockReferenceList.mockReturnValue([
      { id: 0, title: "test 0" },
      { id: 1, title: "test 1" },
    ]);

    render(
      <MemoryRouter>
        <References />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(1 + 2);
    expect(screen.getByText("test 0")).toBeInTheDocument();
  });
});
