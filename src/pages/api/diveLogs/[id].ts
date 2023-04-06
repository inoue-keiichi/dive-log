import { prisma } from "@/clients/prisma";
import { DiveLog } from "@/domains/diveLog";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (req.method === "PUT") {
    const { userId, point, waterTemprature, transparency } = JSON.parse(
      req.body
    ) as {
      userId: string;
      point: string;
      waterTemprature: string;
      transparency: string;
    };
    // TODO: zod
    await prisma.diveLog.update({
      data: {
        userId,
        point,
        waterTemprature: Number(waterTemprature),
        transparency: Number(transparency),
      },
      where: { id: Number(req.query.id) },
    });

    return res.status(200).json({});
  }

  if (req.method === "GET") {
    const diveLog = await prisma.diveLog.findFirst({
      where: { id: Number(req.query.id) },
    });
    if (!diveLog) {
      return res.status(404).json({});
    }
    return res.status(200).json(diveLog);
  }

  return res.status(400).json({});
}
