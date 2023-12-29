import { z } from "zod";

// export const accountSchema = z.object({
//   email: z
//     .string()
//     .min(1, "メールアドレスを入力してください")
//     .max(254, "メールアドレスは254文字以下にしてください")
//     .email("メールアドレスが不正です"),
//   password: z
//     .string()
//     .min(6, "パスワードは6文字以上にしてください")
//     .max(31, "パスワードは31文字以下にしてください"),
// });

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .max(254, "メールアドレスは254文字以下にしてください")
    .email("メールアドレスが不正です"),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(6, "パスワードは6文字以上にしてください")
    .max(31, "パスワードは31文字以下にしてください"),
});

export const accountSchema = emailSchema.merge(passwordSchema);

export const passwordRequestSchema = passwordSchema.merge(
  z.object({ code: z.string() })
);

export type Account = z.infer<typeof accountSchema>;
export type Email = z.infer<typeof emailSchema>;
export type Password = z.infer<typeof passwordSchema>;
export type PasswordRequest = z.infer<typeof passwordRequestSchema>;
