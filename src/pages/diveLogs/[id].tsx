import DiveLogForm from "@/components/templates/DiveLogForm";
import { DiveLog } from "@/schemas/diveLog";
import { SITE_URL } from "@/utils/commons";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// type Props = {
//   diveLog: DiveLog;
// };

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

  useEffect(() => {
    router.prefetch("/diveLogs");
  }, [router]);

  return (
    <DiveLogForm
      diveLog={diveLog}
      onSubmit={onSubmit}
      onBack={() => router.push("/diveLogs")}
      onDelete={onDelete}
    />
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
  // const res = await fetch(
  //   `${SITE_URL}/api/users/${user.id}/diveLogs/${context.query.id}`
  // );
  // const diveLog = (await res.json()) as DiveLog;
  return { props: {} };
}

export default Exist;
