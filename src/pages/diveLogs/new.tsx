import DiveLogForm from "@/components/templates/DiveLogForm";
import { DiveLog } from "@/schemas/diveLog";
import { SITE_URL } from "@/utils/commons";
import { CircularProgress, Fade } from "@mui/material";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function New() {
  const router = useRouter();
  const user = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: DiveLog) => {
    if (!user) {
      return await router.replace("/");
    }
    const res = await fetch(`${SITE_URL}/api/users/${user.id}/diveLogs`, {
      method: "POST",
      body: JSON.stringify({ ...data }),
    });
    if (res.ok) {
      router.push("/diveLogs");
    }
  };

  useEffect(() => {
    router.prefetch("/diveLogs");
  }, [router]);

  return (
    <>
      <Fade in={loading}>
        <CircularProgress />
      </Fade>
      <DiveLogForm
        onSubmit={(data) => {
          setLoading(true);
          handleSubmit(data);
          setLoading(false);
        }}
        onBack={() => {
          setLoading(true);
          router.push("/diveLogs");
          setLoading(false);
        }}
      />
    </>
  );
}
