import { prisma } from "@/clients/prisma";
import { DiveLog } from "@/schemas/diveLog";
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
        point: "Kerama",
        transparency: 30,
        waterTemprature: 42,
        userId: "uuid",
      },
    });

    const updatedDiveLog = {
      point: "Malapascua",
      transparency: 50,
      waterTemprature: 50,
    };

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
          body: JSON.stringify(updatedDiveLog),
        });
        await expect(res.status).toBe(200);
        await expect(res.json()).resolves.toStrictEqual(
          expect.objectContaining(updatedDiveLog)
        );
      },
    });
  });
});