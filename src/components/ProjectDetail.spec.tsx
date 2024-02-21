import { act, fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import {
  mockCalendarList,
  mockHabitsList,
  mockNextActionsCreate,
  mockNextActionsList,
  mockProjectsList,
  mockProjectsRead,
  mockProjectsUpdate,
} from "utils/__mocks__/LocalStorage";

import ProjectDetail from "./ProjectDetail";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

vi.mock("utils/LocalStorage");

function renderProjectDetail() {
  render(
    <MemoryRouter initialEntries={["/projects/0"]}>
      <Routes>
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/next-actions/:id" element={<h1>next action detail</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProjectDetail", () => {
  beforeEach(() => {
    mockNextActionsList.mockReturnValue([]);
    mockCalendarList.mockReturnValue([]);
    mockProjectsList.mockReturnValue([]);
    mockHabitsList.mockReturnValue([]);
  });

  it("should be possible to update project title", () => {
    mockProjectsRead.mockReturnValue({
      id: 0,
      title: "test",
    });

    vi.useFakeTimers();

    renderProjectDetail();

    const input = screen.getByPlaceholderText("title");

    fireEvent.change(input, { target: { value: "update" } });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    vi.useRealTimers();

    expect(mockProjectsUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ title: "update" })
    );
  });

  it("should list next actions for project", async () => {
    mockProjectsRead.mockReturnValue({
      id: 0,
      title: "test",
    });

    mockNextActionsList.mockReturnValue([
      {
        id: 0,
        title: "action",
        projectId: 0,
      },
    ]);

    renderProjectDetail();

    expect(screen.getByText("action")).toBeInTheDocument();
  });
});
