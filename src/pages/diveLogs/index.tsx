import Head from "next/head";
import styles from "@/styles/Home.module.css";
import DiveLogList from "@/components/templates/DiveLogList";
import { useRouter } from "next/router";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { DiveLog } from "@/schemas/diveLog";

type Props = {
  diveLogs: DiveLog[];
};

export default function DivingLogs(props: Props) {
  const { diveLogs } = props;

  const router = useRouter();

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <DiveLogList
          diveLogs={diveLogs}
          onAddNew={() => router.push("/diveLogs/new")}
          onEdit={(id: number) =>
            router.push({ pathname: "/diveLogs/[id]", query: { id } })
          }
        />
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabaseServerClient = createServerSupabaseClient(context);
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const query = new URLSearchParams();
  query.append("userId", user.id);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_HOST}/api/diveLogs?${query}`
  );
  const diveLogs = (await res.json()) as DiveLog[];
  return { props: { diveLogs } };
}
