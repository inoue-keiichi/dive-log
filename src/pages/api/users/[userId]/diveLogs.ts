import { prisma } from "@/clients/prisma";
import { newDiveLogQuerySchema, diveLogSchema } from "@/schemas/diveLog";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (req.method === "POST") {
    const parsedQuery = newDiveLogQuerySchema.safeParse({
      userId: req.query.userId,
    });
    if (!parsedQuery.success) {
      // TODO: エラーのレスポンス型作りたい
      return res.status(400).json({
        errorCode: "invalid_parameter",
        message: JSON.parse(parsedQuery.error.message),
      });
    }

    const parsed = diveLogSchema.safeParse(JSON.parse(req.body));
    if (!parsed.success) {
      // TODO: エラーのレスポンス型作りたい
      return res.status(400).json({
        errorCode: "invalid_parameter",
        message: JSON.parse(parsed.error.message),
      });
    }

    const newDiveLog = await prisma.diveLog.create({
      data: { ...parsed.data, userId: parsedQuery.data.userId },
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
