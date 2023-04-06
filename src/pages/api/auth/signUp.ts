import { prisma } from "@/clients/prisma";
import { supabase } from "@/clients/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (req.method === "POST") {
    const { email, password } = JSON.parse(req.body) as {
      email: string;
      password: string;
    };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_HOST}/diveLogs`,
      },
    });

    if (error) {
      return res.status(400).json({ error });
    }

    await prisma;
    return res.status(200).json({ data });
  }
  return res.status(400).json({});
}
