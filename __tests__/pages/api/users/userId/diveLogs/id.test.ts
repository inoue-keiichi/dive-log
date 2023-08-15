import { prisma } from "@/clients/prisma";
import { testApiHandler } from "next-test-api-route-handler";
import handler from "../../../../../../src/pages/api/users/[userId]/diveLogs/[id]";

beforeAll(async () => {
  await prisma.diveLog.deleteMany();
});

describe("PUT API", () => {
  //TODO: 400系のテストかく
  test("succeeded in updating a diving log", async () => {
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
          method: "PUT",
          body: JSON.stringify({
            date: "2023-08-16",
            place: "Futo",
            point: "Yokobama",
            divingStartTime: "13:00",
            divingEndTime: "13:40",
            averageDepth: 30,
            maxDepth: 40,
            tankStartPressure: 250,
            tankEndPressure: 0,
            tankKind: "ALUMINUM",
            weight: 10,
            suit: "DRY",
            weather: "CLOUDY",
            temprature: 20,
            waterTemprature: 18,
            transparency: 15,
            memo: "It was a cold day...",
          }),
        });
        await expect(res.status).toBe(200);
        await expect(res.json()).resolves.toStrictEqual(
          expect.objectContaining({
            id,
            userId,
            date: "2023-08-16",
            place: "Futo",
            point: "Yokobama",
            divingStartTime: "13:00",
            divingEndTime: "13:40",
            averageDepth: 30,
            maxDepth: 40,
            tankStartPressure: 250,
            tankEndPressure: 0,
            tankKind: "ALUMINUM",
            weight: 10,
            suit: "DRY",
            weather: "CLOUDY",
            temprature: 20,
            waterTemprature: 18,
            transparency: 15,
            memo: "It was a cold day...",
          })
        );
      },
    });
  });

  test("succeeded in updating a diving log without properties", async () => {
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
          method: "PUT",
          body: JSON.stringify({
            date: "2023-08-15",
            place: "",
            point: "",
            memo: "",
          }),
        });
        await expect(res.status).toBe(200);
        await expect(res.json()).resolves.toStrictEqual(
          expect.objectContaining({
            id,
            userId,
            date: "2023-08-15",
            place: "",
            point: "",
            memo: "",
          })
        );
      },
    });
  });
});

describe("GET API", () => {
  //TODO: 400系のテストかく
  test("succeeded in getting a diving log", async () => {
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
          method: "GET",
        });
        await expect(res.status).toBe(200);
        await expect(res.json()).resolves.toStrictEqual(
          expect.objectContaining({
            id,
            userId,
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
          })
        );
      },
    });
  });
});

describe("DELETE API", () => {
  //TODO: 400系のテストかく
  test("succeeded in deleting a diving log", async () => {
    const diveLog = await prisma.diveLog.create({
      data: {
        date: "2023-07-01",
        point: "Kerama",
        transparency: 30,
        waterTemprature: 42,
        userId: "uuid",
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
          method: "DELETE",
        });
        await expect(res.status).toBe(200);
        await expect(res.json()).resolves.toStrictEqual(
          expect.objectContaining({})
        );
      },
    });
  });
});
