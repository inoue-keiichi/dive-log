import { z } from "zod";

export const diveLogSchema = z.object({
  point: z.string().optional(),
  waterTemprature: z
    .number()
    .or(
      z.optional(
        z
          .string()
          .regex(/[1-9][0-9]*/)
          .transform((val) => Number(val))
      )
    )
    .or(
      z
        .string()
        .length(0)
        .transform((_) => undefined)
    ),
  transparency: z
    .number()
    .or(
      z.optional(
        z
          .string()
          .regex(/[1-9][0-9]*/)
          .transform((val) => Number(val))
      )
    )
    .or(
      z
        .string()
        .length(0)
        .transform((_) => undefined)
    ),
});

export const newDiveLogQuerySchema = z.object({ userId: z.string() });

export const diveLogQuerySchema = newDiveLogQuerySchema.extend({
  id: z
    .string()
    .regex(/[1-9][0-9]*/)
    .transform((val) => Number(val))
    .or(z.number()),
});

export type DiveLog = z.infer<typeof diveLogSchema>;
//export type DiveLogQuery = z.infer<typeof diveLogQuerySchema>;
