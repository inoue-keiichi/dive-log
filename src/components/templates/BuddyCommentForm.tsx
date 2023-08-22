import { ShareDiveLog } from "@/pages/api/buddy/diveLogs/[uuid]";
import { BuddyComment, buddyCommentSchema } from "@/schemas/buudy";
import { DiveLog } from "@/schemas/diveLog";
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

const isError = (errors: FieldErrors<DiveLog>) => {
  return Object.values(errors).filter((v) => v.message).length > 0;
};

type Props = {
  diveLog: ShareDiveLog;
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
    <Stack
      sx={{ width: "50%", backgroundColor: "white", borderRadius: 2 }}
      spacing={2}
    >
      <Stack
        spacing={2}
        sx={{
          //width: "50%",
          //backgroundColor: "white",
          padding: "20px 40px 20px 40px",
          borderRadius: 2,
        }}
        component="form"
        onSubmit={handleSubmit((buddyComment) => {
          onSubmit(buddyComment);
        })}
      >
        <Typography variant="h5">{`${diveLog.date} ${diveLog.divingStartTime}~${diveLog.divingEndTime}`}</Typography>
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
        </FormControl>
        <Button
          sx={{ width: "30%" }}
          disabled={isError(errors)}
          variant="contained"
          type="submit"
        >
          送信
        </Button>
      </Stack>
      {diveLog.buddyComments.length > 0 && (
        <List sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
          {diveLog.buddyComments.map((comment, index) => (
            <>
              <Divider />
              <ListItem key={comment.id} alignItems="flex-start">
                <ListItemText
                  primary={comment.text}
                  secondary={comment.name + " / " + comment.createdAt}
                />
              </ListItem>
            </>
          ))}
        </List>
      )}
    </Stack>
  );
};

export default BuddyCommentForm;
