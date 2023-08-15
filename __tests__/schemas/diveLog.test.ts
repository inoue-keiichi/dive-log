import { diveLogSchema } from "@/schemas/diveLog";

const divelog = {
  date: "2022-04-01",
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
    ["max", "あ".repeat(63), "あ".repeat(63)],
    ["empty", "", ""],
    ["null", null, null],
    ["undefined", undefined, undefined],
  ])("place is %s", async (_, place, expected) => {
    const actual = diveLogSchema.safeParse({ ...divelog, place });
    expect(actual.success).toBeTruthy();

    if (!actual.success) {
      fail("failed safe parse");
    }
    expect(actual.data).toStrictEqual(
      expect.objectContaining({
        ...divelog,
        place: expected,
      })
    );
  });

  test.each([["max", "あ".repeat(64)]])(
    "fail when place is %s",
    async (_, place) => {
      const actual = diveLogSchema.safeParse({ ...divelog, place });
      expect(actual.success).toBeFalsy();
    }
  );

  test.each([
    ["max", "あ".repeat(63), "あ".repeat(63)],
    ["empty", "", ""],
    ["null", null, null],
    ["undefined", undefined, undefined],
  ])("point is %s", async (_, point, expected) => {
    const actual = diveLogSchema.safeParse({ ...divelog, point });
    expect(actual.success).toBeTruthy();

    if (!actual.success) {
      fail("failed safe parse");
    }
    expect(actual.data).toStrictEqual(
      expect.objectContaining({
        ...divelog,
        point: expected,
      })
    );
  });

  test.each([["max", "あ".repeat(64)]])(
    "fail when point is %s",
    async (_, point) => {
      const actual = diveLogSchema.safeParse({ ...divelog, point });
      expect(actual.success).toBeFalsy();
    }
  );

  test.each([
    ["min", "00:00", "00:00"],
    ["max", "23:59", "23:59"],
    ["empty", "", undefined],
    ["null", null, null],
    ["undefined", undefined, undefined],
  ])("divingStartTime is %s", async (_, divingStartTime, expected) => {
    const actual = diveLogSchema.safeParse({ ...divelog, divingStartTime });
    expect(actual.success).toBeTruthy();

    if (!actual.success) {
      fail("failed safe parse");
    }
    expect(actual.data).toStrictEqual(
      expect.objectContaining({
        ...divelog,
        divingStartTime: expected,
      })
    );
  });

  test.each([
    ["upper limit", "24:00"],
    ["invalid format", "12時30分"],
    ["invalid delimiter", "12 30"],
    ["invalid HH", "0:30"],
    ["invalid mm", "10:5"],
  ])("fail when divingStartTime is %s", async (_, divingStartTime) => {
    const actual = diveLogSchema.safeParse({ ...divelog, divingStartTime });
    expect(actual.success).toBeFalsy();
  });

  test.each([
    ["min", "00:00", "00:00"],
    ["max", "23:59", "23:59"],
    ["empty", "", undefined],
    ["null", null, null],
    ["undefined", undefined, undefined],
  ])("divingEndTime is %s", async (_, divingEndTime, expected) => {
    const actual = diveLogSchema.safeParse({ ...divelog, divingEndTime });
    expect(actual.success).toBeTruthy();

    if (!actual.success) {
      fail("failed safe parse");
    }
    expect(actual.data).toStrictEqual(
      expect.objectContaining({
        ...divelog,
        divingEndTime: expected,
      })
    );
  });

  test.each([
    ["upper limit", "24:00"],
    ["invalid format", "12時30分"],
    ["invalid delimiter", "12 30"],
    ["invalid HH", "0:30"],
    ["invalid mm", "10:5"],
  ])("fail when divingEndTime is %s", async (_, divingEndTime) => {
    const actual = diveLogSchema.safeParse({ ...divelog, divingEndTime });
    expect(actual.success).toBeFalsy();
  });

  test.each([
    ["min_number", 0, 0],
    ["max_number", 100, 100],
    ["number_string", "0", 0],
    ["empty", "", undefined],
    ["null", null, null],
    ["undefined", undefined, undefined],
  ])("averageDepth is %s", async (_, averageDepth, expected) => {
    const actual = diveLogSchema.safeParse({ ...divelog, averageDepth });
    expect(actual.success).toBeTruthy();

    if (!actual.success) {
      fail("failed safe parse");
    }
    expect(actual.data).toStrictEqual(
      expect.objectContaining({
        ...divelog,
        averageDepth: expected,
      })
    );
  });

  test.each([
    ["upper_limit", 101],
    ["fall_limit", -1],
    ["fall_limit_string", "-1"],
  ])("fail when averageDepth is %s", async (_, averageDepth) => {
    const actual = diveLogSchema.safeParse({ ...divelog, averageDepth });
    expect(actual.success).toBeFalsy();
  });

  test.each([
    ["min_number", 0, 0],
    ["max_number", 100, 100],
    ["number_string", "0", 0],
    ["empty", "", undefined],
    ["null", null, null],
    ["undefined", undefined, undefined],
  ])("maxDepth is %s", async (_, maxDepth, expected) => {
    const actual = diveLogSchema.safeParse({ ...divelog, maxDepth });
    expect(actual.success).toBeTruthy();

    if (!actual.success) {
      fail("failed safe parse");
    }
    expect(actual.data).toStrictEqual(
      expect.objectContaining({
        ...divelog,
        maxDepth: expected,
      })
    );
  });

  test.each([
    ["upper_limit", 101],
    ["fall_limit", -1],
    ["fall_limit_string", "-1"],
  ])("fail when maxDepth is %s", async (_, maxDepth) => {
    const actual = diveLogSchema.safeParse({ ...divelog, maxDepth });
    expect(actual.success).toBeFalsy();
  });

  test.each([
    ["min_number", 0, 0],
    ["max_number", 500, 500],
    ["number_string", "0", 0],
    ["empty", "", undefined],
    ["null", null, null],
    ["undefined", undefined, undefined],
  ])("tankStartPressure is %s", async (_, tankStartPressure, expected) => {
    const actual = diveLogSchema.safeParse({ ...divelog, tankStartPressure });
    expect(actual.success).toBeTruthy();

    if (!actual.success) {
      fail("failed safe parse");
    }
    expect(actual.data).toStrictEqual(
      expect.objectContaining({
        ...divelog,
        tankStartPressure: expected,
      })
    );
  });

  test.each([
    ["upper_limit", 501],
    ["fall_limit", -1],
    ["fall_limit_string", "-1"],
  ])("fail when tankStartPressure is %s", async (_, tankStartPressure) => {
    const actual = diveLogSchema.safeParse({ ...divelog, tankStartPressure });
    expect(actual.success).toBeFalsy();
  });

  test.each([
    ["min_number", 0, 0],
    ["max_number", 500, 500],
    ["number_string", "0", 0],
    ["empty", "", undefined],
    ["null", null, null],
    ["undefined", undefined, undefined],
  ])("tankEndPressure is %s", async (_, tankEndPressure, expected) => {
    const actual = diveLogSchema.safeParse({ ...divelog, tankEndPressure });
    expect(actual.success).toBeTruthy();

    if (!actual.success) {
      fail("failed safe parse");
    }
    expect(actual.data).toStrictEqual(
      expect.objectContaining({
        ...divelog,
        tankEndPressure: expected,
      })
    );
  });

  test.each([
    ["upper_limit", 501],
    ["fall_limit", -1],
    ["fall_limit_string", "-1"],
  ])("fail when tankEndPressure is %s", async (_, tankEndPressure) => {
    const actual = diveLogSchema.safeParse({ ...divelog, tankEndPressure });
    expect(actual.success).toBeFalsy();
  });

  test.each([
    ["steel", "STEEL", "STEEL"],
    ["aluminum", "ALUMINUM", "ALUMINUM"],
    ["empty", "", undefined],
    ["null", null, null],
    ["undefined", undefined, undefined],
  ])("tankKind is %s", async (_, tankKind, expected) => {
    const actual = diveLogSchema.safeParse({ ...divelog, tankKind });
    expect(actual.success).toBeTruthy();

    if (!actual.success) {
      fail("failed safe parse");
    }
    expect(actual.data).toStrictEqual(
      expect.objectContaining({
        ...divelog,
        tankKind: expected,
      })
    );
  });

  test.each([["invalid value", "STEELL"]])(
    "fail when tankKind is %s",
    async (_, tankKind) => {
      const actual = diveLogSchema.safeParse({ ...divelog, tankKind });
      expect(actual.success).toBeFalsy();
    }
  );

  test.each([
    ["min_number", 0, 0],
    ["max_number", 50, 50],
    ["number_string", "0", 0],
    ["empty", "", undefined],
    ["null", null, null],
    ["undefined", undefined, undefined],
  ])("weight is %s", async (_, weight, expected) => {
    const actual = diveLogSchema.safeParse({ ...divelog, weight });
    expect(actual.success).toBeTruthy();

    if (!actual.success) {
      fail("failed safe parse");
    }
    expect(actual.data).toStrictEqual(
      expect.objectContaining({
        ...divelog,
        weight: expected,
      })
    );
  });

  test.each([
    ["upper_limit", 51],
    ["fall_limit", -1],
    ["fall_limit_string", "-1"],
  ])("fail when weight is %s", async (_, weight) => {
    const actual = diveLogSchema.safeParse({ ...divelog, weight });
    expect(actual.success).toBeFalsy();
  });

  test.each([
    ["wet", "WET", "WET"],
    ["dry", "DRY", "DRY"],
    ["empty", "", undefined],
    ["null", null, null],
    ["undefined", undefined, undefined],
  ])("suit is %s", async (_, suit, expected) => {
    const actual = diveLogSchema.safeParse({ ...divelog, suit });
    expect(actual.success).toBeTruthy();

    if (!actual.success) {
      fail("failed safe parse");
    }
    expect(actual.data).toStrictEqual(
      expect.objectContaining({
        ...divelog,
        suit: expected,
      })
    );
  });

  test.each([["invalid value", "WETT"]])(
    "fail when suit is %s",
    async (_, suit) => {
      const actual = diveLogSchema.safeParse({ ...divelog, suit });
      expect(actual.success).toBeFalsy();
    }
  );

  test.each([
    ["steel", "SUNNY", "SUNNY"],
    ["sunny_cloudy", "SUNNY_CLOUDY", "SUNNY_CLOUDY"],
    ["cloudy", "CLOUDY", "CLOUDY"],
    ["rainy", "RAINY", "RAINY"],
    ["snowy", "SNOWY", "SNOWY"],
    ["empty", "", undefined],
    ["null", null, null],
    ["undefined", undefined, undefined],
  ])("weather is %s", async (_, weather, expected) => {
    const actual = diveLogSchema.safeParse({ ...divelog, weather });
    expect(actual.success).toBeTruthy();

    if (!actual.success) {
      fail("failed safe parse");
    }
    expect(actual.data).toStrictEqual(
      expect.objectContaining({
        ...divelog,
        weather: expected,
      })
    );
  });

  test.each([["invalid value", "SUNNYY"]])(
    "fail when weather is %s",
    async (_, weather) => {
      const actual = diveLogSchema.safeParse({ ...divelog, weather });
      expect(actual.success).toBeFalsy();
    }
  );

  test.each([
    ["min_number", -100, -100],
    ["max_number", 100, 100],
    ["zero", 0, 0],
    ["number_string", "0", 0],
    ["empty", "", undefined],
    ["null", null, null],
    ["undefined", undefined, undefined],
  ])("temprature is %s", async (_, temprature, expected) => {
    const actual = diveLogSchema.safeParse({ ...divelog, temprature });
    expect(actual.success).toBeTruthy();

    if (!actual.success) {
      fail("failed safe parse");
    }
    expect(actual.data).toStrictEqual(
      expect.objectContaining({
        ...divelog,
        temprature: expected,
      })
    );
  });

  test.each([
    ["upper_limit", 101],
    ["fall_limit", -101],
    ["fall_limit_string", "-101"],
  ])("fail when temprature is %s", async (_, temprature) => {
    const actual = diveLogSchema.safeParse({ ...divelog, temprature });
    expect(actual.success).toBeFalsy();
  });

  test.each([
    ["min_number", -10, -10],
    ["max_number", 50, 50],
    ["zero", 0, 0],
    ["number_string", "0", 0],
    ["empty", "", undefined],
    ["null", null, null],
    ["undefined", undefined, undefined],
  ])("waterTemprature is %s", async (_, waterTemprature, expected) => {
    const actual = diveLogSchema.safeParse({ ...divelog, waterTemprature });
    expect(actual.success).toBeTruthy();

    if (!actual.success) {
      fail("failed safe parse");
    }
    expect(actual.data).toStrictEqual(
      expect.objectContaining({
        ...divelog,
        waterTemprature: expected,
      })
    );
  });

  test.each([
    ["upper_limit", 51],
    ["fall_limit", -11],
    ["fall_limit_string", "-11"],
  ])("fail when waterTemprature is %s", async (_, waterTemprature) => {
    const actual = diveLogSchema.safeParse({ ...divelog, waterTemprature });
    expect(actual.success).toBeFalsy();
  });

  test.each([
    ["min_number", 0, 0],
    ["max_number", 100, 100],
    ["number_string", "0", 0],
    ["empty", "", undefined],
    ["null", null, null],
    ["undefined", undefined, undefined],
  ])("transparency is %s", async (_, transparency, expected) => {
    const actual = diveLogSchema.safeParse({ ...divelog, transparency });
    expect(actual.success).toBeTruthy();

    if (!actual.success) {
      fail("failed safe parse");
    }
    expect(actual.data).toStrictEqual(
      expect.objectContaining({
        ...divelog,
        transparency: expected,
      })
    );
  });

  test.each([
    ["upper_limit", 101],
    ["minus", -1],
    ["minus_string", "-1"],
  ])("fail when transparency is %s", async (_, transparency) => {
    const actual = diveLogSchema.safeParse({ ...divelog, transparency });
    expect(actual.success).toBeFalsy();
  });

  test.each([
    ["max", "あ".repeat(511), "あ".repeat(511)],
    ["empty", "", ""],
    ["null", null, null],
    ["undefined", undefined, undefined],
  ])("memo is %s", async (_, memo, expected) => {
    const actual = diveLogSchema.safeParse({ ...divelog, memo });
    expect(actual.success).toBeTruthy();

    if (!actual.success) {
      fail("failed safe parse");
    }
    expect(actual.data).toStrictEqual(
      expect.objectContaining({
        ...divelog,
        memo: expected,
      })
    );
  });

  test.each([["max", "あ".repeat(512)]])(
    "fail when memo is %s",
    async (_, memo) => {
      const actual = diveLogSchema.safeParse({ ...divelog, memo });
      expect(actual.success).toBeFalsy();
    }
  );
});
