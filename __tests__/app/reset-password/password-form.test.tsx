import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { fill } from "../../components/__utils__/common";
import PasswordForm from "@/app/reset-password/password-form";

const submit = jest.fn();
const back = jest.fn();

afterEach(async () => {
  submit.mockClear();
  back.mockClear();
});

describe("PasswordForm", () => {
  test("succeeds", async () => {
    render(<PasswordForm onSubmit={submit} onBack={back} />);

    fill(screen.getByLabelText("新しいパスワード"), "password");
    const submitButton = screen.getByText("変更");
    fireEvent.click(submitButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(submit.mock.calls[0][0]).toStrictEqual("password");
  });

  test("succeeds when the button is clicked twice", async () => {
    render(<PasswordForm onSubmit={submit} onBack={back} />);

    fill(screen.getByLabelText("新しいパスワード"), "password");
    const submitButton = screen.getByText("変更");
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(submit.mock.calls[0][0]).toStrictEqual("password");
  });

  test.each([
    ["lower limit", "p".repeat(5), "パスワードは6文字以上にしてください"],
    ["upper limit", "p".repeat(32), "パスワードは31文字以下にしてください"],
  ])("fails when password is %s", async (_, password, error) => {
    render(<PasswordForm onSubmit={submit} onBack={back} />);

    fill(screen.getByLabelText("新しいパスワード"), password);
    const submitButton = screen.getByText("変更");
    fireEvent.click(submitButton);
    // react-hook-form によって呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(0));
    await waitFor(async () =>
      expect(await screen.findByText(error)).not.toBeNull()
    );
  });
});
