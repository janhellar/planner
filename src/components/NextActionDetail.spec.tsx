import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import {
  mockNextActionsRead,
  mockProjectsList,
} from "utils/__mocks__/LocalStorage";
import { vi } from "vitest";
import NextActionDetail from "./NextActionDetail";

vi.mock("utils/LocalStorage");

function renderNextActionDetail() {
  render(
    <MemoryRouter initialEntries={["/nextActions/0"]}>
      <Routes>
        <Route
          path="/nextActions/:nextActionId"
          element={<NextActionDetail />}
        />
        <Route path="/" element={<h1>inbox</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("NextActionDetail", () => {
  beforeEach(() => {
    mockProjectsList.mockReturnValue([]);
  });

  it("should show title input", () => {
    mockNextActionsRead.mockReturnValue({
      id: 0,
      title: "test",
    });

    renderNextActionDetail();

    expect(screen.getByPlaceholderText("title")).toHaveValue("test");
  });
});
