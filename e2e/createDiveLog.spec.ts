import { expect, test } from "@playwright/test";
import { prisma } from "../src/clients/prisma";
import { PagePilot } from "./__utils__/diveLog";

const account = {
  email: `example+e2e_20230910B@gmail.com`,
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

const updatedDiveLog = {
  date: "2023-08-16",
  place: "Futo",
  point: "Yokobama",
  averageDepth: 30,
  maxDepth: 40,
  tankStartPressure: 250,
  tankEndPressure: 0,
  weight: 10,
  temprature: 20,
  waterTemprature: 18,
  transparency: 15,
  memo: "It was a cold day...",
};

test.beforeEach(async () => {
  await prisma.diveLog.deleteMany();
});

test("create a new DiveLog with sign in", async ({ page }) => {
  const pagePilot = new PagePilot(page);

  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("http://localhost:3000");
  await expect(page.locator("header button")).not.toHaveText("Logout");

  // Sign in
  await page.getByLabel("Email address").fill(account.email);
  await page.getByLabel("Your Password").fill(account.password);
  await page.getByText("Sign in").click();

  // Move to diveLogs page.
  await expect(page).toHaveURL("http://localhost:3000/diveLogs");
  await expect(page.locator("header button")).toHaveText("Logout");
  await page.getByText("新規追加").click();
  // Move to a new diveLog page and edit it.
  await expect(page).toHaveURL("http://localhost:3000/diveLogs/new");
  await pagePilot.fill(diveLog);
  await pagePilot.selectSteel();
  await pagePilot.selectWet();
  await pagePilot.selectSunny();
  await pagePilot.fillDivingStartTime({ hour: 9, minute: 30 });
  await pagePilot.fillDivingEndTime({ hour: 10, minute: 0 });
  // TODO: 入力できてるか確認したほうが良い？
  await page.getByText("追加").click();
  // Expect to add it to diveLogs.
  await expect(page).toHaveURL("http://localhost:3000/diveLogs");
  // TODO: リストにログブックが増えたことを評価するもっと良い方法が欲しい
  await expect(page.getByText("編集")).toHaveCount(1);
  // Update the diveLog.
  await page.getByTestId("dive-log-card-0").getByText("編集").click();
  await expect(page).toHaveURL(/http:\/\/localhost:3000\/diveLogs\/\d+/);
  await pagePilot.fill(updatedDiveLog);
  await pagePilot.selectAluminum();
  await pagePilot.selectDry();
  await pagePilot.selectCloudy();
  await pagePilot.fillDivingStartTime({ hour: 13, minute: 0 });
  await pagePilot.fillDivingEndTime({ hour: 13, minute: 40 });
  await page.getByText("上書き").click();
  await expect(page.getByText("編集")).toHaveCount(1);
  // TODO: 上書きされたことを確認する。まだcardのデザイン決めてないので後で
  // もう一度編集ページに入れば良いだけか

  // Back Page
  await page.getByTestId("dive-log-card-0").getByText("編集").click();
  await expect(page).toHaveURL(/http:\/\/localhost:3000\/diveLogs\/\d+/);
  await page.getByTestId("back-button").click();
  // Delete the diveLog.
  await page.getByTestId("dive-log-card-0").getByText("編集").click();
  await expect(page).toHaveURL(/http:\/\/localhost:3000\/diveLogs\/\d+/);
  await page.getByTestId("dive-log-delete-button").click();
  await expect(page.getByText("編集")).toHaveCount(0);
});
