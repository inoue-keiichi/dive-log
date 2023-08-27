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
  Typography,
} from "@mui/material";
import { FC } from "react";
import { FieldErrors, useForm } from "react-hook-form";

const hasInvalidField = (errors: FieldErrors<DiveLog>) => {
  return Object.values(errors).filter((v) => v.message).length > 0;
};

type Props = {
  diveLog: ShareDiveLog;
  onSubmit: (buddyComment: BuddyComment) => void;
  error?: ResponseError;
};

const BuddyCommentForm: FC<Props> = (props) => {
  const { onSubmit, diveLog, error } = props;

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
      sx={{ width: "50%", backgroundColor: "white", borderRadius: 2 }}
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
      {diveLog.buddyComments.length > 0 && (
        <List sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
          {diveLog.buddyComments.map((comment) => (
            <div key={`coment_list_item_${comment.id}`}>
              <Divider />
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={comment.text}
                  secondary={comment.name + " / " + comment.createdAt}
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
