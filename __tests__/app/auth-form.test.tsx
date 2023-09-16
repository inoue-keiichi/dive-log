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

  test.each([
    ["invalid", "example", "メールアドレスが不正です"],
    ["empty", "", "メールアドレスを入力してください"],
  ])("fails when email is %s", async (_, email, error) => {
    render(
      <AuthForm
        onSignIn={signIn}
        onSignUp={signUp}
        onRestPassword={resetPassword}
      />
    );
    await waitFor(() => fill(screen.getByLabelText("メールアドレス"), email));
    fill(screen.getByLabelText("パスワード"), "password");
    const signInButton = screen.getByText("ログイン");
    fireEvent.click(signInButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(signIn).toHaveBeenCalledTimes(0));
    await waitFor(async () =>
      expect(await screen.findByText(error)).not.toBeNull()
    );
  });

  test.each([
    ["lower limit", "p".repeat(5), "パスワードは6文字以上にしてください"],
    ["upper limit", "p".repeat(32), "パスワードは31文字以下にしてください"],
  ])("fails when password is %s", async (_, password, error) => {
    render(
      <AuthForm
        onSignIn={signIn}
        onSignUp={signUp}
        onRestPassword={resetPassword}
      />
    );
    await waitFor(() =>
      fill(screen.getByLabelText("メールアドレス"), "example@example.com")
    );
    fill(screen.getByLabelText("パスワード"), password);
    const signInButton = screen.getByText("ログイン");
    fireEvent.click(signInButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(signIn).toHaveBeenCalledTimes(0));
    await waitFor(async () =>
      expect(await screen.findByText(error)).not.toBeNull()
    );
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
    const signUpButton = screen.getByText("アカウント登録");
    fireEvent.click(signUpButton);

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
    const signUpButton = screen.getByText("アカウント登録");
    fireEvent.click(signUpButton);
    fireEvent.click(signUpButton);

    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(signUp).toHaveBeenCalledTimes(1));
    expect(signUp.mock.calls[0][0]).toStrictEqual({
      email: "example@example.com",
      password: "password",
    });
  });

  test.each([
    ["invalid", "example", "メールアドレスが不正です"],
    ["empty", "", "メールアドレスを入力してください"],
  ])("fails when email is %s", async (_, email, error) => {
    render(
      <AuthForm
        onSignIn={signIn}
        onSignUp={signUp}
        onRestPassword={resetPassword}
      />
    );
    fireEvent.click(screen.getByText("アカウントをお持ちでない方はこちら"));
    await waitFor(() => fill(screen.getByLabelText("メールアドレス"), email));
    fill(screen.getByLabelText("パスワード"), "password");
    const signUpButton = screen.getByText("アカウント登録");
    fireEvent.click(signUpButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(signUp).toHaveBeenCalledTimes(0));
    await waitFor(async () =>
      expect(await screen.findByText(error)).not.toBeNull()
    );
  });

  test.each([
    ["lower limit", "p".repeat(5), "パスワードは6文字以上にしてください"],
    ["upper limit", "p".repeat(32), "パスワードは31文字以下にしてください"],
  ])("fails when password is %s", async (_, password, error) => {
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
    fill(screen.getByLabelText("パスワード"), password);
    const signUpButton = screen.getByText("アカウント登録");
    fireEvent.click(signUpButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(signUp).toHaveBeenCalledTimes(0));
    await waitFor(async () =>
      expect(await screen.findByText(error)).not.toBeNull()
    );
  });
});

describe("AuthForm reset password", () => {
  test("succeeds", async () => {
    render(
      <AuthForm
        onSignIn={signIn}
        onSignUp={signUp}
        onRestPassword={resetPassword}
      />
    );

    fireEvent.click(screen.getByText("パスワードを忘れた方はこちら"));
    await waitFor(() =>
      fill(screen.getByLabelText("メールアドレス"), "example@example.com")
    );
    const sendButton = screen.getByText("送信");
    fireEvent.click(sendButton);

    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(resetPassword).toHaveBeenCalledTimes(1));
    expect(resetPassword.mock.calls[0][0]).toStrictEqual("example@example.com");
    await waitFor(async () =>
      expect(
        await screen.findByText(
          "メールを送信しました。メールに記載されたリンクからパスワードを変更してください"
        )
      ).not.toBeNull()
    );
  });

  test("succeeds when the button is clicked twice", async () => {
    render(
      <AuthForm
        onSignIn={signIn}
        onSignUp={signUp}
        onRestPassword={resetPassword}
      />
    );

    fireEvent.click(screen.getByText("パスワードを忘れた方はこちら"));
    await waitFor(() =>
      fill(screen.getByLabelText("メールアドレス"), "example@example.com")
    );
    const sendButton = screen.getByText("送信");
    fireEvent.click(sendButton);
    fireEvent.click(sendButton);

    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(resetPassword).toHaveBeenCalledTimes(1));
    expect(resetPassword.mock.calls[0][0]).toStrictEqual("example@example.com");
    await waitFor(async () =>
      expect(
        await screen.findByText(
          "メールを送信しました。メールに記載されたリンクからパスワードを変更してください"
        )
      ).not.toBeNull()
    );
  });

  test.each([
    ["invalid", "example", "メールアドレスが不正です"],
    ["empty", "", "メールアドレスを入力してください"],
  ])("fails when email is %s", async (_, email, error) => {
    render(
      <AuthForm
        onSignIn={signIn}
        onSignUp={signUp}
        onRestPassword={resetPassword}
      />
    );

    fireEvent.click(screen.getByText("パスワードを忘れた方はこちら"));
    await waitFor(() => fill(screen.getByLabelText("メールアドレス"), email));
    const sendButton = screen.getByText("送信");
    fireEvent.click(sendButton);

    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(resetPassword).toHaveBeenCalledTimes(0));
    await waitFor(async () =>
      expect(await screen.findByText(error)).not.toBeNull()
    );
    expect(
      await screen.queryByText(
        "メールを送信しました。メールに記載されたリンクからパスワードを変更してください"
      )
    ).toBeNull();
  });
});
