import { DiveLog } from "@/domains/diveLog";
import { Button, Stack, TextField } from "@mui/material";
import { FC } from "react";
import { useForm, UseFormRegister } from "react-hook-form";

type Props = {
  diveLog?: DiveLog;
  onSubmit: (diveLog: DiveLog) => void;
};

const DiveLogForm: FC<Props> = (props) => {
  const { diveLog, onSubmit } = props;

  const { register, handleSubmit } = useForm<DiveLog>();

  return (
    <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        id="outlined-basic"
        label="ポイント"
        variant="outlined"
        defaultValue={diveLog?.point}
        {...register("point")}
      />
      <TextField
        id="outlined-basic"
        label="水温"
        variant="outlined"
        defaultValue={diveLog?.waterTemprature}
        {...register("waterTemprature")}
      />
      <TextField
        id="outlined-basic"
        label="透明度"
        variant="outlined"
        defaultValue={diveLog?.transparency}
        {...register("transparency")}
      />
      <Button variant="contained" type="submit">
        {diveLog ? "上書き" : "追加"}
      </Button>
    </Stack>
  );
};

export default DiveLogForm;
