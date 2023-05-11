import { z } from "zod";

export const diveLogSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "日付のフォーマットを YYYY-MM-DD にしてください",
    })
    .refine((value) => !isNaN(new Date(value).getTime()), {
      message: "存在しない日付です",
    })
    .optional(),
  point: z
    .string()
    .max(63, { message: "63文字以下にしてください" })
    .nullable()
    .optional(),
  waterTemprature: z
    .nullable(
      z
        .string()
        .length(0)
        .transform((_) => null)
        .or(
          z.coerce
            .number()
            .min(-100, { message: "-100以上の数字にしてください" })
            .max(100, { message: "100以下の数字にしてください" })
        )
    )
    .optional(),
  transparency: z
    .nullable(
      z
        .string()
        .length(0, { message: "0以上の数字にしてください" })
        .transform((_) => null)
        .or(
          z.coerce
            .number()
            .min(0, { message: "0以上の数字にしてください" })
            .max(100, { message: "100以下の数字にしてください" })
        )
    )
    .optional(),
});

export const newDiveLogQuerySchema = z.object({ userId: z.string() });

export const diveLogQuerySchema = newDiveLogQuerySchema.extend({
  id: z.coerce.number(),
});

export type DiveLog = z.infer<typeof diveLogSchema>;
//export type DiveLogQuery = z.infer<typeof diveLogQuerySchema>;
