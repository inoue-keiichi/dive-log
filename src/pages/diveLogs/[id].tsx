import DiveLogForm from "@/components/templates/DiveLogForm";
import { DiveLog } from "@/schemas/diveLog";
import { SITE_URL } from "@/utils/commons";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  diveLog: DiveLog;
};

function Exist(props: Props) {
  const { diveLog } = props;

  const user = useUser();
  const router = useRouter();

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
  const res = await fetch(
    `${SITE_URL}/api/users/${user.id}/diveLogs/${context.query.id}`
  );
  const diveLog = (await res.json()) as DiveLog;
  return { props: { diveLog } };
}

export default Exist;
