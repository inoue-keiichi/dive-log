import { ShareDiveLog } from "@/pages/api/share/diveLogs/[uuid]";
import { BuddyComment, buddyCommentSchema } from "@/schemas/buudy";
import { DiveLog } from "@/schemas/diveLog";
import { ResponseError } from "@/utils/type";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { FC } from "react";
import { FieldErrors, useForm } from "react-hook-form";

const hasInvalidField = (errors: FieldErrors<DiveLog>) => {
  return Object.values(errors).filter((v) => v.message).length > 0;
};

type Props = {
  commenter: string;
  diveLog: ShareDiveLog;
  onSubmit: (buddyComment: BuddyComment) => void;
  error?: ResponseError;
};

const BuddyCommentForm: FC<Props> = (props) => {
  const { commenter, onSubmit, diveLog, error } = props;

  const buddyComments = diveLog.buddies.flatMap((buddy) =>
    buddy.comments.map((comment) => ({
      name: buddy.name,
      id: comment.id,
      text: comment.text,
      createdAt: comment.createdAt,
    }))
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuddyComment>({
    resolver: zodResolver(buddyCommentSchema),
  });

  const divingBetweenTimeStr =
    diveLog.divingStartTime && diveLog.divingEndTime
      ? `${diveLog.divingStartTime || ""}~${diveLog.divingEndTime || ""}`
      : "";

  return (
    <Stack
      sx={{ width: "100%", backgroundColor: "white", borderRadius: 2 }}
      spacing={2}
    >
      <Stack
        spacing={2}
        sx={{
          padding: "20px 40px 20px 40px",
          borderRadius: 2,
        }}
        component="form"
        onSubmit={handleSubmit((buddyComment) => {
          onSubmit(buddyComment);
        })}
      >
        <Typography variant="h5">{`${diveLog.date} ${divingBetweenTimeStr}`}</Typography>
        <Stack direction="row" spacing={1}>
          {diveLog.place && <Chip label={diveLog.place} color="primary" />}
          {diveLog.point && <Chip label={diveLog.point} color="primary" />}
        </Stack>
        <FormControl>
          <TextField
            id="name"
            label="名前"
            type="text"
            defaultValue={commenter}
            InputProps={{
              readOnly: true,
            }}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="text">コメント</InputLabel>
          <OutlinedInput
            id="text"
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
          <FormHelperText error={!!error}>
            {error?.message ?? ""}
          </FormHelperText>
        </FormControl>
        <Button
          sx={{ width: "30%" }}
          disabled={!!error || hasInvalidField(errors)}
          variant="contained"
          type="submit"
        >
          送信
        </Button>
      </Stack>
      {buddyComments.length > 0 && (
        <List sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
          {buddyComments.map((comment) => (
            <div key={`coment_list_item_${comment.id}`}>
              <Divider />
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={comment.text}
                  secondary={
                    comment.name +
                    " — " +
                    dayjs(comment.createdAt).format("YYYY/M/D H:mm")
                  }
                />
              </ListItem>
            </div>
          ))}
        </List>
      )}
    </Stack>
  );
};

export default BuddyCommentForm;
