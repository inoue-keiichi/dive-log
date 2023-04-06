import { AccountAuth } from "@/domains/auth";
import { Stack, TextField, Button } from "@mui/material";
import Link from "next/link";
import { FC } from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<AccountAuth>;
  signUp: () => void;
};

const SignUpForm: FC<Props> = (props) => {
  const { register, signUp } = props;

  return (
    <Stack component="form" spacing={2} onSubmit={signUp}>
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
        新規作成
      </Button>
    </Stack>
  );
};

export default SignUpForm;
