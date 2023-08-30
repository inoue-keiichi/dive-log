import { prisma } from "@/clients/prisma";
import { buddySchema, diveLogLinkSchema } from "@/schemas/buudy";
import { ResponseError } from "@/utils/type";
import type { NextApiRequest, NextApiResponse } from "next";

export type NewBuddy = {
  buddyId: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NewBuddy | ResponseError>
) {
  if (req.method === "POST") {
    const parsedQuery = diveLogLinkSchema.safeParse({
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

    const guest = await prisma.guestBuddy.findFirst({
      include: {
        buddy: true,
      },
      where: {
        name: parsed.data.name,
        buddy: {
          diveLogId: diveLogId,
        },
      },
    });

    if (guest) {
      return res.status(200).json({ buddyId: guest.buddyId });
    }

    const buddy = await prisma.buddy.create({
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

    return res.status(201).json({ buddyId: buddy.id });
  }

  return res.status(400).json({ code: "invaid_http_method" });
}
