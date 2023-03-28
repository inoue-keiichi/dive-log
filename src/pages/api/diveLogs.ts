import { prisma } from "@/clients/prisma";
import { DiveLog } from "@/domains/diveLog";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (req.method === "PUT") {
    // TODO: zod
    const { point, waterTemprature, transparency } = JSON.parse(req.body) as {
      point: string;
      waterTemprature: string;
      transparency: string;
    };
    await prisma.diveLogs.create({
      data: {
        point,
        waterTemprature: Number(waterTemprature),
        transparency: Number(transparency),
      },
    });

    return res.status(200).json({});
  }

  if (req.method === "GET") {
    const diveLogs = await prisma.diveLogs.findMany();
    return res.status(200).json(diveLogs);
  }

  return res.status(400).json({});
}
