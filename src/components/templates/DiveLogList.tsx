import { DiveLog } from "@/domains/diveLog";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { FC } from "react";

type Props = {
  diveLogs: DiveLog[];
  addNewDiveLog: () => void;
  editDivingLog: (id: number) => void;
};

const DiveLogList: FC<Props> = (props) => {
  const { diveLogs, addNewDiveLog, editDivingLog } = props;

  return (
    <Stack spacing={2}>
      {diveLogs.map((diveLog) => {
        const { id, point, waterTemprature, transparency } = diveLog;
        return (
          <Card key={id}>
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
                onClick={() => editDivingLog(diveLog.id)}
              >
                編集
              </Button>
            </CardActions>
          </Card>
        );
      })}
      <Button variant="contained" onClick={addNewDiveLog}>
        新規追加
      </Button>
    </Stack>
  );
};

export default DiveLogList;
