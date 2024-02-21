import { render, screen, within } from "@testing-library/react";
import { vi } from "vitest";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import {
  mockCalendarList,
  mockCalendarRead,
  mockProjectsList,
} from "utils/__mocks__/LocalStorage";

import Calendar from "./Calendar";
import CalendarDetail from "./CalendarDetail";

dayjs.extend(localizedFormat);

vi.mock("utils/LocalStorage");

function renderCalendar() {
  render(
    <MemoryRouter initialEntries={["/calendar"]}>
      <Routes>
        <Route path="/calendar/:calendarId" element={<CalendarDetail />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Calendar", () => {
  beforeEach(() => {
    mockProjectsList.mockReturnValue([]);
  });

  it("should show calendar items", () => {
    mockCalendarList.mockReturnValue([
      { id: 0, title: "test 1", done: false, notes: "" },
      { id: 1, title: "test 2", done: false, notes: "" },
    ]);

    renderCalendar();

    const [_nav, item1, item2] = screen.getAllByRole("listitem");

    expect(item1).toHaveTextContent("test 1");
    expect(item2).toHaveTextContent("test 2");
  });

  it("should show relative time", () => {
    const date = dayjs().startOf("day").format("YYYY-MM-DD");

    mockCalendarList.mockReturnValue([{ id: 0, title: "test 1", date }]);

    renderCalendar();

    expect(screen.getByText(/test 1/)).toHaveTextContent("Today");
  });

  it("should sort items by date", () => {
    mockCalendarList.mockReturnValue([
      { id: 0, title: "test 1", date: "2022-01-02" },
      { id: 1, title: "test 2", date: "2022-01-01" },
    ]);

    renderCalendar();

    const [_nav, item1, item2] = screen.getAllByRole("listitem");

    expect(item1).toHaveTextContent("test 2");
    expect(item2).toHaveTextContent("test 1");
  });

  it("should bring me to calendar item details after update button click", async () => {
    mockCalendarList.mockReturnValue([{ id: 0, title: "test 1" }]);
    mockCalendarRead.mockReturnValue({ id: 0, title: "test 1" });

    renderCalendar();

    const item = screen.getByText(/test 1/);

    await userEvent.dblClick(item);

    expect(screen.getByPlaceholderText("title")).toBeInTheDocument();
  });
});
