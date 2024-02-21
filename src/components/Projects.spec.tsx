import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import {
  mockCalendarList,
  mockHabitsList,
  mockNextActionsList,
  mockNextActionsRemove,
  mockProjectsList,
} from "utils/__mocks__/LocalStorage";

import Projects from "./Projects";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

vi.mock("utils/LocalStorage");

describe("Projects", () => {
  beforeEach(() => {
    mockProjectsList.mockReturnValue([]);
    mockNextActionsList.mockReturnValue([]);
    mockCalendarList.mockReturnValue([]);
    mockHabitsList.mockReturnValue([]);
  });

  it("should show list of project titles", () => {
    mockProjectsList.mockReturnValue([{ id: 0, title: "test" }]);

    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("should remove child next actions on project remove", async () => {
    mockProjectsList.mockReturnValue([{ id: 0, title: "test" }]);

    mockNextActionsList.mockReturnValue([
      { id: 0, title: "na1", projectId: 2 },
      { id: 1, title: "na2", projectId: 0 },
    ]);

    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByText("test"));
    await userEvent.click(screen.getByRole("button", { name: "remove" }));

    expect(mockNextActionsRemove).toHaveBeenCalledWith(1);
  });

  it("should highlight projects with no next action", () => {
    mockProjectsList.mockReturnValue([{ id: 0, title: "test" }]);

    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );

    expect(screen.getByText("without actions")).toBeInTheDocument();
  });
});
