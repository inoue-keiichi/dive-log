import AuthForm from "@/app/auth-form";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { fill } from "../components/__utils__/common";

const signIn = jest.fn();
const signUp = jest.fn();
const resetPassword = jest.fn();

afterEach(async () => {
  signIn.mockClear();
  signUp.mockClear();
  resetPassword.mockClear();
});

describe("AuthForm sign in", () => {
  test("succeeds", async () => {
    render(
      <AuthForm
        onSignIn={signIn}
        onSignUp={signUp}
        onRestPassword={resetPassword}
      />
    );
    fill(screen.getByLabelText("メールアドレス"), "example@example.com");
    fill(screen.getByLabelText("パスワード"), "password");
    const signInButton = screen.getByText("ログイン");
    fireEvent.click(signInButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(signIn).toHaveBeenCalledTimes(1));
    expect(signIn.mock.calls[0][0]).toStrictEqual({
      email: "example@example.com",
      password: "password",
    });
  });

  test("succeeds when the button is clicked twice", async () => {
    render(
      <AuthForm
        onSignIn={signIn}
        onSignUp={signUp}
        onRestPassword={resetPassword}
      />
    );
    fill(screen.getByLabelText("メールアドレス"), "example@example.com");
    fill(screen.getByLabelText("パスワード"), "password");
    const signInButton = screen.getByText("ログイン");
    fireEvent.click(signInButton);
    fireEvent.click(signInButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(signIn).toHaveBeenCalledTimes(1));
    expect(signIn.mock.calls[0][0]).toStrictEqual({
      email: "example@example.com",
      password: "password",
    });
  });

  test("fails when email is invalid", async () => {
    render(
      <AuthForm
        onSignIn={signIn}
        onSignUp={signUp}
        onRestPassword={resetPassword}
      />
    );
    fill(screen.getByLabelText("メールアドレス"), "example");
    fill(screen.getByLabelText("パスワード"), "password");
    const signInButton = screen.getByText("ログイン");
    fireEvent.click(signInButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(signIn).toHaveBeenCalledTimes(0));
    expect(screen.queryByText("メールアドレスが不正です")).not.toBeNull();
  });
});

describe("AuthForm sign up", () => {
  test("succeeds", async () => {
    render(
      <AuthForm
        onSignIn={signIn}
        onSignUp={signUp}
        onRestPassword={resetPassword}
      />
    );

    fireEvent.click(screen.getByText("アカウントをお持ちでない方はこちら"));
    await waitFor(() =>
      fill(screen.getByLabelText("メールアドレス"), "example@example.com")
    );
    fill(screen.getByLabelText("パスワード"), "password");
    const signInButton = screen.getByText("アカウント登録");
    fireEvent.click(signInButton);

    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(signUp).toHaveBeenCalledTimes(1));
    expect(signUp.mock.calls[0][0]).toStrictEqual({
      email: "example@example.com",
      password: "password",
    });
  });

  test("succeeds when the button is clicked twice", async () => {
    render(
      <AuthForm
        onSignIn={signIn}
        onSignUp={signUp}
        onRestPassword={resetPassword}
      />
    );

    fireEvent.click(screen.getByText("アカウントをお持ちでない方はこちら"));
    await waitFor(() =>
      fill(screen.getByLabelText("メールアドレス"), "example@example.com")
    );
    fill(screen.getByLabelText("パスワード"), "password");
    const signInButton = screen.getByText("アカウント登録");
    fireEvent.click(signInButton);
    fireEvent.click(signInButton);

    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(signUp).toHaveBeenCalledTimes(1));
    expect(signUp.mock.calls[0][0]).toStrictEqual({
      email: "example@example.com",
      password: "password",
    });
  });
});
