import { z } from "zod";

export const buddyCommentSchema = z.object({
  name: z
    .string()
    .min(1, "名前を入力してください")
    .max(31, "31文字以下にしてください"),
  text: z
    .string()
    .min(1, "コメントを入力してください")
    .max(255, "255文字以下にしてください"),
});

export const buddyCommentQuerySchema = z.object({ uuid: z.string() });

export type BuddyComment = z.infer<typeof buddyCommentSchema>;
