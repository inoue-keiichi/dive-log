import { createClient } from "@supabase/supabase-js";

// TODO: zod と env のライブラリで型つけたい
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_API_KEY!
);
