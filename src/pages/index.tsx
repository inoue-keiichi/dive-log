import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import { Stack } from "@mui/material";
import { Auth } from "@supabase/auth-ui-react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function Home() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const [data, setData] = useState();

  if (user) {
    router.push("/diveLogs");
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Stack>
          <Auth
            redirectTo="http://localhost:3000/diveLogs"
            appearance={{ theme: ThemeSupa }}
            supabaseClient={supabaseClient}
            providers={["google", "github"]}
            socialLayout="horizontal"
          />
        </Stack>
      </main>
    </>
  );

  // const router = useRouter();
  // const { register, handleSubmit } = useForm<AccountAuth>();

  // const signIn = async (data: AccountAuth) => {
  //   const signIn = await fetch(
  //     `${process.env.NEXT_PUBLIC_HOST}/api/auth/signIn`,
  //     {
  //       method: "POST",
  //       body: JSON.stringify(data),
  //     }
  //   );
  //   if (!signIn.ok) {
  //     // TODO: いい感じにエラー表示する
  //     console.error(await signIn.json());
  //     return;
  //   }
  //   router.push("/diveLogs");
  // };

  // // if (error) {
  // //   return (
  // //     <main className={styles.main}>
  // //       <p>Error: {error.message}</p>
  // //     </main>
  // //   );
  // // }
  // // if (loading) {
  // //   return (
  // //     <main className={styles.main}>
  // //       <CircularProgress />
  // //     </main>
  // //   );
  // // }
  // // if () {
  // //   router.push("/diveLogs");
  // // }
  // return (
  //   <>
  //     <Head>
  //       <title>Create Next App</title>
  //       <meta name="description" content="Generated by create next app" />
  //       <meta name="viewport" content="width=device-width, initial-scale=1" />
  //       <link rel="icon" href="/favicon.ico" />
  //     </Head>
  //     <main className={styles.main}>
  //       <SignIn
  //         register={register}
  //         signIn={handleSubmit(signIn)}
  //         signUpHref={"/signUp"}
  //       />
  //     </main>
  //   </>
  // );
}
