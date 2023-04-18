import { DiveLog, diveLogSchema } from "@/schemas/diveLog";
import {
  Button,
  FormControl,
  Stack,
  TextField,
  Input,
  FormHelperText,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  FormControlLabel,
} from "@mui/material";
import { FC } from "react";
import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  diveLog?: DiveLog;
  onSubmit: (diveLog: DiveLog) => void;
};

// TODO: 別ファイルへ移動する
const today = new Date();
const getSimpleDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;
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
          defaultValue={diveLog?.date || getSimpleDate(today)}
          {...register("date")}
        />
        <FormHelperText error={!!errors.point?.message}>
          {errors.point?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="point">ポイント</InputLabel>
        <OutlinedInput
          id="point"
          label="ポイント"
          type="text"
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
      <Button
        disabled={!!errors.root?.message}
        variant="contained"
        type="submit"
      >
        {diveLog ? "上書き" : "追加"}
      </Button>
    </Stack>
  );
};

export default DiveLogForm;
