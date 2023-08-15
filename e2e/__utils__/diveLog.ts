import { DiveLog } from "@/schemas/diveLog";
import { Page } from "@playwright/test";

type FillDiveLog = Omit<
  DiveLog,
  "tankKind" | "weather" | "suit" | "divingStartTime" | "divingEndTime"
>;

export class PagePilot {
  private page;

  constructor(page: Page) {
    this.page = page;
  }

  public fill = async (diveLog: FillDiveLog) => {
    await this.page.getByLabel("場所").fill(`${diveLog.place}`);
    await this.page.getByLabel("ポイント").fill(`${diveLog.point}`);
    await this.page.getByLabel("平均水深").fill(`${diveLog.averageDepth}`);
    await this.page.getByLabel("最大水深").fill(`${diveLog.maxDepth}`);
    await this.page
      .getByLabel("タンク圧力(開始)")
      .fill(`${diveLog.tankStartPressure}`);
    await this.page
      .getByLabel("タンク圧力(終了)")
      .fill(`${diveLog.tankEndPressure}`);
    await this.page.getByLabel("ウェイト").fill(`${diveLog.weight}`);
    await this.page.getByLabel("気温").fill(`${diveLog.temprature}`);
    await this.page.getByLabel("水温").fill(`${diveLog.waterTemprature}`);
    await this.page.getByLabel("透明度").fill(`${diveLog.transparency}`);
    await this.page.getByLabel("メモ").fill(`${diveLog.memo}`);
  };

  public selectSteel = async () =>
    await this.page.getByLabel("スチール", { exact: true }).click();

  public selectAluminum = async () =>
    await this.page.getByLabel("アルミニウム", { exact: true }).click();

  public selectWet = async () =>
    await this.page.getByLabel("ウェット", { exact: true }).click();

  public selectDry = async () =>
    await this.page.getByLabel("ドライ", { exact: true }).click();

  public selectSunny = async () =>
    await this.page.getByLabel(/晴れ$/, { exact: true }).click();

  public selectSunnyCloudy = async () =>
    await this.page.getByLabel("晴れ/曇り", { exact: true }).click();

  public selectCloudy = async () =>
    await this.page.getByLabel(/^曇り$/, { exact: true }).click();

  public selectRainy = async () =>
    await this.page.getByLabel("雨", { exact: true }).click();

  public selectSnowy = async () =>
    await this.page.getByLabel("雪", { exact: true }).click();

  public fillDivingStartTime = async (input: {
    hour: number;
    minute: number;
  }) => {
    await this.page
      .locator("div")
      .filter({ hasText: /^潜水開始時間$/ })
      .getByRole("button", { name: "Choose time" })
      .click();
    await this.page
      .getByRole("dialog", { name: "潜水開始時間" })
      .getByRole("option", { name: `${input.hour} hours`, exact: true })
      .click();
    await this.page
      .getByRole("dialog", { name: "潜水開始時間" })
      .getByRole("option", { name: `${input.minute} minutes`, exact: true })
      .click();
  };

  public fillDivingEndTime = async (input: {
    hour: number;
    minute: number;
  }) => {
    await this.page
      .locator("div")
      .filter({ hasText: /^潜水終了時間$/ })
      .getByRole("button", { name: "Choose time" })
      .click();
    await this.page
      .getByRole("dialog", { name: "潜水終了時間" })
      .getByRole("option", { name: `${input.hour} hours`, exact: true })
      .click();
    await this.page
      .getByRole("dialog", { name: "潜水終了時間" })
      .getByRole("option", { name: `${input.minute} minutes`, exact: true })
      .click();
  };
}
