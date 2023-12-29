import { supabaseClient } from "@/clients/supabase";
import DiveLogLinkDialog from "@/components/templates/DiveLogLinkDialog";
import DiveLogList from "@/components/templates/DiveLogList";
import { DiveLog } from "@/schemas/diveLog";
import { SITE_URL } from "@/utils/commons";
import { User } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LineIcon, LineShareButton } from "react-share";

export default function DivingLogs() {
  const [diveLogs, setDiveLogs] = useState<(DiveLog & { id: number })[]>([]);
  const [openShareDialog, setOpenShareDialog] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
    router.prefetch("/diveLogs/new");
    router.prefetch("/diveLogs/[id]");
  }, [router]);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      setUser(user);
      if (!user) {
        return;
      }
      const res = await fetch(`${SITE_URL}/api/users/${user.id}/diveLogs`);
      if (!res.ok) {
        // TODO: エラーページ遷移
        return;
      }
      const diveLogs = (await res.json()) as (DiveLog & { id: number })[];
      setDiveLogs(diveLogs);
    })();
  }, []);

  if (!router.isReady) {
    return <></>;
  }

  if (!user) {
    return;
  }

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
