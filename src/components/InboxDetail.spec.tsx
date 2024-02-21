import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, vi } from "vitest";

import {
  mockInboxRead,
  mockInboxUpdate,
  mockInboxRemove,
  mockProjectsCreate,
  mockNextActionsCreate,
  mockProjectsList,
  mockInboxCreate,
} from "utils/__mocks__/LocalStorage";

import InboxDetail from "./InboxDetail";

vi.mock("utils/LocalStorage");

function renderInboxItemDetail() {
  render(
    <MemoryRouter initialEntries={["/inbox/0"]}>
      <Routes>
        <Route path="/inbox/:todoId" element={<InboxDetail />} />
        <Route path="/inbox" element={<h1>inbox</h1>} />
        <Route path="/projects/:id" element={<h1>project detail</h1>} />
        <Route path="/next-actions/:id" element={<h1>next action detail</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("InboxDetail", () => {
  beforeEach(() => {
    mockInboxRead.mockReturnValue({
      id: 0,
      title: "test",
      done: false,
    });

    mockProjectsList.mockReturnValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should show timer", () => {
    renderInboxItemDetail();

    expect(screen.getByText(/timer/)).toBeInTheDocument();
  });

  it("should show 120s initially with timer", () => {
    renderInboxItemDetail();

    expect(screen.getByText(/timer/)).toHaveTextContent(/120s/);
  });

  it("should count down 2min", () => {
    vi.useFakeTimers();

    renderInboxItemDetail();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    vi.useRealTimers();

    const text = screen.getByText(/timer/).innerHTML.replace("timer: ", "");

    expect(parseInt(text)).toBeLessThan(120);
  });

  it("should stop counting down when reaching 0", () => {
    vi.useFakeTimers();

    renderInboxItemDetail();

    act(() => {
      vi.advanceTimersByTime(125 * 1000);
    });

    vi.useRealTimers();

    expect(screen.getByText(/timer/)).toHaveTextContent(/0s/);
  });

  it("should be possible to update item title", () => {
    mockInboxRead.mockReturnValue({
      id: 0,
      title: "test",
      done: false,
    });

    vi.useFakeTimers();

    renderInboxItemDetail();

    const input = screen.getByPlaceholderText("title");

    fireEvent.change(input, { target: { value: "update" } });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    vi.useRealTimers();

    expect(mockInboxUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ title: "update" })
    );
  });

  it("should save immediately if going back", async () => {
    mockInboxRead.mockReturnValue({
      id: 0,
      title: "test",
      done: false,
    });

    renderInboxItemDetail();

    const input = screen.getByPlaceholderText("title");

    await userEvent.clear(input);
    await userEvent.type(input, "test update");
    await userEvent.click(screen.getByText("Inbox"));

    expect(mockInboxUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ title: "test update" })
    );
  });

  it('should save change on "done" click', async () => {
    mockInboxRead.mockReturnValue({
      id: 0,
      title: "test",
      done: false,
    });

    renderInboxItemDetail();

    await userEvent.click(screen.getByRole("button", { name: "done" }));

    expect(mockInboxUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ done: true })
    );
  });

  it("should go back on checkbox click", async () => {
    mockInboxRead.mockReturnValue({
      id: 0,
      title: "test",
      done: false,
    });

    renderInboxItemDetail();

    await userEvent.click(screen.getByRole("button", { name: "done" }));

    expect(screen.getByRole("heading", { name: "inbox" })).toBeInTheDocument();
  });

  it("should remove item from storage when trashed", async () => {
    mockInboxRead.mockReturnValue({
      id: 0,
      title: "test",
      done: false,
      actionable: false,
    });

    renderInboxItemDetail();

    await userEvent.click(screen.getByRole("button", { name: "trash" }));

    expect(mockInboxRemove).toHaveBeenCalledWith(0);
  });

  it("should go back to inbox list when item trashed", async () => {
    mockInboxRead.mockReturnValue({
      id: 0,
      title: "test",
      done: false,
      actionable: false,
    });

    renderInboxItemDetail();

    await userEvent.click(screen.getByRole("button", { name: "trash" }));

    expect(screen.getByRole("heading", { name: "inbox" })).toBeInTheDocument();
  });

  it('should show "project" button for multi-step item', () => {
    mockInboxRead.mockReturnValue({
      id: 0,
      title: "test",
      done: false,
      multiStep: true,
    });

    renderInboxItemDetail();

    expect(screen.getByRole("button", { name: "project" })).toBeInTheDocument();
  });

  it('should create project item in storage on "project" button click', async () => {
    mockInboxRead.mockReturnValue({
      id: 0,
      title: "test",
    });

    renderInboxItemDetail();

    await userEvent.click(screen.getByRole("button", { name: "project" }));

    expect(mockProjectsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "test",
        done: false,
        notes: "",
      })
    );
  });

  it("should remove original inbox item when moved to projects", async () => {
    mockInboxRead.mockReturnValue({
      id: 0,
      title: "test",
      multiStep: true,
    });

    renderInboxItemDetail();

    await userEvent.click(screen.getByRole("button", { name: "project" }));

    expect(mockInboxRemove).toHaveBeenCalledWith(0);
  });

  it("should go back to inbox after project has been created", async () => {
    mockInboxRead.mockReturnValue({
      id: 0,
      title: "test",
      multiStep: true,
    });

    renderInboxItemDetail();

    await userEvent.click(screen.getByRole("button", { name: "project" }));

    expect(
      screen.getByRole("heading", { name: "project detail" })
    ).toBeInTheDocument();
  });

  it('should create next action item in storage on "next actions" button click', async () => {
    mockInboxRead.mockReturnValue({
      id: 0,
      title: "test",
    });

    mockInboxCreate.mockReturnValue(0);

    renderInboxItemDetail();

    await userEvent.click(screen.getByRole("button", { name: "next actions" }));

    expect(mockNextActionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "test",
        done: false,
        notes: "",
      })
    );
  });

  it("should debounce storage update", async () => {
    mockInboxRead.mockReturnValue({
      id: 0,
      title: "test",
      description: "test description",
      nextAction: "test action",
      actionable: false,
      done: false,
    });

    renderInboxItemDetail();

    await userEvent.clear(screen.getByPlaceholderText("title"));

    expect(mockInboxUpdate).not.toHaveBeenCalled();
  });
});
