import { prisma } from "@/clients/prisma";
import { diveLogQuerySchema, diveLogSchema } from "@/schemas/diveLog";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (req.method === "PUT") {
    const parsedQuery = diveLogQuerySchema.safeParse({
      id: req.query.id,
      userId: req.query.userId,
    });
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
      where: {
        dive_log_identifier: {
          id: parsedQuery.data.id,
          userId: parsedQuery.data.userId,
        },
      },
    });

    return res.status(200).json(updatedDiveLog);
  }

  if (req.method === "GET") {
    const parsedQuery = diveLogQuerySchema.safeParse({
      id: req.query.id,
      userId: req.query.userId,
    });
    if (!parsedQuery.success) {
      // TODO: エラーのレスポンス型作りたい
      return res.status(400).json({
        errorCode: "invalid_parameter",
        message: JSON.parse(parsedQuery.error.message),
      });
    }
    const diveLog = await prisma.diveLog.findFirst({
      where: { id: parsedQuery.data.id, userId: parsedQuery.data.userId },
    });
    if (!diveLog) {
      return res.status(404).json({});
    }
    return res.status(200).json(diveLog);
  }

  if (req.method === "DELETE") {
    const parsedQuery = diveLogQuerySchema.safeParse({
      id: req.query.id,
      userId: req.query.userId,
    });
    if (!parsedQuery.success) {
      // TODO: エラーのレスポンス型作りたい
      return res.status(400).json({
        errorCode: "invalid_parameter",
        message: JSON.parse(parsedQuery.error.message),
      });
    }
    await prisma.diveLog.delete({
      where: {
        dive_log_identifier: {
          id: parsedQuery.data.id,
          userId: parsedQuery.data.userId,
        },
      },
    });
    return res.status(200).json({});
  }

  return res.status(400).json({});
}
