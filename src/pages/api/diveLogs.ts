import { prisma } from "@/clients/prisma";
import { DiveLog } from "@/domains/diveLog";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (req.method === "POST") {
    // TODO: zod
    const { userId, point, waterTemprature, transparency } = JSON.parse(
      req.body
    ) as {
      userId: string;
      point: string;
      waterTemprature: string;
      transparency: string;
    };
    await prisma.diveLog.create({
      data: {
        userId,
        point,
        waterTemprature: Number(waterTemprature),
        transparency: Number(transparency),
      },
    });

    return res.status(200).json({});
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
