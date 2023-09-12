import { supabaseClient } from "@/clients/supabase";
import AuthForm from "./auth-form";

export default function Home() {
  supabaseClient.auth.getUser();

  return <AuthForm />;
}
