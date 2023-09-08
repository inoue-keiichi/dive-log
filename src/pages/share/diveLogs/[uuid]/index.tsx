import BuddyForm from "@/components/templates/BuddyForm";
import { NewBuddy } from "@/pages/api/share/diveLogs/[uuid]/buddies/new";
import { Buddy } from "@/schemas/buudy";
import { SITE_URL } from "@/utils/commons";
import { ResponseError } from "@/utils/type";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
  uuidValid: boolean;
};

function Buddy(props: Props) {
  const [uuidValid, setUuidValid] = useState(props.uuidValid);
  const [error, setError] = useState<ResponseError>();

  const router = useRouter();
  const uuid = router.query.uuid;

  useEffect(() => {
    if (!uuid) {
      return;
    }
    (async () => {
      const res = await fetch(`${SITE_URL}/api/share/diveLogs/${uuid}`);
      setUuidValid(res.ok);
    })();
  }, [uuid]);

  useEffect(() => {
    router.prefetch("[uuid]/comments");
  }, [router]);

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
      pathname: "[uuid]/comments",
      query: { uuid, buddyId, buddyName: data.name },
    });
  };

  // TODO: uuidが正しいか確認する処理を追加する。正しくない場合はエラーページに遷移させる

  return <BuddyForm onSubmit={handleSubmit} error={error} />;
}

export default Buddy;
