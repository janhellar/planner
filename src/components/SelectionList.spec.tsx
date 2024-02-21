import { render, screen } from "@testing-library/react";
import SelectionList from "./SelectionList";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

function Wrapper() {
  const [selected, setSelected] = useState<number[]>([]);

  return (
    <SelectionList
      items={[{ id: 1 }, { id: 2 }, { id: 3 }]}
      selected={selected}
      onSelect={setSelected}
      renderItem={(item) => <span>{item.id}</span>}
    />
  );
}

describe("SelectionList", () => {
  it("should allow selection of items", async () => {
    render(<Wrapper />);

    await userEvent.click(screen.getByText("2"));

    const [item1, item2, item3] = screen.getAllByRole("listitem");

    expect(item1).not.toHaveClass("selected");
    expect(item2).toHaveClass("selected");
    expect(item3).not.toHaveClass("selected");
  });

  it("should allow selection with shift key", async () => {
    const user = userEvent.setup();

    render(<Wrapper />);

    await userEvent.click(screen.getByText("2"));
    await user.keyboard("{Shift>}");
    await user.click(screen.getByText("3"));
    await user.keyboard("{/Shift}");

    const [item1, item2, item3] = screen.getAllByRole("listitem");

    expect(item1).not.toHaveClass("selected");
    expect(item2).toHaveClass("selected");
    expect(item3).toHaveClass("selected");
  });

  it("should unselect items on click outside", async () => {
    render(<Wrapper />);

    await userEvent.click(screen.getByText("2"));
    await userEvent.click(screen.getByRole("list"));

    const [item1, item2, item3] = screen.getAllByRole("listitem");

    expect(item1).not.toHaveClass("selected");
    expect(item2).not.toHaveClass("selected");
    expect(item3).not.toHaveClass("selected");
  });
});
