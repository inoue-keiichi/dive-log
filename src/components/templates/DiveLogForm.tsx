import {
  DiveLog,
  Suit,
  TankKind,
  Weather,
  diveLogSchema,
} from "@/schemas/diveLog";
import { getSimpleDate } from "@/utils/commons";
import { zodResolver } from "@hookform/resolvers/zod";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { FC } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import {
  WiCloud,
  WiDayCloudy,
  WiDaySunny,
  WiRain,
  WiSnow,
} from "react-icons/wi";

const DIVING_TIME_FORMAT = "HH:mm";

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
    control,
    setValue,
    formState: { errors },
  } = useForm<DiveLog>({
    resolver: zodResolver(diveLogSchema),
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Grid container justifyContent={"space-between"}>
          <Grid item>
            <IconButton
              data-testid="back-button"
              sx={{ backgroundColor: "white" }}
              onClick={onBack}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          </Grid>
          {diveLog && onDelete && (
            <Grid item>
              <IconButton
                data-testid="dive-log-delete-button"
                sx={{ backgroundColor: "white" }}
                onClick={onDelete}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
        <Stack
          spacing={2}
          component="form"
          onSubmit={handleSubmit((divelog) => {
            onSubmit(divelog);
          })}
          sx={{
            backgroundColor: "white",
            padding: "50px",
            borderRadius: 2,
          }}
        >
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
            <Controller
              control={control}
              name="divingStartTime"
              defaultValue={diveLog?.divingStartTime}
              render={({ field: { value } }) => (
                <TimePicker
                  label="潜水開始時間"
                  ampm={false}
                  onChange={(value) =>
                    setValue(
                      "divingStartTime",
                      value?.format(DIVING_TIME_FORMAT)
                    )
                  }
                  value={value ? dayjs(value, DIVING_TIME_FORMAT) : null}
                />
              )}
            />
            <FormHelperText error={!!errors.divingStartTime?.message}>
              {errors.divingStartTime?.message ?? ""}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <Controller
              control={control}
              name="divingEndTime"
              defaultValue={diveLog?.divingEndTime}
              render={({ field: { value } }) => (
                <TimePicker
                  label="潜水終了時間"
                  ampm={false}
                  onChange={(value) =>
                    setValue("divingEndTime", value?.format(DIVING_TIME_FORMAT))
                  }
                  value={value ? dayjs(value, DIVING_TIME_FORMAT) : null}
                />
              )}
            />
            <FormHelperText error={!!errors.divingEndTime?.message}>
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
              endAdornment={<InputAdornment position="end">m</InputAdornment>}
              {...register("maxDepth")}
            />
            <FormHelperText error={true}>
              {errors.maxDepth?.message ?? ""}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="tankStartPressure">
              タンク圧力(開始)
            </InputLabel>
            <OutlinedInput
              id="tankStartPressure"
              label="タンク圧力(開始)"
              type="number"
              error={!!errors.tankStartPressure?.message}
              defaultValue={diveLog?.tankStartPressure}
              endAdornment={
                <InputAdornment position="end">
                  {"\u{338F}/\u{33A0}"}
                </InputAdornment> // kg/cm^2
              }
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
              endAdornment={
                <InputAdornment position="end">
                  {"\u{338F}/\u{33A0}"}
                </InputAdornment> // kg/cm^2
              }
              {...register("tankEndPressure")}
            />
            <FormHelperText error={true}>
              {errors.tankEndPressure?.message ?? ""}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>タンク</FormLabel>
            <Controller
              control={control}
              name="tankKind"
              defaultValue={diveLog?.tankKind}
              render={({ field: { value } }) => (
                <RadioGroup
                  row
                  aria-labelledby="tankKind"
                  name="tank-kinds-group"
                  onChange={(event) =>
                    setValue("tankKind", event.target.value as TankKind)
                  }
                  value={value || null}
                >
                  <FormControlLabel
                    id="tankSteel"
                    value="STEEL"
                    control={<Radio />}
                    label="スチール"
                  />
                  <FormControlLabel
                    id="tankAluminum"
                    value="ALUMINUM"
                    control={<Radio />}
                    label="アルミニウム"
                  />
                </RadioGroup>
              )}
            />
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
            <FormLabel>スーツ</FormLabel>
            <Controller
              control={control}
              name="suit"
              defaultValue={diveLog?.suit}
              render={({ field: { value } }) => (
                <RadioGroup
                  row
                  aria-labelledby="suit"
                  name="suits-group"
                  onChange={(event) =>
                    setValue("suit", event.target.value as Suit)
                  }
                  value={value || null}
                >
                  <FormControlLabel
                    value="WET"
                    control={<Radio />}
                    label="ウェット"
                  />
                  <FormControlLabel
                    value="DRY"
                    control={<Radio />}
                    label="ドライ"
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
          <FormControl>
            <FormLabel>天気</FormLabel>
            <Controller
              control={control}
              name="weather"
              defaultValue={diveLog?.weather}
              render={({ field: { value } }) => (
                <RadioGroup
                  row
                  aria-labelledby="weather"
                  name="weathers-group"
                  onChange={(event) =>
                    setValue("weather", event.target.value as Weather)
                  }
                  value={value || null}
                >
                  <Radio
                    value="SUNNY"
                    icon={<WiDaySunny size="2em" />}
                    checkedIcon={<WiDaySunny size="2em" />}
                    inputProps={{ "aria-label": "晴れ" }}
                  />
                  <Radio
                    value="SUNNY_CLOUDY"
                    icon={<WiDayCloudy size="2em" />}
                    checkedIcon={<WiDayCloudy size="2em" />}
                    inputProps={{ "aria-label": "晴れ/曇り" }}
                  />
                  <Radio
                    value="CLOUDY"
                    icon={<WiCloud size="2em" />}
                    checkedIcon={<WiCloud size="2em" />}
                    inputProps={{ "aria-label": "曇り" }}
                  />
                  <Radio
                    value="RAINY"
                    icon={<WiRain size="2em" />}
                    checkedIcon={<WiRain size="2em" />}
                    inputProps={{ "aria-label": "雨" }}
                  />
                  <Radio
                    value="SNOWY"
                    icon={<WiSnow size="2em" />}
                    checkedIcon={<WiSnow size="2em" />}
                    inputProps={{ "aria-label": "雪" }}
                  />
                </RadioGroup>
              )}
            />
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
              error={!!errors.memo?.message}
              defaultValue={diveLog?.memo}
              {...register("memo")}
            />
            <FormHelperText error={!!errors.memo?.message}>
              {errors.memo?.message ?? ""}
            </FormHelperText>
          </FormControl>
          <Button disabled={isError(errors)} variant="contained" type="submit">
            {diveLog ? "上書き" : "追加"}
          </Button>
        </Stack>
      </Stack>
    </LocalizationProvider>
  );
};

export default DiveLogForm;
