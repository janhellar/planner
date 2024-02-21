import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockHabitsList } from "utils/__mocks__/LocalStorage";
import { vi } from "vitest";
import Habits from "./Habits";

vi.mock("utils/LocalStorage");

function renderHabits() {
  render(
    <MemoryRouter>
      <Habits />
    </MemoryRouter>
  );
}

describe("Habits", () => {
  it("should show habits titles", () => {
    mockHabitsList.mockReturnValue([{ id: 0, title: "test", records: [] }]);

    renderHabits();

    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
