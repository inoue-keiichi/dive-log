"use client";
import { SITE_URL } from "@/utils/commons";
import { useSearchParams } from "next/navigation";
import PasswordForm from "./password-form";

export type FormKind = "SIGNIN" | "SIGNUP" | "RESET_PASSWORD";

export default function Home() {
  const router = useSearchParams();
  const code = router?.get("code");

  const handleSubmit = async (newPassword: string) => {
    await fetch(`${SITE_URL}/auth/reset-password`, {
      method: "POST",
      body: JSON.stringify({ password: newPassword, code }),
    });
  };

  return <PasswordForm onSubmit={handleSubmit} />;
}
