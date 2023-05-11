import { DiveLog, diveLogSchema } from "@/schemas/diveLog";
import {
  Button,
  FormControl,
  Stack,
  FormHelperText,
  InputLabel,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { FC } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSimpleDate } from "@/utils/commons";

type Props = {
  diveLog?: DiveLog;
  onSubmit: (diveLog: DiveLog) => void;
};

const isError = (errors: FieldErrors<DiveLog>) => {
  return Object.values(errors).filter((v) => v.message).length > 0;
};

const DiveLogForm: FC<Props> = (props) => {
  const { diveLog, onSubmit } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DiveLog>({
    resolver: zodResolver(diveLogSchema),
  });

  return (
    <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <InputLabel htmlFor="date">日付</InputLabel>
        <OutlinedInput
          id="date"
          label="日付"
          type="date"
          error={!!errors.date?.message}
          // typeがdateの場合inputのvalue形式はyyyy-mm-ddになる
          defaultValue={diveLog?.date || getSimpleDate(new Date())}
          {...register("date")}
        />
        <FormHelperText error={!!errors.date?.message}>
          {errors.date?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="point">ポイント</InputLabel>
        <OutlinedInput
          id="point"
          label="ポイント"
          type="text"
          error={!!errors.point?.message}
          defaultValue={diveLog?.point}
          {...register("point")}
        />
        <FormHelperText error={!!errors.point?.message}>
          {errors.point?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="waterTemprature">水温</InputLabel>
        <OutlinedInput
          id="waterTemprature"
          label="水温"
          type="number"
          error={!!errors.waterTemprature?.message}
          defaultValue={diveLog?.waterTemprature}
          endAdornment={<InputAdornment position="end">℃</InputAdornment>}
          {...register("waterTemprature")}
        />
        <FormHelperText error={true}>
          {errors.waterTemprature?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="transparency">透明度</InputLabel>
        <OutlinedInput
          id="transparency"
          label="透明度"
          type="number"
          error={!!errors.transparency?.message}
          defaultValue={diveLog?.transparency}
          endAdornment={<InputAdornment position="end">m</InputAdornment>}
          {...register("transparency")}
        />
        <FormHelperText error={true}>
          {errors.transparency?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <Button disabled={isError(errors)} variant="contained" type="submit">
        {diveLog ? "上書き" : "追加"}
      </Button>
    </Stack>
  );
};

export default DiveLogForm;
