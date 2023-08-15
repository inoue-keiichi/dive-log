import { prisma } from "@/clients/prisma";
// import { DiveLog } from "@/schemas/diveLog";
import { testApiHandler } from "next-test-api-route-handler";
import handler from "../../../../../src/pages/api/users/[userId]/diveLogs";
import { DiveLog } from "@prisma/client";

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
        userId: "uuid",
        date: "2023-07-01",
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
    ] as DiveLog[];

    beforeAll(async () => {
      await prisma.diveLog.deleteMany();
      await prisma.diveLog.createMany({ data: DIVE_LOGS });
    });

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

  describe("existing more than two divelogs in db", () => {
    const DIVE_LOGS = [
      {
        userId: "uuid1",
        date: "2023-07-01",
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
      {
        userId: "uuid2",
        date: "2023-07-02",
        place: "Futo",
        point: "Yokobama",
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
    ] as DiveLog[];

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
          userId: "uuid1",
          date: "2023-07-01",
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
      ];

      await testApiHandler({
        handler,
        url: "/api/divingLogs?userId=uuid1",
        test: async ({ fetch }) => {
          const res = await fetch({ method: "GET" });
          const actual = await res.json();
          expect(actual).toHaveLength(1);
          expect(actual).toStrictEqual(
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
    const diveLog = {
      date: "2023-07-01",
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
    };

    await testApiHandler({
      handler,
      paramsPatcher: (params) => (params.userId = "uuid"),
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify(diveLog),
        });
        await expect(res.status).toBe(201);
        await expect(res.json()).resolves.toStrictEqual(
          expect.objectContaining({
            date: "2023-07-01",
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
          })
        );
      },
    });
  });
});
