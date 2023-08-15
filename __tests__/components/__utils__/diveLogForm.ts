import { screen } from "@testing-library/react";
import { fill } from "../__utils__/common";

export const fillDate = (value: string) =>
  fill(screen.getByLabelText("日付"), value);

export const fillPlace = (value: string) =>
  fill(screen.getByLabelText("場所"), value);

export const fillPoint = (value: string) =>
  fill(screen.getByLabelText("ポイント"), value);

export const fillTemprature = (value: string) =>
  fill(screen.getByLabelText("気温"), value);

export const fillWaterTemprature = (value: string) =>
  fill(screen.getByLabelText("水温"), value);

export const fillTransparency = (value: string) =>
  fill(screen.getByLabelText("透明度"), value);

export const fillAverageDepth = (value: string) =>
  fill(screen.getByLabelText("平均水深"), value);

export const fillMaxDepth = (value: string) =>
  fill(screen.getByLabelText("最大水深"), value);

export const fillDivingStartTime = (value: string) =>
  fill(screen.getByLabelText("潜水開始時間"), value);

export const fillDivingEndTime = (value: string) =>
  fill(screen.getByLabelText("潜水終了時間"), value);

export const fillMemo = (value: string) =>
  fill(screen.getByLabelText("メモ"), value);

export const fillTankStartPressure = (value: string) =>
  fill(screen.getByLabelText("タンク圧力(開始)"), value);

export const fillTankEndPressure = (value: string) =>
  fill(screen.getByLabelText("タンク圧力(終了)"), value);

export const fillWeight = (value: string) =>
  fill(screen.getByLabelText("ウェイト"), value);
