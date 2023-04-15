import { prisma } from "@/clients/prisma";
import { newDiveLogSchema } from "@/schemas/diveLog";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (req.method === "POST") {
    const parsed = newDiveLogSchema.safeParse(JSON.parse(req.body));
    if (!parsed.success) {
      // TODO: エラーのレスポンス型作りたい
      return res.status(400).json({
        errorCode: "invalid_parameter",
        message: JSON.parse(parsed.error.message),
      });
    }

    const newDiveLog = await prisma.diveLog.create({
      data: parsed.data,
    });

    return res.status(201).json(newDiveLog);
  }

  if (req.method === "GET") {
    // TODO: zod
    const diveLogs = await prisma.diveLog.findMany({
      where: { userId: req.query.userId as string },
      orderBy: { id: "desc" },
    });
    return res.status(200).json(diveLogs);
  }

  return res.status(400).json({});
}
