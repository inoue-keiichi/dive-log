import { Stack } from "@mui/material";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    router.prefetch("/diveLogs");
  }, [router]);

  useEffect(() => {
    if (user) {
      router.push("/diveLogs");
    }
  }, [router, user]);

  return (
    <Stack>
      <Auth
        providers={[]}
        appearance={{ theme: ThemeSupa }}
        supabaseClient={supabaseClient}
        socialLayout="horizontal"
      />
    </Stack>
  );
}
