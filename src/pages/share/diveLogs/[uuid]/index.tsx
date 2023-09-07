import BuddyForm from "@/components/templates/BuddyForm";
import { NewBuddy } from "@/pages/api/share/diveLogs/[uuid]/buddies/new";
import { Buddy } from "@/schemas/buudy";
import { SITE_URL } from "@/utils/commons";
import { ResponseError } from "@/utils/type";
import { CircularProgress } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";

type Props = {
  uuidValid: boolean;
};

function Buddy(props: Props) {
  const [uuidValid, setUuidValid] = useState(props.uuidValid);
  const [error, setError] = useState<ResponseError>();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const uuid = router.query.uuid;

  const handleSubmit = async (data: Buddy) => {
    throw fetch(`${SITE_URL}/api/share/diveLogs/${uuid}/buddies/new`, {
      method: "POST",
      body: JSON.stringify({ ...data }),
    }).then(async (res) => {
      if (!res.ok) {
        setError(await res.json());
        return;
      }
      const { buddyId } = (await res.json()) as NewBuddy;

      router.push({
        pathname: "[uuid]/comments",
        query: { uuid, buddyId, buddyName: data.name },
      });
    });

    // const res = await fetch(
    //   `${SITE_URL}/api/share/diveLogs/${uuid}/buddies/new`,
    //   {
    //     method: "POST",
    //     body: JSON.stringify({ ...data }),
    //   }
    // );
    // if (!res.ok) {
    //   setError(await res.json());
    //   return;
    // }

    // const { buddyId } = (await res.json()) as NewBuddy;

    // router.push({
    //   pathname: "[uuid]/comments",
    //   query: { uuid, buddyId, buddyName: data.name },
    // });
  };

  useEffect(() => {
    router.prefetch("[uuid]/comments");
  }, [router]);

  // TODO: uuidが正しいか確認する処理を追加する。正しくない場合はエラーページに遷移させる

  return (
    <>
      <Suspense fallback={<CircularProgress />}>
        <BuddyForm
          onSubmit={(data) => {
            throw handleSubmit(data);
          }}
          error={error}
        />
      </Suspense>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const uuid = context.resolvedUrl.replace("/buddies", "");
  const res = await fetch(`${SITE_URL}/api/share/diveLogs/${uuid}`);
  return {
    props: {
      uuidValid: res.ok,
    },
  };
}

export default Buddy;
