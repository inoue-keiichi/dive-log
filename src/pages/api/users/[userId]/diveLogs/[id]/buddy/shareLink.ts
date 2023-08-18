import { prisma } from "@/clients/prisma";
import { diveLogQuerySchema } from "@/schemas/diveLog";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (req.method === "GET") {
    const parsedQuery = diveLogQuerySchema.safeParse({
      userId: req.query.userId,
      id: req.query.id,
    });
    if (!parsedQuery.success) {
      // TODO: エラーのレスポンス型作りたい
      return res.status(400).json({
        errorCode: "invalid_parameter",
        message: JSON.parse(parsedQuery.error.message),
      });
    }

    const { userId, id } = parsedQuery.data;

    const exist = await prisma.diveLogLink.findFirst({
      where: {
        diveLogId: id,
        userId,
        expiredAt: {
          gte: new Date(),
        },
      },
    });

    if (exist) {
      return res.status(200).json({
        link: `${process.env.NEXT_PUBLIC_HOST}/buddy/${exist.uuid}/comments`,
      });
    }

    const newLink = await prisma.diveLogLink.create({
      data: {
        diveLogId: id,
        userId,
        expiredAt: dayjs().add(1, "week").toDate(),
      },
    });
    return res.status(200).json({
      link: `${process.env.NEXT_PUBLIC_HOST}/buddy/${newLink.uuid}/comments`,
    });
  }

  return res.status(400).json({});
}
