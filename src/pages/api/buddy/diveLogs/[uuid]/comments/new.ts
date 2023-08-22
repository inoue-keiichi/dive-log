import { prisma } from "@/clients/prisma";
import { buddyCommentQuerySchema, buddyCommentSchema } from "@/schemas/buudy";
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
        errorCode: "invalid_parameter",
        message: JSON.parse(parsedQuery.error.message),
      });
    }

    const parsed = buddyCommentSchema.safeParse(JSON.parse(req.body));
    if (!parsed.success) {
      // TODO: エラーのレスポンス型作りたい
      return res.status(400).json({
        errorCode: "invalid_parameter",
        message: JSON.parse(parsed.error.message),
      });
    }

    const result = await prisma.diveLogLink.findFirst({
      include: {
        diveLog: true,
      },
      where: {
        uuid: parsedQuery.data.uuid,
      },
    });

    if (!result) {
      return res.status(500).json({});
    }

    const { diveLogId, userId } = result;
    // 無制限にコメント登録できるとすぐにDBの容量が枯渇するかもなので制限を設ける
    const count = await prisma.buddyComment.count({
      where: {
        diveLogId: {
          equals: diveLogId,
        },
      },
    });
    if (count >= MAX_COMMENT_COUNT) {
      return res.status(400).json({
        id: "error.exceedRegistrationLimit",
        message: `登録できるコメントの数は${MAX_COMMENT_COUNT}個までです。`,
      });
    }

    await prisma.buddyComment.create({
      data: {
        diveLogId,
        userId,
        createdAt: new Date(),
        ...parsed.data,
      },
    });

    return res.status(201).json({});
  }

  return res.status(400).json({});
}
