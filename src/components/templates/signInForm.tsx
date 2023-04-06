import { AccountAuth } from "@/domains/auth";
import { Stack, TextField, Button } from "@mui/material";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { FC } from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<AccountAuth>;
  signIn: () => void;
  signUpHref: Url;
};

const SignInForm: FC<Props> = (props) => {
  const { register, signIn, signUpHref } = props;

  return (
    <Stack component="form" spacing={2} onSubmit={signIn}>
      <TextField
        label="メールアドレス"
        variant="outlined"
        {...register("email")}
      />
      <TextField
        label="パスワード"
        variant="outlined"
        {...register("password")}
      />
      <Button variant="contained" type="submit">
        ログイン
      </Button>
      <Link href={signUpHref}>新規作成はこちら</Link>
      {/* <Button variant="contained" onClick={() => {}}>
        新規作成
      </Button> */}
    </Stack>
  );
};

export default SignInForm;
