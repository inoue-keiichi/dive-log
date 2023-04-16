import { prisma } from "@/clients/prisma";
import { diveLogIdSchema, diveLogSchema } from "@/schemas/diveLog";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (req.method === "PUT") {
    const parsedQuery = diveLogIdSchema.safeParse(req.query.id);
    if (!parsedQuery.success) {
      console.error(parsedQuery.error.message);
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

    const updatedDiveLog = await prisma.diveLog.update({
      data: parsed.data,
      where: { id: parsedQuery.data },
    });

    return res.status(200).json(updatedDiveLog);
  }

  if (req.method === "GET") {
    const parsedQuery = diveLogIdSchema.safeParse(req.query.id);
    if (!parsedQuery.success) {
      // TODO: エラーのレスポンス型作りたい
      return res.status(400).json({
        errorCode: "invalid_parameter",
        message: JSON.parse(parsedQuery.error.message),
      });
    }
    const diveLog = await prisma.diveLog.findFirst({
      where: { id: parsedQuery.data },
    });
    if (!diveLog) {
      return res.status(404).json({});
    }
    return res.status(200).json(diveLog);
  }

  return res.status(400).json({});
}
