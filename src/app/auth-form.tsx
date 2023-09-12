"use client";
import { supabaseClient } from "@/clients/supabase";
import styles from "@/styles/Home.module.css";
import { SITE_URL } from "@/utils/commons";
import { Stack } from "@mui/material";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function AuthForm() {
  return (
    <main className={styles.main}>
      <Stack>
        <Auth
          providers={[]}
          redirectTo={`${SITE_URL}/auth/callback`}
          appearance={{ theme: ThemeSupa }}
          supabaseClient={supabaseClient}
          socialLayout="horizontal"
        />
      </Stack>
    </main>
  );
}
