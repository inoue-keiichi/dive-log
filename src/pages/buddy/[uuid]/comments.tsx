import BuddyCommentForm from "@/components/templates/BuddyCommentForm";
import { ShareDiveLog } from "@/pages/api/buddy/diveLogs/[uuid]";
import { BuddyComment } from "@/schemas/buudy";
import styles from "@/styles/Home.module.css";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = {
  diveLog: ShareDiveLog;
};

function BuddyComment(props: Props) {
  const [diveLog, setDiveLog] = useState(props.diveLog);

  const router = useRouter();
  const uuid = router.query.uuid;

  const handleSubmit = async (data: BuddyComment) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/buddy/diveLogs/${uuid}/comments/new`,
      {
        method: "POST",
        body: JSON.stringify({ ...data }),
      }
    );

    if (!res.ok) {
      // TODO: エラー処理かく
      throw Error("");
    }

    // 追加したコメントを表示できるようにコメントを再取得する
    const resDiveLog = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/buddy/diveLogs/${uuid}`
    );
    const diveLog = (await resDiveLog.json()) as ShareDiveLog;
    setDiveLog(diveLog);
  };

  // TODO: uuidが正しいか確認する処理を追加する。正しくない場合はエラーページに遷移させる

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <BuddyCommentForm diveLog={diveLog} onSubmit={handleSubmit} />
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const uuid = context.resolvedUrl
    .replace("/buddy", "")
    .replace("/comments", "");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_HOST}/api/buddy/diveLogs/${uuid}`
  );
  const diveLog = (await res.json()) as ShareDiveLog;
  return { props: { diveLog } };
}

export default BuddyComment;
