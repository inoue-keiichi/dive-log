import { prisma } from "@/clients/prisma";
import { diveLogQuerySchema } from "@/schemas/diveLog";
import { ResponseError } from "@/utils/type";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";

export type ShareLink = {
  link: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShareLink | ResponseError>
) {
  if (req.method === "POST") {
    const parsedQuery = diveLogQuerySchema.safeParse({
      userId: req.query.userId,
      id: req.query.id,
    });
    if (!parsedQuery.success) {
      // TODO: エラーのレスポンス型作りたい
      return res.status(400).json({
        code: "invalid_parameter",
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
        link: `${process.env.NEXT_PUBLIC_HOST}/buddies/${exist.uuid}`,
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
      link: `${process.env.NEXT_PUBLIC_HOST}/buddies/${newLink.uuid}`,
    });
  }

  return res.status(400).json({ code: "invaid_http_method" });
}
