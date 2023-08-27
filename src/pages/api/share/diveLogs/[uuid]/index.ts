import { prisma } from "@/clients/prisma";
import { diveLogLinkSchema } from "@/schemas/buudy";
import { ResponseError } from "@/utils/type";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShareDiveLog | ResponseError>
) {
  if (req.method === "GET") {
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

    const result = await prisma.diveLogLink.findFirst({
      include: {
        diveLog: {
          include: {
            buddies: {
              include: {
                guest: true,
                comments: true,
              },
            },
          },
        },
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

    const { date, place, point, divingStartTime, divingEndTime, buddies } =
      result.diveLog;

    return res.status(200).json({
      date,
      place,
      point,
      divingStartTime,
      divingEndTime,
      buddies: buddies.map((buddy) => ({
        id: buddy.id,
        name: buddy.guest!.name, // ユーザー登録機能ができるまではnullにならない
        comments: buddy.comments.map((comment) => ({
          text: comment.text,
          createdAt: comment.createdAt,
        })),
      })),
    });
  }

  return res.status(400).json({
    code: "invaid_http_method",
  });
}

export type ShareDiveLog = {
  date: string;
  place: string | null;
  point: string | null;
  divingStartTime: string | null;
  divingEndTime: string | null;
  buddies: {
    id: number;
    name: string;
    comments: {
      text: string;
      createdAt: Date;
    }[];
  }[];
};
