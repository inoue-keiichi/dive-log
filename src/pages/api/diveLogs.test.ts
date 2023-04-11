import { prisma } from "@/clients/prisma";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { testApiHandler } from "next-test-api-route-handler";
import handler from "./diveLogs";

// TODO: テスト全体で実行される様にする
beforeAll(async () => {
  await prisma.diveLog.deleteMany();
});

describe("not existing divelogs in db", () => {
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

describe("existing divelogs in db", () => {
  const DIVE_LOGS = [
    {
      point: "Ose",
      transparency: 22,
      waterTemprature: 30,
      userId: "uuId",
    },
  ];

  beforeAll(async () => {
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
        await expect(res.json()).resolves.toStrictEqual(DIVE_LOGS);
      },
    });
  });
});
