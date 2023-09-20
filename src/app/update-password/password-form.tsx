import { Password, passwordSchema } from "@/schemas/account";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";

type Props = {
  onSubmit: (password: string) => void;
};

export default function PasswordForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Password>({
    resolver: zodResolver(passwordSchema),
  });

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "white",
        padding: "50px 30px 50px 30px",
        borderRadius: "10px",
      }}
    >
      <Stack spacing={2}>
        <Stack
          spacing={2}
          component="form"
          onSubmit={handleSubmit(({ password }) => onSubmit(password))}
        >
          <FormControl>
            <TextField
              label="パスワード"
              variant="outlined"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <FormHelperText error={true}>
                {errors.password.message}
              </FormHelperText>
            )}
          </FormControl>
          <Button variant="contained" disabled={isSubmitting} type="submit">
            変更
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
