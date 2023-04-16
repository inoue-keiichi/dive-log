import { prisma } from "@/clients/prisma";
import { NewDiveLog } from "@/schemas/diveLog";
import { testApiHandler } from "next-test-api-route-handler";
import handler from "../../../src/pages/api/diveLogs";

describe("GET API", () => {
  describe("not existing divelogs in db", () => {
    // TODO: テスト全体で実行される様にする
    beforeAll(async () => {
      await prisma.diveLog.deleteMany();
    });

    test("succeeded in getting diving logs", async () => {
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: "GET" });
          await expect(res.json()).resolves.toStrictEqual([]);
        },
      });
    });
  });

  describe("existing one divelog in db", () => {
    const DIVE_LOGS = [
      {
        point: "Ose",
        transparency: 22,
        waterTemprature: 30,
        userId: "uuid",
      },
    ];

    beforeAll(async () => {
      await prisma.diveLog.deleteMany();
      await prisma.diveLog.createMany({ data: DIVE_LOGS });
    });

    // afterAll(async () => {
    //   await prisma.diveLog.deleteMany();
    // });

    test("succeeded in getting one diving log", async () => {
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: "GET" });
          const actual = await res.json();
          await expect(actual).toHaveLength(1);
          await expect(actual).toStrictEqual(
            expect.arrayContaining(
              DIVE_LOGS.map((log) => expect.objectContaining(log))
            )
          );
        },
      });
    });

    test("succeeded in getting one diving log with uuid", async () => {
      await testApiHandler({
        handler,
        url: "/api/diveLogs?userId=uuid",
        test: async ({ fetch }) => {
          const res = await fetch({ method: "GET" });
          const actual = await res.json();
          await expect(actual).toHaveLength(1);
          await expect(actual).toStrictEqual(
            expect.arrayContaining(
              DIVE_LOGS.map((log) => expect.objectContaining(log))
            )
          );
        },
      });
    });
  });

  describe("existing more than two divelogs in db", () => {
    const DIVE_LOGS = [
      {
        point: "Ose",
        transparency: 22,
        waterTemprature: 30,
        userId: "uuid1",
      },
      {
        point: "Kawana",
        transparency: 10,
        waterTemprature: 25,
        userId: "uuid2",
      },
    ];

    beforeAll(async () => {
      await prisma.diveLog.deleteMany();
      await prisma.diveLog.createMany({ data: DIVE_LOGS });
    });

    afterAll(async () => {
      await prisma.diveLog.deleteMany();
    });

    test("succeeded in getting diving logs", async () => {
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: "GET" });
          const actual = await res.json();
          await expect(actual).toHaveLength(2);
          await expect(actual).toStrictEqual(
            expect.arrayContaining(
              DIVE_LOGS.map((log) => expect.objectContaining(log))
            )
          );
        },
      });
    });

    test("succeeded in getting diving logs with userId", async () => {
      const expected = [
        {
          point: "Ose",
          transparency: 22,
          waterTemprature: 30,
          userId: "uuid1",
        },
      ];

      await testApiHandler({
        handler,
        url: "/api/divingLogs?userId=uuid1",
        test: async ({ fetch }) => {
          const res = await fetch({ method: "GET" });
          const actual = await res.json();
          await expect(actual).toHaveLength(1);
          await expect(actual).toStrictEqual(
            expect.arrayContaining(
              expected.map((log) => expect.objectContaining(log))
            )
          );
        },
      });
    });

    test("succeeded in getting nothing with uuid", async () => {
      await testApiHandler({
        handler,
        url: "/api/divingLogs?userId=nothingId",
        test: async ({ fetch }) => {
          const res = await fetch({ method: "GET" });
          await expect(res.json()).resolves.toStrictEqual([]);
        },
      });
    });
  });
});

describe("POST API", () => {
  beforeAll(async () => {
    await prisma.diveLog.deleteMany();
  });

  //TODO: 400系のテストかく
  test("succeeded in creating a new diving log", async () => {
    const diveLog: NewDiveLog = {
      point: "Kerama",
      transparency: 30,
      waterTemprature: 42,
      userId: "uuid",
    };

    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify(diveLog),
        });
        await expect(res.status).toBe(201);
        await expect(res.json()).resolves.toStrictEqual(
          expect.objectContaining(diveLog)
        );
      },
    });
  });
});
