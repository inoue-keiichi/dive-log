import { prisma } from "@/clients/prisma";
import { diveLogIdSchema, diveLogSchema } from "@/schemas/diveLog";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (req.method === "PUT") {
    const { userId, point, waterTemprature, transparency } =
      diveLogSchema.parse(req.body);
    const id = diveLogIdSchema.parse(req.query.id);
    await prisma.diveLog.update({
      data: {
        userId,
        point,
        waterTemprature,
        transparency,
      },
      where: { id },
    });

    return res.status(200).json({});
  }

  if (req.method === "GET") {
    const id = diveLogIdSchema.parse(req.query.id);
    const diveLog = await prisma.diveLog.findFirst({
      where: { id },
    });
    if (!diveLog) {
      return res.status(404).json({});
    }
    return res.status(200).json(diveLog);
  }

  return res.status(400).json({});
}
