import BuddyCommentForm from "@/components/templates/BuddyCommentForm";
import { ShareDiveLog } from "@/pages/api/share/diveLogs/[uuid]";
import { BuddyComment } from "@/schemas/buudy";
import { SITE_URL } from "@/utils/commons";
import { ResponseError } from "@/utils/type";
import { CircularProgress } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import { Suspense, useState } from "react";
import { z } from "zod";

type Props = {
  diveLog: ShareDiveLog;
  uuid: string;
  buddyId: number;
  buddyName: string;
};

function BuddyComment(props: Props) {
  const { diveLog: initDivelog, uuid, buddyId, buddyName } = props;

  const [diveLog, setDiveLog] = useState(initDivelog);
  const [error, setError] = useState<ResponseError>();
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      <Suspense fallback={<CircularProgress />}>
        <BuddyCommentForm
          diveLog={diveLog}
          onSubmit={(data) => {
            setLoading(true);
            handleSubmit(data);
            setLoading(false);
          }}
          error={error}
          commenter={buddyName}
        />
      </Suspense>
    </>
  );
}

const querySchema = z.object({
  uuid: z.string(),
  buddyId: z.coerce.number(),
  buddyName: z.string(),
});

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // /shere/${uuid}/commentsに直接URL指定した場合は名前を指定してないので名前入力画面にリダイレクトする
  const parse = querySchema.safeParse(context.query);
  if (!parse.success) {
    return {
      redirect: {
        destination: `/share/diveLogs/${context.query.uuid}`,
        permanent: false,
      },
    };
  }

  const res = await fetch(`${SITE_URL}/api/share/diveLogs/${parse.data.uuid}`);
  if (!res.ok) {
    // TODO: エラーページに遷移させた方がいい
    return {
      redirect: {
        destination: `/share/diveLogs/${context.query.uuid}`,
        permanent: false,
      },
    };
  }

  const diveLog = (await res.json()) as ShareDiveLog;
  console.log(diveLog);
  return { props: { diveLog, ...parse.data } };
}

export default BuddyComment;
