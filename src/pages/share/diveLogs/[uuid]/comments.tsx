import Loading from "@/components/molecules/Loading";
import BuddyCommentForm from "@/components/templates/BuddyCommentForm";
import { ShareDiveLog } from "@/pages/api/share/diveLogs/[uuid]";
import { BuddyComment } from "@/schemas/buudy";
import styles from "@/styles/Home.module.css";
import { SITE_URL } from "@/utils/commons";
import { ResponseError } from "@/utils/type";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";

function BuddyComment() {
  const [diveLog, setDiveLog] = useState<ShareDiveLog>();
  const [error, setError] = useState<ResponseError>();

  const router = useRouter();
  const { uuid } = router.query;

  useEffect(() => {
    if (!uuid) {
      return;
    }

    (async () => {
      const res = await fetch(`${SITE_URL}/api/share/diveLogs/${uuid}`);
      if (!res.ok) {
        // TODO: エラーページに遷移させた方がいい
        setError(await res.json());
        return;
      }

      const diveLog = (await res.json()) as ShareDiveLog;
      setDiveLog(diveLog);
    })();
  }, [uuid]);

  if (!router.isReady) {
    return <></>;
  }

  const parse = querySchema.safeParse(router.query);
  if (!parse.success) {
    router.push(`/share/diveLogs/${uuid}`);
    return;
  }

  const { buddyId, buddyName } = parse.data;

  const handleSubmit = async (data: BuddyComment) => {
    const res = await fetch(
      `${SITE_URL}/api/share/diveLogs/${uuid}/buddies/${buddyId}/comments/new`,
      {
        method: "POST",
        body: JSON.stringify({ ...data }),
      }
    );
    if (!res.ok) {
      setError(await res.json());
      return;
    }

    // 自分や他ユーザーが追加したコメントを表示できるようにコメントを再取得する
    // コメントのポストに失敗しても他ユーザーがコメントしている可能性がある
    const resDiveLog = await fetch(`${SITE_URL}/api/share/diveLogs/${uuid}`);
    if (!resDiveLog.ok) {
      setError(await res.json());
      return;
    }
    const diveLog = (await resDiveLog.json()) as ShareDiveLog;
    setDiveLog(diveLog);
  };

  if (!diveLog || !buddyName) {
    return <Loading />;
  }

  return (
    <main className={styles.main}>
      <BuddyCommentForm
        diveLog={diveLog}
        onSubmit={handleSubmit}
        error={error}
        commenter={buddyName as string}
      />
    </main>
  );
}

const querySchema = z.object({
  uuid: z.string(),
  buddyId: z.coerce.number(),
  buddyName: z.string(),
});

export default BuddyComment;
