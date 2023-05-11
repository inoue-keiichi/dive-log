import { diveLogSchema } from "@/schemas/diveLog";

const divelog = {
  date: "2022-04-01",
  point: "Ose",
  waterTemprature: 28,
  transparency: 8,
};

describe("diveLogSchema", () => {
  test("normal test", async () => {
    const actual = diveLogSchema.safeParse(divelog);
    expect(actual.success).toBeTruthy();
  });

  // TODO: 04-31 → 05-01 になるのはいいのか？
  test.skip("date", async () => {
    const actual = diveLogSchema.safeParse({ ...divelog, date: "2022-04-31" });
    expect(actual.success).toBeTruthy();
    if (!actual.success) {
      throw new Error();
    }
    expect(actual.data).toStrictEqual({ ...divelog, date: "2022-05-01" });
  });

  test.each([
    ["invalid month", "2022-13-01"],
    ["invalid day", "2022-01-32"],
    ["invalid format", "2022/01/01"],
  ])("fail when date is %s", async (_, date) => {
    const actual = diveLogSchema.safeParse({ ...divelog, date });
    expect(actual.success).toBeFalsy();
  });

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
    ["min_number", 0],
    ["max_number", 100],
    ["number_string", "0"],
    ["empty", ""],
    ["null", null],
    ["undefined", undefined],
  ])("waterTemprature is %s", async (_, waterTemprature) => {
    const actual = diveLogSchema.safeParse({ ...divelog, waterTemprature });
    expect(actual.success).toBeTruthy();
  });

  test.each([
    ["upper_limit", 101],
    ["fall_limit", -101],
    ["fall_limit_string", "-101"],
  ])("fail when waterTemprature is %s", async (_, waterTemprature) => {
    const actual = diveLogSchema.safeParse({ ...divelog, waterTemprature });
    expect(actual.success).toBeFalsy();
  });

  test.each([
    ["min_number", 0],
    ["max_number", 100],
    ["number_string", "0"],
    ["empty", ""],
    ["null", null],
    ["undefined", undefined],
  ])("transparency is %s", async (_, transparency) => {
    const actual = diveLogSchema.safeParse({ ...divelog, transparency });
    expect(actual.success).toBeTruthy();
  });

  test.each([
    ["upper_limit", 101],
    ["minus", -1],
    ["minus_string", "-1"],
  ])("fail when transparency is %s", async (_, transparency) => {
    const actual = diveLogSchema.safeParse({ ...divelog, transparency });
    expect(actual.success).toBeFalsy();
  });
});
