import { z } from "zod";

export const diveLogSchema = z.object({
  date: z
    .string()
    .regex(/\d{4}-\d{2}-\d{2}/, {
      message: "カレンダーから日付を選択してください",
    })
    .optional(),
  point: z.nullable(
    z.string().max(63, { message: "63文字以下にしてください" })
  ),
  waterTemprature: z.nullable(
    z
      .string()
      .length(0)
      .transform((_) => null)
      .or(z.coerce.number())
  ),
  transparency: z.nullable(
    z
      .string()
      .length(0, { message: "0以上の数字にしてください" })
      .transform((_) => null)
      .or(z.coerce.number().min(0, { message: "0以上の数字にしてください" }))
  ),
});

export const newDiveLogQuerySchema = z.object({ userId: z.string() });

export const diveLogQuerySchema = newDiveLogQuerySchema.extend({
  id: z.coerce.number(),
});

export type DiveLog = z.infer<typeof diveLogSchema>;
//export type DiveLogQuery = z.infer<typeof diveLogQuerySchema>;
