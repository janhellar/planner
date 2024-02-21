import { vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import {
  mockInboxCreate,
  mockInboxList,
  mockInboxRemove,
} from "utils/__mocks__/LocalStorage";

import Inbox from "./Inbox";

vi.mock("utils/LocalStorage");

function renderInbox() {
  render(
    <MemoryRouter>
      <Inbox />
    </MemoryRouter>
  );
}

describe("Inbox", () => {
  beforeEach(() => {
    mockInboxList.mockReturnValue([]);
    mockInboxCreate.mockReturnValue(0);
  });

  it("should show new todo input", () => {
    renderInbox();

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should create new todo item", async () => {
    renderInbox();

    const input = screen.getByRole("textbox");

    await userEvent.type(input, "test todo{enter}");

    expect(mockInboxCreate).toHaveBeenCalledWith({
      title: "test todo",
      done: false,
    });
  });

  it("should clear input after new todo was created", async () => {
    renderInbox();

    const input = screen.getByRole("textbox");

    await userEvent.type(input, "test todo{enter}");

    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("should load todos from storge initially", () => {
    mockInboxList.mockReturnValue([{ id: 0, title: "test", done: false }]);

    renderInbox();

    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("should save new todo to storage", async () => {
    renderInbox();

    const input = screen.getByRole("textbox");

    await userEvent.type(input, "test{enter}");

    expect(mockInboxCreate).toHaveBeenCalledWith({
      title: "test",
      done: false,
    });
  });

  it("should place done todos at the end of the list", () => {
    mockInboxList.mockReturnValue([
      { id: 0, title: "test 1", done: true },
      { id: 1, title: "test 2", done: false },
    ]);

    renderInbox();

    const [lastItem] = screen.getAllByText(/test/).reverse();

    expect(lastItem).toHaveTextContent("test 1");
  });

  it("should split multiple lines to multiple inbox items when adding new", async () => {
    mockInboxCreate.mockReturnValueOnce(0);
    mockInboxCreate.mockReturnValueOnce(1);
    mockInboxCreate.mockReturnValueOnce(2);

    renderInbox();

    const input = `
      item 1
      - item 2
      - [ ] item 3
    `;

    fireEvent.change(screen.getByRole("textbox"), { target: { value: input } });
    await userEvent.type(screen.getByRole("textbox"), "{enter}");

    expect(mockInboxCreate).toHaveBeenCalledWith({
      title: "item 1",
      done: false,
    });

    expect(mockInboxCreate).toHaveBeenCalledWith({
      title: "item 2",
      done: false,
    });

    expect(mockInboxCreate).toHaveBeenCalledWith({
      title: "item 3",
      done: false,
    });
  });

  it("should bulk remove items", async () => {
    mockInboxList.mockReturnValue([
      { id: 0, title: "test 1", done: false },
      { id: 1, title: "test 2", done: false },
    ]);

    const user = userEvent.setup();

    renderInbox();

    const [_nav, item1, item2] = screen.getAllByRole("listitem");

    await user.click(within(item1).getByText(/test/));
    await user.keyboard("{Shift>}");
    await user.click(within(item2).getByText(/test/));
    await user.keyboard("{/Shift}");

    await user.click(screen.getByRole("button", { name: "remove" }));

    expect(mockInboxRemove).toHaveBeenCalledWith(0);
    expect(mockInboxRemove).toHaveBeenCalledWith(1);
  });
});
