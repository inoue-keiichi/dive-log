"use client";
import { supabaseClient } from "@/clients/supabase";
import { SITE_URL } from "@/utils/commons";
import { useRouter } from "next/navigation";
import AuthForm from "./auth-form";

export default function Home() {
  const router = useRouter();

  const handleSignUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${SITE_URL}/auth/callback`,
      },
    });
    router.refresh();
  };

  const handleSignIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    router.refresh();
  };

  const handleResetPassword = async (email: string) => {
    await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: "https://github.com/inoue-keiichi/dive-log/pull/44/files",
    });
    console.log("hoge");
  };

  return (
    <AuthForm
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      onRestPassword={handleResetPassword}
    />
  );
}
