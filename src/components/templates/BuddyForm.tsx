import { Buddy, buddySchema } from "@/schemas/buudy";
import { DiveLog } from "@/schemas/diveLog";
import { ResponseError } from "@/utils/type";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";

const hasInvalidField = (errors: FieldErrors<DiveLog>) => {
  return Object.values(errors).filter((v) => v.message).length > 0;
};

type Props = {
  onSubmit: (buddy: Buddy) => Promise<void>;
  error?: ResponseError;
};

const BuddyForm: FC<Props> = (props) => {
  const { onSubmit, error } = props;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Buddy>({
    resolver: zodResolver(buddySchema),
  });

  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
        backgroundColor: "white",
        padding: "20px 40px 20px 40px",
        borderRadius: 2,
      }}
      component="form"
      onSubmit={handleSubmit((buddy) => {
        setLoading(true);
        onSubmit(buddy).finally(() => {
          setLoading(false);
        });
      })}
    >
      <Typography>あなたの名前を入力してください</Typography>
      <FormControl>
        <InputLabel htmlFor="name">名前</InputLabel>
        <OutlinedInput
          id="name"
          label="名前"
          type="text"
          error={!!errors.name?.message}
          {...register("name")}
        />
        <FormHelperText error={!!errors.name?.message}>
          {errors.name?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormHelperText error={!!error}>{error?.message ?? ""}</FormHelperText>
      <Button
        sx={{ width: "30%" }}
        disabled={!!error || hasInvalidField(errors)}
        variant="contained"
        type="submit"
        loading={loading}
        loadingPosition="end"
      >
        次へ
      </Button>
    </Stack>
  );
};

export default BuddyForm;
