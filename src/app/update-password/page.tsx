"use client";
import { supabaseClient } from "@/clients/supabase";
import { SITE_URL } from "@/utils/commons";
import PasswordForm from "./password-form";

export type FormKind = "SIGNIN" | "SIGNUP" | "RESET_PASSWORD";

export default function Home() {
  const handleSubmit = async (newPassword: string) => {
    await fetch(`${SITE_URL}/auth/update-password`, {
      method: "POST",
      body: JSON.stringify({ password: newPassword }),
    });
    await supabaseClient.auth.updateUser({ password: newPassword });
  };

  return <PasswordForm onSubmit={handleSubmit} />;
}
