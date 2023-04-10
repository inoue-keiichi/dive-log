import Head from "next/head";
import styles from "@/styles/Home.module.css";
import DiveLogForm from "@/components/templates/DiveLogForm";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useUser } from "@supabase/auth-helpers-react";
import { DiveLog } from "@/schemas/diveLog";

export default function New() {
  const router = useRouter();
  const user = useUser();
  const onSubmit = async (data: DiveLog) => {
    if (!user) {
      return await router.replace("/");
    }
    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/diveLogs`, {
      method: "POST",
      body: JSON.stringify({ ...data, userId: user.id }),
    });
    router.push("/diveLogs");
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <DiveLogForm onSubmit={onSubmit} />
      </main>
    </>
  );
}
