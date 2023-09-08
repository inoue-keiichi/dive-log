import DiveLogLinkDialog from "@/components/templates/DiveLogLinkDialog";
import DiveLogList from "@/components/templates/DiveLogList";
import { DiveLog } from "@/schemas/diveLog";
import styles from "@/styles/Home.module.css";
import { SITE_URL } from "@/utils/commons";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LineIcon, LineShareButton } from "react-share";

export default function DivingLogs() {
  const [diveLogs, setDiveLogs] = useState<(DiveLog & { id: number })[]>([]);
  const [openShareDialog, setOpenShareDialog] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");

  const router = useRouter();

  const user = useUser();

  useEffect(() => {
    router.prefetch("/diveLogs/new");
    router.prefetch("/diveLogs/[id]");
  }, [router]);

  useEffect(() => {
    if (!user) {
      return;
    }
    (async () => {
      const res = await fetch(`${SITE_URL}/api/users/${user.id}/diveLogs`);
      if (!res.ok) {
        // TODO: エラーページ遷移
        return;
      }
      const diveLogs = (await res.json()) as (DiveLog & { id: number })[];
      setDiveLogs(diveLogs);
    })();
  }, [user]);

  if (!router.isReady) {
    return <></>;
  }

  if (!user) {
    router.push("/");
    return;
  }

  return (
    <main className={styles.main}>
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
    </main>
  );
}
