import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockList, mockProjectsList } from "utils/__mocks__/LocalStorage";
import { vi } from "vitest";
import ListPage from "./ListPage";

vi.mock("utils/LocalStorage");

function renderListPage() {
  render(
    <MemoryRouter>
      <ListPage
        heading=""
        path=""
        storageKey=""
        showPriorities
        createItem={() => 0}
      />
    </MemoryRouter>
  );
}

describe("ListPage", () => {
  it("should show priority for item if enabled", () => {
    mockList.mockReturnValue([{ id: 0, title: "test", priority: "B" }]);

    renderListPage();

    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("should sort items by priority", () => {
    mockList.mockReturnValue([
      { id: 0, title: "test 0", priority: "B" },
      { id: 1, title: "test 1", priority: "A" },
    ]);

    renderListPage();

    const [_nav, item1, item2] = screen.getAllByRole("listitem");

    expect(within(item1).getByText("A")).toBeInTheDocument();
    expect(within(item2).getByText("B")).toBeInTheDocument();
  });

  it("should take projects priority if not defined", () => {
    mockList.mockReturnValue([
      { id: 0, title: "action", projectId: 0, priority: "inherit" },
    ]);

    mockProjectsList.mockReturnValue([
      { id: 0, title: "project", priority: "B" },
    ]);

    renderListPage();

    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("should correctly sort inherited priorities", () => {
    mockList.mockReturnValue([
      { id: 0, title: "test 0", priority: "B" },
      { id: 1, title: "test 1", projectId: 0, priority: "inherit" },
    ]);

    mockProjectsList.mockReturnValue([
      { id: 0, title: "project", priority: "A" },
    ]);

    renderListPage();

    const [_nav, item1, item2] = screen.getAllByRole("listitem");

    expect(within(item1).getByText("A")).toBeInTheDocument();
    expect(within(item2).getByText("B")).toBeInTheDocument();
  });
});
