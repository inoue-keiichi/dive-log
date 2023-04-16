import { z } from "zod";

export const newDiveLogSchema = z.object({
  userId: z.string(),
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

export const diveLogSchema = newDiveLogSchema.extend({ id: z.number() });

export const diveLogIdSchema = z.number();

export type DiveLog = z.infer<typeof diveLogSchema>;
export type NewDiveLog = z.infer<typeof newDiveLogSchema>;
