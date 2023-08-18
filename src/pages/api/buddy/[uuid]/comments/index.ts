import { prisma } from "@/clients/prisma";
import { buddyCommentQuerySchema, buddyCommentSchema } from "@/schemas/buudy";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (req.method === "GET") {
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

    const result = await prisma.diveLogLink.findFirst({
      include: {
        diveLog: {
          include: {
            buddyComments: true,
          },
        },
      },
      where: {
        uuid: parsedQuery.data.uuid,
      },
    });

    if (!result) {
      return res.status(500).json({});
    }

    return res.status(200).json(result.diveLog.buddyComments);
  }

  return res.status(400).json({});
}
