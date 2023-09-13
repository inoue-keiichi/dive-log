"use client";
import { supabaseClient } from "@/clients/supabase";
import { SITE_URL } from "@/utils/commons";
import { Stack } from "@mui/material";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function AuthForm() {
  return (
    <Stack>
      <Auth
        providers={[]}
        redirectTo={`${SITE_URL}/auth/callback`}
        appearance={{ theme: ThemeSupa }}
        supabaseClient={supabaseClient}
        socialLayout="horizontal"
      />
    </Stack>
  );
}
