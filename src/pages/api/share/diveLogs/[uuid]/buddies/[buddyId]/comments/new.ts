import { prisma } from "@/clients/prisma";
import { buddyCommentQuerySchema, buddyCommentSchema } from "@/schemas/buudy";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { count } from "../../../../../../../../../prisma/queries/buddyComment";

const MAX_COMMENT_COUNT = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (req.method === "POST") {
    const parsedQuery = buddyCommentQuerySchema.safeParse({
      uuid: req.query.uuid,
      buddyId: req.query.buddyId,
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

    const { uuid, buddyId } = parsedQuery.data;

    const result = await prisma.diveLogLink.findFirst({
      include: {
        diveLog: true,
      },
      where: {
        uuid,
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
    if ((await count(diveLogId))[0].count >= MAX_COMMENT_COUNT) {
      return res.status(400).json({
        code: "resource_limit_exceeded",
        message: `登録できるコメントの数は${MAX_COMMENT_COUNT}個までです。`,
      });
    }

    try {
      await prisma.buddyComment.create({
        data: {
          buddyId,
          ...parsed.data,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.meta?.field_name == "buddy_comments_buddy_id_fkey (index)"
      ) {
        return res.status(400).json({
          code: "resource_not_found",
          message: "存在しないバディです。",
        });
      }
      throw e;
    }

    return res.status(201).json({});
  }

  return res.status(400).json({});
}
