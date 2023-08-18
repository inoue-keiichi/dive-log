import { z } from "zod";

export const buddyCommentSchema = z.object({
  name: z.string().min(1).max(63),
  text: z.string().min(1).max(511),
});

export const buddyCommentQuerySchema = z.object({ uuid: z.string() });

export type BuddyComment = z.infer<typeof buddyCommentSchema>;
