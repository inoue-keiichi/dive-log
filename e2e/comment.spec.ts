import { expect, test } from "@playwright/test";
import { PagePilot } from "./__utils__/diveLog";

const account = {
  // 同じアカウントだと前のテストで追加したログブックの影響を受けてテストが落ちるので新規のアカウントでテストする
  email: `comment+e2e_${Date.now()}@gmail.com`,
  password: "e2etest",
};

const diveLog = {
  date: "2023-08-15",
  place: "Ose",
  point: "Wannai",
  averageDepth: 18,
  maxDepth: 25,
  tankStartPressure: 200,
  tankEndPressure: 50,
  weight: 5,
  temprature: 35,
  waterTemprature: 28,
  transparency: 8,
  memo: "Good Diving!!",
};

test("create a new DiveLog with sign up", async ({ context, page }) => {
  // 権限を追加する
  await context.grantPermissions([
    "clipboard-write", // ブラウザの操作で必要
    "clipboard-read", // テストでの検証で必要
  ]);
  const pagePilot = new PagePilot(page);

  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("http://localhost:3000/");
  // Sign up
  await page.getByText("Don't have an account? Sign up").click();
  await page.getByLabel("Email address").fill(account.email);
  await page.getByLabel("Create a Password").fill(account.password);
  await page.getByText("Sign up").click();

  // Move to diveLogs page.
  await expect(page).toHaveURL("http://localhost:3000/diveLogs");
  await page.getByText("新規追加").click();
  // Move to a new diveLog page and edit it.
  await pagePilot.fill(diveLog);
  await pagePilot.fillDivingStartTime({ hour: 9, minute: 30 });
  await pagePilot.fillDivingEndTime({ hour: 10, minute: 0 });
  // TODO: 入力できてるか確認したほうが良い？
  await page.getByText("追加").click();

  // Locate comment page.
  await page
    .getByTestId("dive-log-card-0")
    .getByText("バディにコメントをもらう")
    .click();
  await page.getByText("コメントページのリンクをコピー").click();
  // クリップボードの中身を取得して検証
  const url = await page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });
  expect(url).toMatch(/http:\/\/localhost:3000\/share\/diveLogs\/[\d\w-]+/);

  await page.goto(url!);
  await page.getByLabel("名前").fill(`井上`);
  await page.getByText("次へ").click();
  await page.getByLabel("コメント").fill(`久しぶりのダイビング楽しかった`);
  await page.getByText("送信").click();
  await expect(page.locator("ul")).toContainText([
    "久しぶりのダイビング楽しかった",
  ]);
});
