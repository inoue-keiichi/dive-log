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
    <Stack spacing={2}>
      {diveLogs.map((diveLog, i) => {
        const { id, point, waterTemprature, transparency } = diveLog;
        return (
          <Card data-testid={`dive-log-card-${i}`} key={id}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {point}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`水温: ${waterTemprature}℃ 透明度: ${transparency}m`}
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
      <Button variant="contained" onClick={onAddNew}>
        新規追加
      </Button>
    </Stack>
  );
};

export default DiveLogList;
