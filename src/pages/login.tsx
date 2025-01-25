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
    <Stack>
      <Auth
        providers={[]}
        redirectTo={SITE_URL}
        appearance={{ theme: ThemeSupa }}
        supabaseClient={supabaseClient}
        socialLayout="horizontal"
        localization={{
          variables: {
            sign_in: {
              email_label: "メールアドレス",
              password_label: "パスワード",
              email_input_placeholder: "",
              password_input_placeholder: "",
              button_label: "ログイン",
              loading_button_label: "ログイン中...",
              link_text: "すでにアカウントをお持ちの方はこちら",
            },
            sign_up: {
              email_label: "メールアドレス",
              password_label: "パスワード",
              email_input_placeholder: "",
              password_input_placeholder: "",
              button_label: "アカウント登録",
              loading_button_label: "登録中...",
              link_text: "アカウントをお持ちでない場合はこちら",
              confirmation_text:
                "入力されたメールアドレス宛にメールを送りました。メールを開き、登録の続きを行なってください。",
            },
            forgotten_password: {
              email_label: "メールアドレス",
              password_label: "パスワード",
              email_input_placeholder: "",
              button_label: "パスワード変更のメールを送る",
              loading_button_label: "送信中...",
              link_text: "パスワードを忘れた方はこちら",
              confirmation_text:
                "パスワード変更のメールを送りました。メールを開き、変更手続きを行なってください。",
            },
          },
        }}
      />
    </Stack>
  );
}
