import { BuddyComment, buddyCommentSchema } from "@/schemas/buudy";
import { DiveLog } from "@/schemas/diveLog";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import { FC } from "react";
import { useForm } from "react-hook-form";

type Props = {
  diveLog: DiveLog;
  onSubmit: (buddyComment: BuddyComment) => void;
};

const BuddyCommentForm: FC<Props> = (props) => {
  const { onSubmit, diveLog } = props;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<BuddyComment>({
    resolver: zodResolver(buddyCommentSchema),
  });

  return (
    <Stack>
      <Stack
        sx={{
          width: "50%",
          backgroundColor: "white",
          padding: "20px 40px 20px 40px",
          borderRadius: 2,
        }}
      >
        <TextField
          id="date"
          label="日付"
          type="date"
          defaultValue={diveLog?.date}
        />
        <TextField
          id="place"
          label="場所"
          type="text"
          defaultValue={diveLog?.place}
        />
        <TextField
          id="point"
          label="ポイント"
          type="text"
          defaultValue={diveLog?.point}
        />
        <TextField
          id="divingStartTime"
          label="潜水開始時間"
          type="text"
          defaultValue={diveLog?.divingStartTime}
        />
        <TextField
          id="divingEndTime"
          label="潜水終了時間"
          type="text"
          defaultValue={diveLog?.divingEndTime}
        />
      </Stack>
      <Stack
        spacing={2}
        sx={{
          width: "50%",
          backgroundColor: "white",
          padding: "20px 40px 20px 40px",
          borderRadius: 2,
        }}
        component="form"
        onSubmit={handleSubmit((buddyComment) => {
          onSubmit(buddyComment);
        })}
      >
        <FormControl>
          <InputLabel htmlFor="point">名前</InputLabel>
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
        <FormControl>
          <InputLabel htmlFor="memo">コメント</InputLabel>
          <OutlinedInput
            id="buddyComment"
            label="コメント"
            type="text"
            multiline
            minRows={3}
            error={!!errors.text?.message}
            {...register("text")}
          />
          <FormHelperText error={!!errors.text?.message}>
            {errors.text?.message ?? ""}
          </FormHelperText>
        </FormControl>
        <Button disabled={!isValid} variant="contained" type="submit">
          送信
        </Button>
      </Stack>
    </Stack>
  );
};

export default BuddyCommentForm;
