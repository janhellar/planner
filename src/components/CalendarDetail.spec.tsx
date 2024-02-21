import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";

import {
  mockCalendarRead,
  mockCalendarUpdate,
  mockProjectsList,
} from "utils/__mocks__/LocalStorage";

import CalendarDetail from "./CalendarDetail";

vi.mock("utils/LocalStorage");

dayjs.extend(localizedFormat);

function renderCalendarDetail() {
  render(
    <MemoryRouter initialEntries={["/calendar/0"]}>
      <Routes>
        <Route path="/calendar/:calendarId" element={<CalendarDetail />} />
        <Route path="/" element={<h1>inbox</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("CalendarDetail", () => {
  beforeEach(() => {
    mockCalendarRead.mockReturnValue({
      id: 0,
      title: "test-title",
      done: false,
      date: "",
    });

    mockProjectsList.mockReturnValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should show input for updating date", () => {
    renderCalendarDetail();

    expect(screen.getByPlaceholderText("date")).toBeInTheDocument();
  });

  it("should allow updating other fields", () => {
    renderCalendarDetail();

    expect(screen.getByPlaceholderText("title")).toBeInTheDocument();
  });
});
