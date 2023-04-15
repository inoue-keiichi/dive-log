import { z } from "zod";

export const newDiveLogSchema = z.object({
  userId: z.string(),
  point: z.string().optional(),
  waterTemprature: z.number().optional(),
  transparency: z.number().optional(),
});

export const diveLogSchema = newDiveLogSchema.extend({ id: z.number() });

export const diveLogIdSchema = z.number();

export type DiveLog = z.infer<typeof diveLogSchema>;
export type NewDiveLog = z.infer<typeof newDiveLogSchema>;
