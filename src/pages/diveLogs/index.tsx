import DiveLogLinkDialog from "@/components/templates/DiveLogLinkDialog";
import DiveLogList from "@/components/templates/DiveLogList";
import { DiveLog } from "@/schemas/diveLog";
import { SITE_URL } from "@/utils/commons";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { LineIcon, LineShareButton } from "react-share";

type Props = {
  diveLogs: (DiveLog & { id: number })[];
};

export default function DivingLogs(props: Props) {
  const { diveLogs } = props;

  const [openShareDialog, setOpenShareDialog] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");

  const router = useRouter();

  const user = useUser();

  return (
    <>
      <DiveLogLinkDialog
        open={openShareDialog}
        link={link}
        onClose={setOpenShareDialog}
      >
        <LineShareButton title={"ログブックにコメントを書いてね！"} url={link}>
          <LineIcon size={40} borderRadius={10} />
        </LineShareButton>
      </DiveLogLinkDialog>
      <DiveLogList
        data-test-id={"dive-log-card-list"}
        diveLogs={diveLogs}
        onAddNew={() => router.push("/diveLogs/new")}
        onEdit={(id: number) =>
          router.push({ pathname: "/diveLogs/[id]", query: { id } })
        }
        onShare={async (id: number) => {
          if (!user) {
            await router.replace("/");
            return;
          }

          const res = await fetch(
            `${SITE_URL}/api/users/${user.id}/diveLogs/${id}/buddy/shareLink/issue`,
            { method: "POST" }
          );
          if (!res.ok) {
            // TODO: エラー処理かく.link取得できない場合、リカバリー策あるか？
            throw new Error();
          }
          const result = (await res.json()) as { link: string } | null;
          if (!result) {
            // TODO: エラー処理かく.link取得できない場合、リカバリー策あるか？
            throw new Error();
          }
          setLink(result.link);
          setOpenShareDialog(true);
        }}
      />
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

  const res = await fetch(`${SITE_URL}/api/users/${user.id}/diveLogs`);
  const diveLogs = (await res.json()) as DiveLog[];
  return { props: { diveLogs } };
}
