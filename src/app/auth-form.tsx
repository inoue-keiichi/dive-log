"use client";
import { Account, Email, accountSchema, emailSchema } from "@/schemas/account";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  FormHelperText,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  onSignIn: (param: { email: string; password: string }) => void;
  onSignUp: (param: { email: string; password: string }) => void;
  onRestPassword: (email: string) => void;
};

export default function AuthForm({
  onSignIn,
  onSignUp,
  onRestPassword,
}: Props) {
  const [account, setAccout] = useState<"SIGNIN" | "SIGNUP" | "RESET_PASSWORD">(
    "SIGNIN"
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Account>({
    resolver: zodResolver(accountSchema),
  });

  const {
    register: resetPasswordRegister,
    handleSubmit: resetPasswordHandleSubmit,
    formState: {
      errors: resetPasswordErrors,
      isSubmitting: isResetPasswordSubmitting,
    },
  } = useForm<Email>({
    resolver: zodResolver(emailSchema),
  });

  return (
    <>
      {account === "SIGNIN" && (
        <Stack spacing={2}>
          <Stack spacing={2} component="form">
            <FormControl>
              <TextField
                label="メールアドレス"
                variant="outlined"
                {...register("email")}
              />
              <FormHelperText error={!!errors}>
                {errors.email?.message ?? ""}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <TextField
                label="パスワード"
                variant="outlined"
                type="password"
                {...register("password")}
              />
              <FormHelperText error={!!errors}>
                {errors.password?.message ?? ""}
              </FormHelperText>
            </FormControl>
            <Button
              variant="contained"
              disabled={isSubmitting}
              onClick={handleSubmit((account) => onSignIn(account))}
            >
              ログイン
            </Button>
          </Stack>
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              setAccout("RESET_PASSWORD");
            }}
          >
            パスワードを忘れた方はこちら
          </Link>
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              setAccout("SIGNUP");
            }}
          >
            アカウントをお持ちでない方はこちら
          </Link>
        </Stack>
      )}
      {account === "SIGNUP" && (
        <Stack spacing={2}>
          <Stack spacing={2} component="form">
            <FormControl>
              <TextField
                label="メールアドレス"
                variant="outlined"
                {...register("email")}
              />
              <FormHelperText error={!!errors}>
                {errors.email?.message ?? ""}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <TextField
                label="パスワード"
                variant="outlined"
                type="password"
                {...register("password")}
              />
              <FormHelperText error={!!errors}>
                {errors.password?.message ?? ""}
              </FormHelperText>
            </FormControl>
            <Button
              variant="contained"
              disabled={isSubmitting}
              onClick={handleSubmit((account) => onSignUp(account))}
            >
              アカウント登録
            </Button>
          </Stack>
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              setAccout("SIGNIN");
            }}
          >
            すでにアカウントをお持ちの方はこちら
          </Link>
        </Stack>
      )}
      {account === "RESET_PASSWORD" && (
        <Stack spacing={2}>
          <Stack spacing={2} component="form">
            <FormControl>
              <TextField
                label="メールアドレス"
                variant="outlined"
                {...resetPasswordRegister("email")}
              />
              <FormHelperText error={!!resetPasswordErrors}>
                {resetPasswordErrors.email?.message ?? ""}
              </FormHelperText>
            </FormControl>
            <Button
              variant="contained"
              disabled={isResetPasswordSubmitting}
              onClick={resetPasswordHandleSubmit(({ email }) =>
                onRestPassword(email)
              )}
            >
              送信
            </Button>
          </Stack>
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              setAccout("SIGNIN");
            }}
          >
            ログイン画面へ戻る
          </Link>
        </Stack>
      )}
    </>
  );
}
