import styles from "@/styles/Home.module.css";
import { SITE_URL } from "@/utils/commons";
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

  if (user) {
    router.push("/diveLogs");
  }

  return (
    <main className={styles.main}>
      <Stack>
        <Auth
          providers={[]}
          redirectTo={SITE_URL}
          appearance={{ theme: ThemeSupa }}
          supabaseClient={supabaseClient}
          socialLayout="horizontal"
        />
      </Stack>
    </main>
  );
}
