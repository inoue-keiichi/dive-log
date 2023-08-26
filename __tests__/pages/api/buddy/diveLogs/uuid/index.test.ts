import { prisma } from "@/clients/prisma";
import handler from "@/pages/api/buddy/diveLogs/[uuid]";
import dayjs from "dayjs";
import { testApiHandler } from "next-test-api-route-handler";

const mock = jest
  .spyOn(global, "Date")
  .mockImplementation(() => new Date("2023-08-26"));

beforeAll(() => {
  mock.mockRestore();
});

describe("GET API", () => {
  it("suceeds in getting a comment", async () => {
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

    await prisma.buddyComment.create({
      data: {
        userId,
        diveLogId: id,
        name: "武田",
        text: "楽しいダイビングでした。",
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
            buddyComments: [
              expect.objectContaining({
                diveLogId: id,
                userId,
                name: "武田",
                text: "楽しいダイビングでした。",
              }),
            ],
          })
        );
      },
    });
  });

  it("suceeds in getting comments", async () => {
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

    await prisma.buddyComment.createMany({
      data: [
        {
          userId,
          diveLogId: id,
          name: "武田",
          text: "楽しいダイビングでした。",
        },
        {
          userId,
          diveLogId: id,
          name: "高橋",
          text: "ミノカサゴ綺麗だったね",
        },
      ],
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
            buddyComments: [
              expect.objectContaining({
                diveLogId: id,
                userId,
                name: "武田",
                text: "楽しいダイビングでした。",
              }),
              expect.objectContaining({
                diveLogId: id,
                userId,
                name: "高橋",
                text: "ミノカサゴ綺麗だったね",
              }),
            ],
          })
        );
      },
    });
  });

  it("suceeds in getting not any comment", async () => {
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
            buddyComments: [],
          })
        );
      },
    });
  });
});
