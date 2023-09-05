import { SITE_URL } from "@/utils/commons";
import { Stack } from "@mui/material";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  if (user) {
    router.push("/diveLogs");
  }

  return (
    <Stack>
      <Auth
        redirectTo={SITE_URL}
        appearance={{ theme: ThemeSupa }}
        supabaseClient={supabaseClient}
        socialLayout="horizontal"
      />
    </Stack>
  );
}
