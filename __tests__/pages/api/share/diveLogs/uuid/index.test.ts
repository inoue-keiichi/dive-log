import { prisma } from "@/clients/prisma";
import handler from "@/pages/api/share/diveLogs/[uuid]";
import dayjs from "dayjs";
import { testApiHandler } from "next-test-api-route-handler";

beforeEach(async () => {
  await prisma.buddy.deleteMany();
});

describe("GET API", () => {
  it("succeeds in getting a comment", async () => {
    // コメントを登録できるようにdiveLogとdiveLogLinkを事前に作成しておく
    const { id, userId } = await prisma.diveLog.create({
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

    const { uuid } = await prisma.diveLogLink.create({
      data: {
        userId,
        diveLogId: id,
        expiredAt: dayjs().add(7, "days").toDate(),
      },
    });

    const { id: buddyId } = await prisma.buddy.create({
      data: {
        diveLogId: id,
        userId,
        guest: {
          create: {
            name: "武田",
          },
        },
        comments: {
          create: {
            text: "楽しいダイビングでした。",
          },
        },
      },
    });

    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid;
      },
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);
        expect(await res.json()).toStrictEqual(
          expect.objectContaining({
            date: "2023-08-15",
            place: "Ose",
            point: "Wannai",
            divingStartTime: "09:30",
            divingEndTime: "10:00",
            buddies: [
              expect.objectContaining({
                name: "武田",
                comments: [
                  expect.objectContaining({
                    text: "楽しいダイビングでした。",
                  }),
                ],
              }),
            ],
          })
        );
      },
    });
  });

  it("succeeds in getting comments", async () => {
    // コメントを登録できるようにdiveLogとdiveLogLinkを事前に作成しておく
    const { id, userId } = await prisma.diveLog.create({
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

    const { uuid } = await prisma.diveLogLink.create({
      data: {
        userId,
        diveLogId: id,
        expiredAt: dayjs().add(7, "days").toDate(),
      },
    });

    await prisma.buddy.create({
      data: {
        diveLogId: id,
        userId,
        guest: {
          create: {
            name: "武田",
          },
        },
        comments: {
          create: {
            text: "楽しいダイビングでした。",
          },
        },
      },
    });
    await prisma.buddy.create({
      data: {
        diveLogId: id,
        userId,
        guest: {
          create: {
            name: "高橋",
          },
        },
        comments: {
          create: {
            text: "ミノカサゴ綺麗だったね",
          },
        },
      },
    });

    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid;
      },
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);
        expect(await res.json()).toStrictEqual(
          expect.objectContaining({
            date: "2023-08-15",
            place: "Ose",
            point: "Wannai",
            divingStartTime: "09:30",
            divingEndTime: "10:00",
            buddies: [
              expect.objectContaining({
                name: "武田",
                comments: [
                  expect.objectContaining({
                    text: "楽しいダイビングでした。",
                  }),
                ],
              }),
              expect.objectContaining({
                name: "高橋",
                comments: [
                  expect.objectContaining({
                    text: "ミノカサゴ綺麗だったね",
                  }),
                ],
              }),
            ],
          })
        );
      },
    });
  });

  it("succeeds in getting not any comment", async () => {
    // コメントを登録できるようにdiveLogとdiveLogLinkを事前に作成しておく
    const { id, userId } = await prisma.diveLog.create({
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

    const { uuid } = await prisma.diveLogLink.create({
      data: {
        userId,
        diveLogId: id,
        expiredAt: dayjs().add(7, "days").toDate(),
      },
    });

    await prisma.buddy.create({
      data: {
        diveLogId: id,
        userId,
        guest: {
          create: {
            name: "武田",
          },
        },
      },
    });

    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid;
      },
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);
        expect(await res.json()).toStrictEqual(
          expect.objectContaining({
            date: "2023-08-15",
            place: "Ose",
            point: "Wannai",
            divingStartTime: "09:30",
            divingEndTime: "10:00",
            buddies: [
              expect.objectContaining({
                name: "武田",
                comments: [],
              }),
            ],
          })
        );
      },
    });
  });

  it("succeeds in getting not any comment when there is not any buddy", async () => {
    // コメントを登録できるようにdiveLogとdiveLogLinkを事前に作成しておく
    const { id, userId } = await prisma.diveLog.create({
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

    const { uuid } = await prisma.diveLogLink.create({
      data: {
        userId,
        diveLogId: id,
        expiredAt: dayjs().add(7, "days").toDate(),
      },
    });

    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid;
      },
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);
        expect(await res.json()).toStrictEqual(
          expect.objectContaining({
            date: "2023-08-15",
            place: "Ose",
            point: "Wannai",
            divingStartTime: "09:30",
            divingEndTime: "10:00",
            buddies: [],
          })
        );
      },
    });
  });
});
