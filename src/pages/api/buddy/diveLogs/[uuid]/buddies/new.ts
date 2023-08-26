import { prisma } from "@/clients/prisma";
import { buddyCommentQuerySchema, buddySchema } from "@/schemas/buudy";
import type { NextApiRequest, NextApiResponse } from "next";

const MAX_COMMENT_COUNT = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (req.method === "POST") {
    const parsedQuery = buddyCommentQuerySchema.safeParse({
      uuid: req.query.uuid,
    });
    if (!parsedQuery.success) {
      // TODO: エラーのレスポンス型作りたい
      return res.status(400).json({
        code: "invalid_parameter",
        message: parsedQuery.error.message,
      });
    }

    const parsed = buddySchema.safeParse(JSON.parse(req.body));
    if (!parsed.success) {
      // TODO: エラーのレスポンス型作りたい
      return res.status(400).json({
        code: "invalid_parameter",
        message: parsed.error.message,
      });
    }

    const result = await prisma.diveLogLink.findFirst({
      include: {
        diveLog: true,
      },
      where: {
        uuid: parsedQuery.data.uuid,
        expiredAt: {
          gte: new Date(),
        },
      },
    });

    if (!result) {
      return res.status(400).json({
        code: "resource_not_found",
        message:
          "有効期限が切れた、または不正なURLです。バディに再度URLを発行してもらってください",
      });
    }

    const { diveLogId, userId } = result;

    await prisma.buddy.create({
      data: {
        diveLogId,
        userId,
        guest: {
          create: {
            name: parsed.data.name,
          },
        },
      },
    });

    return res.status(201).json({});
  }

  return res.status(400).json({});
}
