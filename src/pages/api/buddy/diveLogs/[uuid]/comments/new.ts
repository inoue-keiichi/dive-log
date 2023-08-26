import { prisma } from "@/clients/prisma";
import { buddyCommentQuerySchema, buddyCommentSchema } from "@/schemas/buudy";
import type { NextApiRequest, NextApiResponse } from "next";
import { count } from "../../../../../../../prisma/queries/buddyComment";

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

    const parsed = buddyCommentSchema.safeParse(JSON.parse(req.body));
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

    const { diveLogId } = result;
    // 無制限にコメント登録できるとすぐにDBの容量が枯渇するかもなので制限を設ける
    if ((await count(diveLogId)) >= MAX_COMMENT_COUNT) {
      return res.status(400).json({
        code: "resource_limit_exceeded",
        message: `登録できるコメントの数は${MAX_COMMENT_COUNT}個までです。`,
      });
    }

    await prisma.buddyComment.create({
      data: {
        ...parsed.data,
      },
    });

    return res.status(201).json({});
  }

  return res.status(400).json({});
}
