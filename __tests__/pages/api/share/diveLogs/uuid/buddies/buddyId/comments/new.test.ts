import { prisma } from "@/clients/prisma";
import handler from "@/pages/api/share/diveLogs/[uuid]/buddies/[buddyId]/comments/new";
import dayjs from "dayjs";
import { testApiHandler } from "next-test-api-route-handler";

beforeEach(async () => {
  await prisma.diveLog.deleteMany();
});

describe("POST API", () => {
  it("succeeds in posting a comment", async () => {
    // コメントを登録できるようにdiveLogとdiveLogLinkを事前に作成しておく
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

    const diveLogLink = await prisma.diveLogLink.create({
      data: {
        userId,
        diveLogId: id,
        expiredAt: dayjs().add(7, "days").toDate(),
      },
    });

    const { uuid } = diveLogLink;

    const { id: buddyId } = await prisma.buddy.create({
      data: {
        diveLogId: id,
        userId,
        guest: {
          create: {
            name: "田中",
          },
        },
      },
    });

    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid;
        params.buddyId = buddyId;
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            text: "楽しかったね！またダイビング行きたいね",
          }),
        });
        expect(res.status).toBe(201);
        expect(await res.json()).toStrictEqual({});

        // DBにレコードが挿入されたことを確認
        const buddyComment = await prisma.buddyComment.findFirst();
        expect(buddyComment).toStrictEqual(
          expect.objectContaining({
            buddyId,
            text: "楽しかったね！またダイビング行きたいね",
          })
        );
      },
    });
  });

  it("succeeds in posting comments", async () => {
    // コメントを登録できるようにdiveLogとdiveLogLinkを事前に作成しておく
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

    const diveLogLink = await prisma.diveLogLink.create({
      data: {
        userId,
        diveLogId: id,
        expiredAt: dayjs().add(7, "days").toDate(),
      },
    });

    const { uuid } = diveLogLink;

    const { id: buddyId1 } = await prisma.buddy.create({
      data: {
        diveLogId: id,
        userId,
        guest: {
          create: {
            name: "田中",
          },
        },
      },
    });

    const { id: buddyId2 } = await prisma.buddy.create({
      data: {
        diveLogId: id,
        userId,
        guest: {
          create: {
            name: "鈴木",
          },
        },
      },
    });

    // 1回目
    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid;
        params.buddyId = buddyId1;
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            text: "楽しかったね！またダイビング行きたいね",
          }),
        });
        expect(res.status).toBe(201);
        expect(await res.json()).toStrictEqual({});

        // DBにレコードが挿入されたことを確認
        const buddyComments = await prisma.buddyComment.findMany();
        expect(buddyComments).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              buddyId: buddyId1,
              text: "楽しかったね！またダイビング行きたいね",
            }),
          ])
        );
      },
    });

    // 2回目
    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid;
        params.buddyId = buddyId2;
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            text: "次はマンボウチャレンジしよう！",
          }),
        });
        expect(res.status).toBe(201);
        expect(await res.json()).toStrictEqual({});

        // DBにレコードが挿入されたことを確認
        const buddyComments = await prisma.buddyComment.findMany();
        expect(buddyComments).toStrictEqual(
          expect.arrayContaining([
            expect.objectContaining({
              buddyId: buddyId1,
              text: "楽しかったね！またダイビング行きたいね",
            }),
            expect.objectContaining({
              buddyId: buddyId2,
              text: "次はマンボウチャレンジしよう！",
            }),
          ])
        );
      },
    });
  });

  it("succeeds in posting a comment up to max count", async () => {
    // コメントを登録できるようにdiveLogとdiveLogLinkを事前に作成しておく
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

    const diveLogLink = await prisma.diveLogLink.create({
      data: {
        userId,
        diveLogId: id,
        expiredAt: dayjs().add(7, "days").toDate(),
      },
    });

    const { uuid } = diveLogLink;

    const { id: buddyId } = await prisma.buddy.create({
      data: {
        diveLogId: id,
        userId,
        guest: {
          create: {
            name: "田中",
          },
        },
      },
    });

    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid;
        params.buddyId = buddyId;
      },
      test: async ({ fetch }) => {
        for (let i = 0; i < 10; i++) {
          const res = await fetch({
            method: "POST",
            body: JSON.stringify({
              text: "楽しかったね！またダイビング行きたいね",
            }),
          });

          expect(res.status).toBe(201);
          expect(await res.json()).toStrictEqual({});
        }
      },
    });

    // DBにレコードが挿入されたことを確認
    const buddyComments = await prisma.buddyComment.findMany();
    expect(buddyComments).toHaveLength(10);
  });

  it("fails to post a comment when shareLink is invalid", async () => {
    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.buddyId = 100;
        params.uuid = "invalid-uuid";
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            text: "楽しかったね！またダイビング行きたいね",
          }),
        });
        expect(res.status).toBe(400);
        expect(await res.json()).toStrictEqual({
          code: "resource_not_found",
          message:
            "有効期限が切れた、または不正なURLです。バディに再度URLを発行してもらってください",
        });
      },
    });
  });

  it("fails to post a comment when buddyId is invalid", async () => {
    // コメントを登録できるようにdiveLogとdiveLogLinkを事前に作成しておく
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

    const diveLogLink = await prisma.diveLogLink.create({
      data: {
        userId,
        diveLogId: id,
        expiredAt: dayjs().add(7, "days").toDate(),
      },
    });

    const { uuid } = diveLogLink;

    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.buddyId = 0;
        params.uuid = uuid;
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            text: "楽しかったね！またダイビング行きたいね",
          }),
        });
        expect(res.status).toBe(400);
        expect(await res.json()).toStrictEqual({
          code: "resource_not_found",
          message: "存在しないバディです。",
        });
      },
    });
  });

  it("fails to post a comment when diveLog was deleted", async () => {
    // コメントを登録できるようにdiveLogとdiveLogLinkを事前に作成しておく
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
            name: "田中",
          },
        },
      },
    });

    // 作成したdiveLogを削除する
    await prisma.diveLog.deleteMany();

    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid;
        params.buddyId = buddyId;
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            text: "楽しかったね！またダイビング行きたいね",
          }),
        });
        expect(res.status).toBe(400);
        expect(await res.json()).toStrictEqual({
          code: "resource_not_found",
          message:
            "有効期限が切れた、または不正なURLです。バディに再度URLを発行してもらってください",
        });
      },
    });
  });

  it("fails to post a comment when share link was expired", async () => {
    // コメントを登録できるようにdiveLogとdiveLogLinkを事前に作成しておく
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
            name: "田中",
          },
        },
      },
    });

    // 期限切れ後の日時へ移動
    const expiredAt = dayjs().add(7, "days").toDate();
    const mock = jest.spyOn(global, "Date").mockImplementation(() => expiredAt);

    try {
      await testApiHandler({
        handler,
        paramsPatcher: (params) => {
          params.uuid = uuid;
          params.buddyId = buddyId;
        },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: "POST",
            body: JSON.stringify({
              text: "楽しかったね！またダイビング行きたいね",
            }),
          });
          expect(res.status).toBe(400);
          expect(await res.json()).toStrictEqual({
            code: "resource_not_found",
            message:
              "有効期限が切れた、または不正なURLです。バディに再度URLを発行してもらってください",
          });
        },
      });
    } finally {
      mock.mockRestore();
    }
  });

  it("fails to post a comment when max diveLogs was posted", async () => {
    // コメントを登録できるようにdiveLogとdiveLogLinkを事前に作成しておく
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
            name: "田中",
          },
        },
      },
    });

    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid;
        params.buddyId = buddyId;
      },
      test: async ({ fetch }) => {
        for (let i = 0; i < 10; i++) {
          await fetch({
            method: "POST",
            body: JSON.stringify({
              text: "楽しかったね！またダイビング行きたいね",
            }),
          });
        }

        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            text: "楽しかったね！またダイビング行きたいね",
          }),
        });
        expect(res.status).toBe(400);
        expect(await res.json()).toStrictEqual({
          code: "resource_limit_exceeded",
          message: "登録できるコメントの数は10個までです。",
        });
      },
    });
  });
});
