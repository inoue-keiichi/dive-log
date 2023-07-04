import { DiveLog, diveLogSchema } from "@/schemas/diveLog";
import {
  Button,
  FormControl,
  Stack,
  FormHelperText,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  IconButton,
  Grid,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { FC } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSimpleDate } from "@/utils/commons";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  WiDaySunny,
  WiCloud,
  WiDayCloudy,
  WiRain,
  WiSnow,
} from "react-icons/wi";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { grey } from "@mui/material/colors";

type Props = {
  diveLog?: DiveLog;
  onSubmit: (diveLog: DiveLog) => void;
  onBack: () => void;
  onDelete?: () => void;
};

const isError = (errors: FieldErrors<DiveLog>) => {
  return Object.values(errors).filter((v) => v.message).length > 0;
};

const DiveLogForm: FC<Props> = (props) => {
  const { diveLog, onSubmit, onDelete, onBack } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DiveLog>({
    resolver: zodResolver(diveLogSchema),
  });

  return (
    <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container justifyContent={"space-between"}>
        <Grid item>
          <IconButton
            data-testid="back-button"
            sx={{ backgroundColor: grey[400] }}
            onClick={onBack}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </Grid>
        {diveLog && onDelete && (
          <Grid item>
            <IconButton
              data-testid="dive-log-delete-button"
              sx={{ backgroundColor: grey[400] }}
              onClick={onDelete}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        )}
      </Grid>
      <FormControl>
        <InputLabel htmlFor="date">日付</InputLabel>
        <OutlinedInput
          id="date"
          label="日付"
          type="date"
          error={!!errors.date?.message}
          // typeがdateの場合inputのvalue形式はyyyy-mm-ddになる
          defaultValue={diveLog?.date || getSimpleDate(new Date())}
          {...register("date")}
        />
        <FormHelperText error={!!errors.date?.message}>
          {errors.date?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="place">場所</InputLabel>
        <OutlinedInput
          id="place"
          label="場所"
          type="text"
          error={!!errors.place?.message}
          defaultValue={diveLog?.place}
          {...register("place")}
        />
        <FormHelperText error={!!errors.point?.message}>
          {errors.point?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="point">ポイント</InputLabel>
        <OutlinedInput
          id="point"
          label="ポイント"
          type="text"
          error={!!errors.point?.message}
          defaultValue={diveLog?.point}
          {...register("point")}
        />
        <FormHelperText error={!!errors.point?.message}>
          {errors.point?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="divingStartTime">潜水開始時間</InputLabel>
        <OutlinedInput
          id="divingStartTime"
          label="潜水開始時間"
          type="time"
          error={!!errors.divingStartTime?.message}
          // typeがdateの場合inputのvalue形式はyyyy-mm-ddになる
          defaultValue={diveLog?.divingStartTime || "00:00"}
          {...register("divingStartTime")}
        />
        <FormHelperText error={!!errors.divingStartTime?.message}>
          {errors.divingStartTime?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="divingEndTime">潜水終了時間</InputLabel>
        <OutlinedInput
          id="divingEndTime"
          label="潜水終了時間"
          type="time"
          error={!!errors.divingEndTime?.message}
          // typeがdateの場合inputのvalue形式はyyyy-mm-ddになる
          defaultValue={diveLog?.divingEndTime || "00:00"}
          {...register("divingEndTime")}
        />
        <FormHelperText error={!!errors.divingStartTime?.message}>
          {errors.divingEndTime?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="averageDepth">平均水深</InputLabel>
        <OutlinedInput
          id="averageDepth"
          label="平均水深"
          type="number"
          error={!!errors.averageDepth?.message}
          defaultValue={diveLog?.averageDepth}
          endAdornment={<InputAdornment position="end">m</InputAdornment>}
          {...register("averageDepth")}
        />
        <FormHelperText error={true}>
          {errors.averageDepth?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="maxDepth">最大水深</InputLabel>
        <OutlinedInput
          id="maxDepth"
          label="最大水深"
          type="number"
          error={!!errors.maxDepth?.message}
          defaultValue={diveLog?.maxDepth}
          endAdornment={
            <InputAdornment position="end">
              {"\u{338F}/\u{33A0}"}
            </InputAdornment> // kg/cm^2
          }
          {...register("maxDepth")}
        />
        <FormHelperText error={true}>
          {errors.maxDepth?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="tankStartPressure">タンク圧力(開始)</InputLabel>
        <OutlinedInput
          id="tankStartPressure"
          label="タンク圧力(開始)"
          type="number"
          error={!!errors.tankStartPressure?.message}
          defaultValue={diveLog?.tankStartPressure}
          endAdornment={<InputAdornment position="end">m</InputAdornment>}
          {...register("tankStartPressure")}
        />
        <FormHelperText error={true}>
          {errors.tankStartPressure?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="tankEndPressure">タンク圧力(終了)</InputLabel>
        <OutlinedInput
          id="tankEndPressure"
          label="タンク圧力(終了)"
          type="number"
          error={!!errors.tankEndPressure?.message}
          defaultValue={diveLog?.tankEndPressure}
          endAdornment={<InputAdornment position="end">m</InputAdornment>}
          {...register("tankEndPressure")}
        />
        <FormHelperText error={true}>
          {errors.tankEndPressure?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel id="tankKind">タンク</FormLabel>
        <RadioGroup
          row
          aria-labelledby="tankKind"
          defaultValue="steel"
          name="tank-kinds-group"
        >
          <FormControlLabel
            value="steel"
            control={<Radio />}
            label="スチール"
            {...register("tankKind")}
          />
          <FormControlLabel
            value="aluminum"
            control={<Radio />}
            label="アルミニウム"
            {...register("tankKind")}
          />
        </RadioGroup>
        <FormHelperText error={true}>
          {errors.tankKind?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel id="suit">スーツ</FormLabel>
        <RadioGroup
          row
          aria-labelledby="suit"
          defaultValue="wet"
          name="wet-kinds-group"
        >
          <FormControlLabel
            value="wet"
            control={<Radio />}
            label="ウェット"
            {...register("suit")}
          />
          <FormControlLabel
            value="dry"
            control={<Radio />}
            label="ドライ"
            {...register("suit")}
          />
        </RadioGroup>
        <FormHelperText error={true}>
          {errors.suit?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="weight">ウェイト</InputLabel>
        <OutlinedInput
          id="weight"
          label="ウェイト"
          type="number"
          error={!!errors.weight?.message}
          defaultValue={diveLog?.weight}
          endAdornment={
            <InputAdornment position="end">{"\u{338F}"}</InputAdornment>
          }
          {...register("weight")}
        />
        <FormHelperText error={true}>
          {errors.weight?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel id="weather">天気</FormLabel>
        <RadioGroup
          row
          aria-labelledby="weather"
          defaultValue="sunny"
          name="wet-weathers-group"
        >
          <Radio
            value="sunny"
            icon={<WiDaySunny size="2em" />}
            checkedIcon={<WiDaySunny size="2em" />}
            {...register("weather")}
          />
          <Radio
            value="sunny/cloudy"
            icon={<WiDayCloudy size="2em" />}
            checkedIcon={<WiDayCloudy size="2em" />}
          />
          <Radio
            value="cloudy"
            icon={<WiCloud size="2em" />}
            checkedIcon={<WiCloud size="2em" />}
            {...register("weather")}
          />
          <Radio
            value="rainy"
            icon={<WiRain size="2em" />}
            checkedIcon={<WiRain size="2em" />}
            {...register("weather")}
          />
          <Radio
            value="snowy"
            icon={<WiSnow size="2em" />}
            checkedIcon={<WiSnow size="2em" />}
            {...register("weather")}
          />
        </RadioGroup>
        <FormHelperText error={true}>
          {errors.weather?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="temprature">気温</InputLabel>
        <OutlinedInput
          id="temprature"
          label="気温"
          type="number"
          error={!!errors.temprature?.message}
          defaultValue={diveLog?.temprature}
          endAdornment={
            <InputAdornment position="end">{"\u{2103}"}</InputAdornment> // ℃
          }
          {...register("temprature")}
        />
        <FormHelperText error={true}>
          {errors.temprature?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="waterTemprature">水温</InputLabel>
        <OutlinedInput
          id="waterTemprature"
          label="水温"
          type="number"
          error={!!errors.waterTemprature?.message}
          defaultValue={diveLog?.waterTemprature}
          endAdornment={
            <InputAdornment position="end">{"\u{2103}"}</InputAdornment> // ℃
          }
          {...register("waterTemprature")}
        />
        <FormHelperText error={true}>
          {errors.waterTemprature?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="transparency">透明度</InputLabel>
        <OutlinedInput
          id="transparency"
          label="透明度"
          type="number"
          error={!!errors.transparency?.message}
          defaultValue={diveLog?.transparency}
          endAdornment={<InputAdornment position="end">m</InputAdornment>}
          {...register("transparency")}
        />
        <FormHelperText error={true}>
          {errors.transparency?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="memo">メモ</InputLabel>
        <OutlinedInput
          id="memo"
          label="メモ"
          type="text"
          multiline
          minRows={3}
          error={!!errors.place?.message}
          defaultValue={diveLog?.place}
          {...register("place")}
        />
        <FormHelperText error={!!errors.point?.message}>
          {errors.point?.message ?? ""}
        </FormHelperText>
      </FormControl>
      <Button disabled={isError(errors)} variant="contained" type="submit">
        {diveLog ? "上書き" : "追加"}
      </Button>
    </Stack>
  );
};

export default DiveLogForm;
