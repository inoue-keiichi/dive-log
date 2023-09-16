import { expect, test } from "@playwright/test";
import { prisma } from "../src/clients/prisma";
import { PagePilot } from "./__utils__/diveLog";

const account = {
  email: "example+e2e_20230916A@gmail.com",
  password: "e2etest",
};

test.beforeEach(async () => {
  await prisma.diveLog.deleteMany();
});

test("succeed in logout", async ({ page }) => {
  const pagePilot = new PagePilot(page);

  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("http://localhost:3000/");
  // Sign in
  await page.getByLabel("メールアドレス").fill(account.email);
  await page.getByLabel("パスワード").fill(account.password);
  await page.getByText("ログイン").click();

  // Move to diveLogs page.
  await expect(page).toHaveURL("http://localhost:3000/diveLogs");
  await page.getByText("ログアウト").click();

  // Move to Home page.
  await expect(page).toHaveURL("http://localhost:3000/");
});
