import { z } from "zod";

export const diveLogSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "日付のフォーマットを YYYY-MM-DD にしてください",
    })
    .refine((value) => !isNaN(new Date(value).getTime()), {
      message: "存在しない日付です",
    }),
  point: z
    .string()
    .max(63, { message: "63文字以下にしてください" })
    .nullable()
    .optional(),
  waterTemprature: z.preprocess((v) => {
    if (!v || v === "") {
      return null;
    }
    if (typeof Number(v) === "number") {
      return Number(v);
    }
    return v;
  }, z.number().max(100, { message: "100以下の数字にしてください" }).min(-100, { message: "-100以上の数字にしてください" }).nullish()),
  transparency: z.preprocess((v) => {
    if (!v || v === "") {
      return null;
    }
    if (typeof Number(v) === "number") {
      return Number(v);
    }
    return v;
  }, z.number().max(100, { message: "100以下の数字にしてください" }).min(0, { message: "0以上の数字にしてください" }).nullish()),
});

export const newDiveLogQuerySchema = z.object({ userId: z.string() });

export const diveLogQuerySchema = newDiveLogQuerySchema.extend({
  id: z.coerce.number(),
});

export type DiveLog = z.infer<typeof diveLogSchema>;
//export type DiveLogQuery = z.infer<typeof diveLogQuerySchema>;
