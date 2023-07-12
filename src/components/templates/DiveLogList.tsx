import { DiveLog } from "@/schemas/diveLog";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { FC } from "react";

type Props = {
  diveLogs: (DiveLog & { id: number })[];
  onAddNew: () => void;
  onEdit: (id: number) => void;
};

const DiveLogList: FC<Props> = (props) => {
  const { diveLogs, onAddNew, onEdit } = props;

  return (
    <Stack spacing={2} sx={{ width: "50%" }}>
      <Button
        sx={{ width: "100px", marginLeft: "auto", marginRight: "auto" }}
        variant="contained"
        onClick={onAddNew}
      >
        新規追加
      </Button>
      {diveLogs.map((diveLog, i) => {
        const { id, point, date } = diveLog;
        return (
          <Card data-testid={`dive-log-card-${i}`} key={id}>
            <CardContent>
              <Typography variant="h6" color="text.secondary">
                {date}
              </Typography>
              <Typography gutterBottom variant="h5" component="div">
                {point}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                size="small"
                onClick={() => onEdit(diveLog.id)}
              >
                編集
              </Button>
            </CardActions>
          </Card>
        );
      })}
    </Stack>
  );
};

export default DiveLogList;
