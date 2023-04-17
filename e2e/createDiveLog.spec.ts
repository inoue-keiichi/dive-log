import { test, expect } from "@playwright/test";

const account = {
  email: "inouejai+e2e001@gmail.com",
  password: "e2etest",
};

const diveLog = {
  point: "Ose",
  waterTemprature: 23,
  transparency: 5,
};

const updatedDiveLog = {
  point: "Futo",
  waterTemprature: 25,
  transparency: 8,
};

// TODO: DBを初期化してからテスト実行したい

test("create a new DiveLog with sign up", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("http://localhost:3000/");
  // Sign in
  await page.getByLabel("Email address").fill(account.email);
  await page.getByLabel("Your Password").fill(account.password);
  await page.getByText("Sign in").click();
  // Move to diveLogs page.
  await expect(page).toHaveURL("http://localhost:3000/diveLogs");
  await page.getByText("新規追加").click();
  // Move to a new diveLog page and edit it.
  await expect(page).toHaveURL("http://localhost:3000/diveLogs/new");
  await page.getByLabel("ポイント").fill(`${diveLog.point}`);
  await page.getByLabel("水温").fill(`${diveLog.waterTemprature}`);
  await page.getByLabel("透明度").fill(`${diveLog.transparency}`);
  await page.getByText("追加").click();
  // Expect to add it to diveLogs.
  await expect(page).toHaveURL("http://localhost:3000/diveLogs");
  // TODO: リストにログブックが増えたことを評価するもっと良い方法が欲しい
  await expect(page.getByText("編集")).toHaveCount(1);
  // Update the diveLog.
  await page.getByTestId("dive-log-card-0").getByText("編集").click();
  await expect(page).toHaveURL(/http:\/\/localhost:3000\/diveLogs\/\d+/);
  await page.getByLabel("ポイント").fill(`${updatedDiveLog.point}`);
  await page.getByLabel("水温").fill(`${updatedDiveLog.waterTemprature}`);
  await page.getByLabel("透明度").fill(`${updatedDiveLog.transparency}`);
  await page.getByText("上書き").click();
  await expect(page.getByText("編集")).toHaveCount(1);
  // TODO: 上書きされたことを確認する。まだcardのデザイン決めてないので後で
});
