import { Primitive, ZodLiteral, ZodTypeAny, ZodUnion, z } from "zod";

const text = (between: { max: number }) => {
  const { max } = between;

  return z
    .string()
    .min(0)
    .max(max, { message: `${max}文字以下にしてください` })
    .nullish();
};

const time = z.preprocess(
  (v) => (v === "" ? undefined : v),
  z
    .string()
    .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "日付のフォーマットを HH:mm にしてください",
    })
    .nullish()
);

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "日付のフォーマットを YYYY-MM-DD にしてください",
  })
  .refine((value) => !isNaN(new Date(value).getTime()), {
    message: "存在しない日付です",
  });

const number = (between: { max: number; min: number }) => {
  const { max, min } = between;
  return z.preprocess(
    (v) => {
      if (v === "") {
        return undefined;
      }
      if (v == null) {
        return v;
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

const tankKind = z.union([z.literal("STEEL"), z.literal("ALUMINUM")]);
const suit = z.union([z.literal("WET"), z.literal("DRY")]);
const weather = z.union([
  z.literal("SUNNY"),
  z.literal("SUNNY_CLOUDY"),
  z.literal("CLOUDY"),
  z.literal("RAINY"),
  z.literal("SNOWY"),
]);

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
  tankKind: z.preprocess((v) => (v === "" ? undefined : v), tankKind.nullish()),
  suit: z.preprocess((v) => (v === "" ? undefined : v), suit.nullish()),
  weight: number({ min: 0, max: 50 }),
  weather: z.preprocess((v) => (v === "" ? undefined : v), weather.nullish()),
  temprature: number({ min: -100, max: 100 }),
  waterTemprature: number({ min: -10, max: 50 }),
  transparency: number({ min: 0, max: 100 }),
  memo: text({ max: 511 }),
});

export const newDiveLogQuerySchema = z.object({ userId: z.string() });

export const diveLogQuerySchema = newDiveLogQuerySchema.extend({
  id: z.coerce.number(),
});

export type DiveLog = z.infer<typeof diveLogSchema>;
export type TankKind = z.infer<typeof tankKind>;
export type Suit = z.infer<typeof suit>;
export type Weather = z.infer<typeof weather>;
//export type DiveLogQuery = z.infer<typeof diveLogQuerySchema>;
