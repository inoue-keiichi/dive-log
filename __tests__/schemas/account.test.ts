import { accountSchema } from "@/schemas/account";

const account = {
  email: "example@example.com",
  password: "password",
};

describe("accountSchema", () => {
  test("normal test", async () => {
    const actual = accountSchema.safeParse(account);
    expect(actual.success).toBeTruthy();
  });

  test.each([
    ["empty", ""],
    ["no domain", "example"],
    ["no local", "@example.com"],
    ["no @", "exampleexample.com"],
  ])("fail when email is %s", async (_, email) => {
    const actual = accountSchema.safeParse({ ...account, email });
    expect(actual.success).toBeFalsy();
  });

  test.each([["max", "a".repeat(31)]])(
    "succeed when password is %s",
    async (_, password) => {
      const actual = accountSchema.safeParse({ ...account, password });
      expect(actual.success).toBeTruthy();
    }
  );

  test.each([
    ["empty", ""],
    ["lower_limit ", "a".repeat(5)],
    ["upper_limit ", "a".repeat(32)],
  ])("fail when password is %s", async (_, password) => {
    const actual = accountSchema.safeParse({ ...account, password });
    expect(actual.success).toBeFalsy();
  });
});
