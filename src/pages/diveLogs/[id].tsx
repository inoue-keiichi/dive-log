import DiveLogForm from "@/components/templates/DiveLogForm";
import { DiveLog } from "@/schemas/diveLog";
import { SITE_URL } from "@/utils/commons";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function Exist() {
  // const { diveLog } = props;
  const [diveLog, setDiveLog] = useState<DiveLog>();

  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!user) {
        return;
      }
      const res = await fetch(
        `${SITE_URL}/api/users/${user.id}/diveLogs/${router.query.id}`
      );
      const diveLog = (await res.json()) as DiveLog;
      setDiveLog(diveLog);
    })();
  }, [user, router]);

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

  if (!user) {
    router.push("/");
    return;
  }

  return (
    <DiveLogForm
      diveLog={diveLog}
      onSubmit={onSubmit}
      onBack={() => router.push("/diveLogs")}
      onDelete={onDelete}
    />
  );
}

export default Exist;
