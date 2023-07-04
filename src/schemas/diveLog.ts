import { z } from "zod";

const text = (between: { max: number }) => {
  const { max } = between;

  return z
    .string()
    .min(0)
    .max(max, { message: `${max}文字以下にしてください` })
    .nullable()
    .nullish();
};

const time = z
  .string()
  .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "日付のフォーマットを HH:mm にしてください",
  })
  .nullish();

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "日付のフォーマットを YYYY-MM-DD にしてください",
  })
  .refine((value) => !isNaN(new Date(value).getTime()), {
    message: "存在しない日付です",
  });

const temprature = z.preprocess((v) => {
  if (!v || v === "") {
    return null;
  }
  if (typeof Number(v) === "number") {
    return Number(v);
  }
  return v;
}, z.number().max(100, { message: "100以下の数字にしてください" }).min(-100, { message: "-100以上の数字にしてください" }).nullish());

const number = (between: { max: number; min: number }) => {
  const { max, min } = between;
  return z.preprocess(
    (v) => {
      if (!v || v === "") {
        return null;
      }
      if (typeof Number(v) === "number") {
        return Number(v);
      }
      return v;
    },
    z
      .number()
      .max(max, { message: `${max}以下の数字にしてください` })
      .min(min, { message: `${min}以上の数字にしてください` })
      .nullish()
  );
};

export const diveLogSchema = z.object({
  date,
  place: text({ max: 63 }),
  point: text({ max: 63 }),
  divingStartTime: time,
  divingEndTime: time,
  averageDepth: number({ min: 0, max: 100 }),
  maxDepth: number({ min: 0, max: 100 }),
  tankStartPressure: number({ min: 0, max: 500 }),
  tankEndPressure: number({ min: 0, max: 500 }),
  tankKind: z.union([z.literal("STEEL"), z.literal("ALUMINUM")]).nullish(),
  suit: z.union([z.literal("WET"), z.literal("DRY")]).nullish(),
  weight: number({ min: 0, max: 50 }),
  weather: z
    .union([
      z.literal("SUNNY"),
      z.literal("SUNNY_CLOUDY"),
      z.literal("CLOUDY"),
      z.literal("RAINY"),
      z.literal("SNOWY"),
    ])
    .nullish(),
  temprature,
  waterTemprature: temprature,
  transparency: number({ min: 0, max: 100 }),
  memo: text({ max: 511 }),
});

export const newDiveLogQuerySchema = z.object({ userId: z.string() });

export const diveLogQuerySchema = newDiveLogQuerySchema.extend({
  id: z.coerce.number(),
});

export type DiveLog = z.infer<typeof diveLogSchema>;
//export type DiveLogQuery = z.infer<typeof diveLogQuerySchema>;
