import { DiveLog } from "@/domains/diveLog";
import { Button, Stack, TextField } from "@mui/material";
import { FC } from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<DiveLog>;
  addNewDiveLog: () => void;
};

const DiveLogForm: FC<Props> = (props) => {
  const { register, addNewDiveLog } = props;

  return (
    <Stack spacing={2} component="form" onSubmit={addNewDiveLog}>
      <TextField
        id="outlined-basic"
        label="ポイント"
        variant="outlined"
        {...register("point")}
      />
      <TextField
        id="outlined-basic"
        label="水温"
        variant="outlined"
        {...register("waterTemprature")}
      />
      <TextField
        id="outlined-basic"
        label="透明度"
        variant="outlined"
        {...register("transparency")}
      />
      <Button variant="contained" onClick={addNewDiveLog}>
        追加
      </Button>
    </Stack>
  );
};

export default DiveLogForm;
