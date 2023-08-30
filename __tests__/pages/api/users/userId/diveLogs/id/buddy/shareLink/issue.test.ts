import { prisma } from "@/clients/prisma";
import handler, {
  ShareLink,
} from "@/pages/api/users/[userId]/diveLogs/[id]/buddy/shareLink/issue";
import dayjs from "dayjs";
import { testApiHandler } from "next-test-api-route-handler";

beforeEach(async () => {
  await prisma.diveLog.deleteMany();
});

describe("POST API", () => {
  it("succeeds in issuing a share link", async () => {
    const diveLog = await prisma.diveLog.create({
      data: {
        userId: "uuid",
        date: "2023-08-15",
        place: "Ose",
        point: "Wannai",
        divingStartTime: "09:30",
        divingEndTime: "10:00",
        averageDepth: 18,
        maxDepth: 25,
        tankStartPressure: 200,
        tankEndPressure: 50,
        tankKind: "STEEL",
        weight: 5,
        suit: "WET",
        weather: "SUNNY",
        temprature: 35,
        waterTemprature: 28,
        transparency: 8,
        memo: "Good Diving!!",
      },
    });

    const { id, userId } = diveLog;

    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.id = id;
        params.userId = userId;
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
        });
        await expect(res.status).toBe(200);
        await expect(res.json()).resolves.toStrictEqual({
          link: expect.stringMatching(
            /^http:\/\/localhost:3000\/share\/diveLogs\/[\d\w-]+$/
          ),
        });
      },
    });
  });

  it("succeeds in getting the share link which was issued", async () => {
    const diveLog = await prisma.diveLog.create({
      data: {
        userId: "uuid",
        date: "2023-08-15",
        place: "Ose",
        point: "Wannai",
        divingStartTime: "09:30",
        divingEndTime: "10:00",
        averageDepth: 18,
        maxDepth: 25,
        tankStartPressure: 200,
        tankEndPressure: 50,
        tankKind: "STEEL",
        weight: 5,
        suit: "WET",
        weather: "SUNNY",
        temprature: 35,
        waterTemprature: 28,
        transparency: 8,
        memo: "Good Diving!!",
      },
    });

    const { id, userId } = diveLog;

    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.id = id;
        params.userId = userId;
      },
      test: async ({ fetch }) => {
        // 最初に共有リンクを発行しておく
        const first = await fetch({
          method: "POST",
        });
        const json = (await first.json()) as ShareLink;
        const link = json.link;

        // 発行した共有リンクと同じものを取得できるか確認する
        const res = await fetch({
          method: "POST",
        });
        await expect(res.status).toBe(200);
        await expect(res.json()).resolves.toStrictEqual({ link });
      },
    });
  });

  it("succeeds in issuing new share link when the link is expired", async () => {
    const diveLog = await prisma.diveLog.create({
      data: {
        userId: "uuid",
        date: "2023-08-15",
        place: "Ose",
        point: "Wannai",
        divingStartTime: "09:30",
        divingEndTime: "10:00",
        averageDepth: 18,
        maxDepth: 25,
        tankStartPressure: 200,
        tankEndPressure: 50,
        tankKind: "STEEL",
        weight: 5,
        suit: "WET",
        weather: "SUNNY",
        temprature: 35,
        waterTemprature: 28,
        transparency: 8,
        memo: "Good Diving!!",
      },
    });

    const { id, userId } = diveLog;

    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.id = id;
        params.userId = userId;
      },
      test: async ({ fetch }) => {
        // 最初に共有リンクを発行しておく
        const first = await fetch({
          method: "POST",
        });
        const firstJson = (await first.json()) as ShareLink;
        const link = firstJson.link;

        // 期限切れ後の日時へ移動
        const expiredAt = dayjs().add(7, "days").toDate();
        const mock = jest
          .spyOn(global, "Date")
          .mockImplementation(() => expiredAt);
        try {
          // 発行した共有リンクと同じものを取得できるか確認する
          const res = await fetch({
            method: "POST",
          });
          await expect(res.status).toBe(200);
          const secondJson = (await res.json()) as ShareLink;
          await expect(secondJson).toStrictEqual({
            link: expect.stringMatching(
              /^http:\/\/localhost:3000\/share\/diveLogs\/[\d\w-]+$/
            ),
          });
          await expect(secondJson).toStrictEqual({
            link: expect.not.stringMatching(link),
          });
        } finally {
          mock.mockRestore();
        }
      },
    });
  });
});
