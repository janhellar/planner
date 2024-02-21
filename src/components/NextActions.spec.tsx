import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import {
  mockNextActionsList,
  mockProjectsList,
} from "utils/__mocks__/LocalStorage";

import NextActions from "./NextActions";
import { MemoryRouter } from "react-router-dom";

vi.mock("utils/LocalStorage");

function renderNextActions() {
  render(
    <MemoryRouter>
      <NextActions />
    </MemoryRouter>
  );
}

describe("NextActions", () => {
  beforeEach(() => {
    mockNextActionsList.mockReturnValue([]);
    mockProjectsList.mockReturnValue([]);
  });

  it("should show list of next action titles", () => {
    mockNextActionsList.mockReturnValue([{ id: 0, title: "test" }]);

    renderNextActions();

    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("should include next actions from projects", () => {
    mockNextActionsList.mockReturnValue([
      { id: 0, title: "next action", projectId: 0 },
    ]);
    mockProjectsList.mockReturnValue([{ id: 0, title: "project" }]);

    renderNextActions();

    expect(screen.getByText(/project/)).toBeInTheDocument();
  });

  it("should show next action text for projects", () => {
    mockNextActionsList.mockReturnValue([
      { id: 0, title: "test", projectId: 0 },
    ]);
    mockProjectsList.mockReturnValue([{ id: 0, title: "project" }]);

    renderNextActions();

    expect(screen.getByText(/test$/)).toBeInTheDocument();
  });
});
