import { DiveLog } from "@/domains/diveLog";
import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FC } from "react";

type Props = {
  diveLogs: DiveLog[];
  addNewDiveLog: () => void;
};

const DiveLogList: FC<Props> = (props) => {
  const { diveLogs, addNewDiveLog } = props;
  return (
    <Stack spacing={2}>
      {/* TODO: 可能であればkeyは意味のある値にする */}
      {diveLogs.map((d, index) => {
        const { point, waterTemprature, transparency } = d;
        return (
          <Card key={index}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {point}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`水温: ${waterTemprature}℃ 透明度: ${transparency}m`}
              </Typography>
            </CardContent>
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
