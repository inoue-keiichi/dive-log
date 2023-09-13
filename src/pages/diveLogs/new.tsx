import { supabaseClient } from "@/clients/supabase";
import DiveLogForm from "@/components/templates/DiveLogForm";
import { DiveLog } from "@/schemas/diveLog";
import { SITE_URL } from "@/utils/commons";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function New() {
  const router = useRouter();

  const handleSubmit = async (data: DiveLog) => {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
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
    <DiveLogForm
      onSubmit={handleSubmit}
      onBack={() => router.push("/diveLogs")}
    />
  );
}
