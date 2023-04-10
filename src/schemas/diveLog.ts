import { z } from "zod";

export const diveLogSchema = z.object({
  id: z.number(),
  userId: z.string().optional(),
  point: z.string().optional(),
  waterTemprature: z.number().optional(),
  transparency: z.number().optional(),
});
export const diveLogIdSchema = z.number();

export type DiveLog = z.infer<typeof diveLogSchema>;
