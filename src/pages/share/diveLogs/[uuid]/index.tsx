import BuddyForm from "@/components/templates/BuddyForm";
import { NewBuddy } from "@/pages/api/share/diveLogs/[uuid]/buddies/new";
import { Buddy } from "@/schemas/buudy";
import { SITE_URL } from "@/utils/commons";
import { ResponseError } from "@/utils/type";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = {
  uuidValid: boolean;
};

function Buddy(props: Props) {
  const [uuidValid, setUuidValid] = useState(props.uuidValid);
  const [error, setError] = useState<ResponseError>();

  const router = useRouter();
  const uuid = router.query.uuid;

  const handleSubmit = async (data: Buddy) => {
    const res = await fetch(
      `${SITE_URL}/api/share/diveLogs/${uuid}/buddies/new`,
      {
        method: "POST",
        body: JSON.stringify({ ...data }),
      }
    );
    if (!res.ok) {
      setError(await res.json());
      return;
    }

    const { buddyId } = (await res.json()) as NewBuddy;

    router.push({
      pathname: `${uuid}/comments`,
      query: { buddyId, buddyName: data.name },
    });
  };

  // TODO: uuidが正しいか確認する処理を追加する。正しくない場合はエラーページに遷移させる

  return <BuddyForm onSubmit={handleSubmit} error={error} />;
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
