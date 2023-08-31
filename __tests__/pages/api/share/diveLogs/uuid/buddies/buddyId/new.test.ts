import { prisma } from "@/clients/prisma";
import handler from "@/pages/api/share/diveLogs/[uuid]/buddies/new";
import dayjs from "dayjs";
import { testApiHandler } from "next-test-api-route-handler";

beforeEach(async () => {
  await prisma.buddy.deleteMany();
});

describe("POST API", () => {
  it("succeeds in creating a buddy", async () => {
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
        params.uuid = uuid;
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            name: "多田",
          }),
        });
        expect(res.status).toBe(201);
        expect(await res.json()).toStrictEqual({ buddyId: expect.anything() });

        // DBにレコードが挿入されたことを確認
        const buddy = await prisma.buddy.findFirst({
          include: {
            guest: true,
          },
        });
        expect(buddy).toStrictEqual(
          expect.objectContaining({
            userId,
            diveLogId: id,
            guest: expect.objectContaining({
              name: "多田",
            }),
          })
        );
      },
    });
  });

  it("succeeds in creating a buddy even if same name is posted twice in the diveLog", async () => {
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

    // 1回目のポスト
    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid;
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            name: "多田",
          }),
        });
        expect(res.status).toBe(201);
        expect(await res.json()).toStrictEqual({ buddyId: expect.anything() });

        // DBにレコードが挿入されたことを確認
        const buddy = await prisma.buddy.findFirst({
          include: {
            guest: true,
          },
        });
        expect(buddy).toStrictEqual(
          expect.objectContaining({
            userId,
            diveLogId: id,
            guest: expect.objectContaining({
              name: "多田",
            }),
          })
        );
      },
    });

    // 2回目のポスト。新しいバディは作成されない
    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid;
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            name: "多田",
          }),
        });
        // 新規作成しないので200
        expect(res.status).toBe(200);
        expect(await res.json()).toStrictEqual({ buddyId: expect.anything() });

        // DBにレコードが挿入されたことを確認
        const buddy = await prisma.buddy.findFirst({
          include: {
            guest: true,
          },
        });
        expect(buddy).toStrictEqual(
          expect.objectContaining({
            userId,
            diveLogId: id,
            guest: expect.objectContaining({
              name: "多田",
            }),
          })
        );
      },
    });
  });

  it("succeeds in registering same name buddies when they are different from diveLogs", async () => {
    // コメントを登録できるようにdiveLogとdiveLogLinkを事前に作成しておく
    const { id: id1, userId: userId1 } = await prisma.diveLog.create({
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

    const { uuid: uuid1 } = await prisma.diveLogLink.create({
      data: {
        userId: userId1,
        diveLogId: id1,
        expiredAt: dayjs().add(7, "days").toDate(),
      },
    });

    // 一つ目のdiveLogでバディ登録
    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid1;
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            name: "多田",
          }),
        });
        expect(res.status).toBe(201);

        // DBにレコードが挿入されたことを確認
        const buddy = await prisma.buddy.findFirst({
          include: {
            guest: true,
          },
        });
        expect(buddy).toStrictEqual(
          expect.objectContaining({
            userId: userId1,
            diveLogId: id1,
            guest: expect.objectContaining({
              name: "多田",
            }),
          })
        );
      },
    });

    // コメントを登録できるようにdiveLogとdiveLogLinkを事前に作成しておく
    const { id: id2, userId: userId2 } = await prisma.diveLog.create({
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

    const { uuid: uuid2 } = await prisma.diveLogLink.create({
      data: {
        userId: userId2,
        diveLogId: id2,
        expiredAt: dayjs().add(7, "days").toDate(),
      },
    });

    // 二つ目のdiveLogでバディ登録。一つ目と同じ名前にする
    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid2;
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            name: "多田",
          }),
        });
        expect(res.status).toBe(201);

        // 同名のバディが２つ挿入されたことを確認
        const buddies = await prisma.buddy.findMany({
          include: {
            guest: true,
          },
        });
        expect(buddies).toStrictEqual([
          expect.objectContaining({
            userId: userId1,
            diveLogId: id1,
            guest: expect.objectContaining({
              name: "多田",
            }),
          }),
          expect.objectContaining({
            userId: userId2,
            diveLogId: id2,
            guest: expect.objectContaining({
              name: "多田",
            }),
          }),
        ]);
      },
    });
  });

  it("fails to post a comment when shareLink is invalid", async () => {
    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = "invalid-uuid";
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            name: "多田",
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

    // 作成したdiveLogを削除する
    await prisma.diveLog.deleteMany();

    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid;
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            name: "多田",
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

    // 期限切れ後の日時へ移動
    const expiredAt = dayjs().add(7, "days").toDate();
    const mock = jest.spyOn(global, "Date").mockImplementation(() => expiredAt);

    try {
      await testApiHandler({
        handler,
        paramsPatcher: (params) => {
          params.uuid = uuid;
        },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: "POST",
            body: JSON.stringify({
              name: "多田",
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

  it("succeeds in posting max buddies", async () => {
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

    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid;
      },
      test: async ({ fetch }) => {
        for (let i = 0; i < 9; i++) {
          await fetch({
            method: "POST",
            body: JSON.stringify({
              name: "多田" + i,
            }),
          });
        }

        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            name: "田辺",
          }),
        });
        expect(res.status).toBe(201);
        expect(await res.json()).toStrictEqual({
          buddyId: expect.anything(),
        });
      },
    });
  });

  it("fails to post a buddy when max buddies was posted", async () => {
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

    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid;
      },
      test: async ({ fetch }) => {
        for (let i = 0; i < 10; i++) {
          await fetch({
            method: "POST",
            body: JSON.stringify({
              name: "多田" + i,
            }),
          });
        }

        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            name: "田辺",
          }),
        });
        expect(res.status).toBe(400);
        expect(await res.json()).toStrictEqual({
          code: "resource_limit_exceeded",
          message: "登録できるバディの人数は10人までです。",
        });
      },
    });
  });

  it("succeeds in posting a buddy whose name is registered when max buddies was posted", async () => {
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

    await testApiHandler({
      handler,
      paramsPatcher: (params) => {
        params.uuid = uuid;
      },
      test: async ({ fetch }) => {
        for (let i = 0; i < 10; i++) {
          await fetch({
            method: "POST",
            body: JSON.stringify({
              name: "多田" + i,
            }),
          });
        }

        // 登録済みのバディ名を指定
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({
            name: "多田0",
          }),
        });
        expect(res.status).toBe(200);
        expect(await res.json()).toStrictEqual({
          buddyId: expect.anything(),
        });
      },
    });
  });
});
