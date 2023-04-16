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

// TODO: DBを初期化してからテスト実行したい

test("create a new DiveLog with sign up", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("http://localhost:3000/");
  // Sign in
  await page.getByLabel("Email address").fill(account.email);
  await page.getByLabel("Your Password").fill(account.password);
  await page.getByText("Sign in").click();

  await expect(page).toHaveURL("http://localhost:3000/diveLogs");
  await page.getByText("新規追加").click();

  await expect(page).toHaveURL("http://localhost:3000/diveLogs/new");
  // await page.locator("#point").fill(diveLog.point);
  await page.getByLabel("ポイント").fill(`${diveLog.point}`);
  await page.getByLabel("水温").fill(`${diveLog.waterTemprature}`);
  await page.getByLabel("透明度").fill(`${diveLog.transparency}`);
  await page.getByText("追加").click();
  await expect(page).toHaveURL("http://localhost:3000/diveLogs");
  // TODO: リストにログブックが増えたことを評価するもっと良い方法が欲しい
  await expect(page.getByText("編集")).toHaveCount(1);
});
