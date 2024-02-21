import { render, screen } from "@testing-library/react";
import ReferenceDecide from "./ReferenceDecide";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import {
  mockInboxRead,
  mockProjectsList,
  mockProjectsUpdate,
  mockReferenceList,
} from "utils/__mocks__/LocalStorage";

vi.mock("utils/LocalStorage");

function renderReferenceDetail() {
  render(
    <MemoryRouter initialEntries={["/inbox/0/reference-decide"]}>
      <Routes>
        <Route
          path="/inbox/:todoId/reference-decide"
          element={<ReferenceDecide />}
        />
        <Route
          path="/references/:referenceId"
          element={<h1>reference detail</h1>}
        />
        <Route path="/" element={<h1>inbox</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ReferenceDecide", () => {
  beforeEach(() => {
    mockProjectsList.mockReturnValue([]);
    mockReferenceList.mockReturnValue([]);
  });

  it("should allow creating new reference", async () => {
    mockInboxRead.mockReturnValue({ id: 0 });

    renderReferenceDetail();

    await userEvent.click(screen.getByRole("button", { name: "new" }));

    expect(
      screen.getByRole("heading", { name: "reference detail" })
    ).toBeInTheDocument();
  });

  it("should provide list of projects", () => {
    mockInboxRead.mockReturnValue({ id: 0 });
    mockProjectsList.mockReturnValue([{ id: 0, title: "test" }]);

    renderReferenceDetail();

    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("should allow adding reference to projects and/or other references", async () => {
    mockInboxRead.mockReturnValue({ id: 0, title: "reference" });
    mockProjectsList.mockReturnValue([
      { id: 0, title: "test", notes: "some note" },
    ]);

    renderReferenceDetail();

    await userEvent.click(screen.getByText("test"));
    await userEvent.click(screen.getByRole("button", { name: "add" }));

    expect(mockProjectsUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 0,
        title: "test",
        notes: "some note\nreference",
      })
    );
  });
});
