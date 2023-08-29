import BuddyForm from "@/components/templates/BuddyForm";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { fill } from "../__utils__/common";

const submit = jest.fn();
afterEach(() => {
  submit.mockClear();
});

describe("BuddyForm", () => {
  it("ssucceeds in submitting a buddy", async () => {
    render(<BuddyForm onSubmit={submit} />);
    fill(screen.getByLabelText("名前"), "JAI");
    const submitButton = screen.getByText("次へ");
    fireEvent.click(submitButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  });

  it("fails to submit a buddy when name is empty", async () => {
    render(<BuddyForm onSubmit={submit} />);
    const submitButton = screen.getByText("次へ");
    fireEvent.click(submitButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(0));
  });

  it("snapshot", async () => {
    const tree = render(<BuddyForm onSubmit={submit} />);
    expect(tree).toMatchSnapshot();
  });
});
