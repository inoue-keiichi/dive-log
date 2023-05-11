import { diveLogSchema } from "@/schemas/diveLog";

const divelog = {
  date: "2022-04-01",
  point: "Ose",
  waterTemprature: 28,
  transparency: 8,
};

describe("diveLogSchema", () => {
  test.each([
    ["max", "あ".repeat(63)],
    ["empty", ""],
    ["null", null],
    ["undefined", undefined],
  ])("point is %s", async (_, point) => {
    const actual = diveLogSchema.safeParse({ ...divelog, point });
    expect(actual.success).toBeTruthy();
  });

  test.each([["max", "あ".repeat(64)]])(
    "fail when point is %s",
    async (_, point) => {
      const actual = diveLogSchema.safeParse({ ...divelog, point });
      expect(actual.success).toBeFalsy();
    }
  );

  test.each([
    ["number", 0],
    ["number_string", "0"],
    ["empty", ""],
    ["null", null],
    ["undefined", undefined],
  ])("transparency is %s", async (_, transparency) => {
    const actual = diveLogSchema.safeParse({ ...divelog, transparency });
    expect(actual.success).toBeTruthy();
  });

  test.each([
    ["minus", -1],
    ["minus_string", "-1"],
  ])("fail when transparency is %s", async (_, transparency) => {
    const actual = diveLogSchema.safeParse({ ...divelog, transparency });
    expect(actual.success).toBeFalsy();
  });

  test.each([
    ["number", 0],
    ["number_string", "0"],
    ["empty", ""],
    ["null", null],
    ["undefined", undefined],
  ])("waterTemprature is %s", async (_, waterTemprature) => {
    const actual = diveLogSchema.safeParse({ ...divelog, waterTemprature });
    expect(actual.success).toBeTruthy();
  });
});
