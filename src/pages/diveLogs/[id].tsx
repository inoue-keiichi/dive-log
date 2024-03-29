import DiveLogForm from "@/components/templates/DiveLogForm";
import { DiveLog } from "@/schemas/diveLog";
import { SITE_URL } from "@/utils/commons";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function Exist() {
  const [diveLog, setDiveLog] = useState<DiveLog>();

  const user = useUser();
  const router = useRouter();
  const id = router.query.id;

  useEffect(() => {
    (async () => {
      if (!user || !id) {
        return;
      }
      const res = await fetch(
        `${SITE_URL}/api/users/${user.id}/diveLogs/${id}`
      );
      const json = (await res.json()) as DiveLog;
      setDiveLog(json);
    })();
  }, [user, id]);

  useEffect(() => {
    router.prefetch("/diveLogs");
  }, [router]);

  const onSubmit = async (data: DiveLog) => {
    if (!user) {
      return await router.replace("/");
    }
    await fetch(
      `${SITE_URL}/api/users/${user.id}/diveLogs/${router.query.id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    router.push("/diveLogs");
  };

  const onDelete = async () => {
    if (!user) {
      return await router.replace("/");
    }
    await fetch(
      `${SITE_URL}/api/users/${user.id}/diveLogs/${router.query.id}`,
      {
        method: "DELETE",
      }
    );
    router.push("/diveLogs");
  };

  if (!router.isReady) {
    return <></>;
  }

  return (
    <>
      {diveLog && (
        <DiveLogForm
          diveLog={diveLog}
          onSubmit={onSubmit}
          onBack={() => router.push("/diveLogs")}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

export default Exist;
