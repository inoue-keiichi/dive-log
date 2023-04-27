import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { fill } from "../__utils__/common";

export const fillDate = (value: string) =>
  fill(screen.getByLabelText("日付"), value);

export const fillPoint = (value: string) =>
  fill(screen.getByLabelText("ポイント"), value);

export const fillWaterTemprature = (value: string) =>
  fill(screen.getByLabelText("水温"), value);

export const fillTransparency = (value: string) =>
  fill(screen.getByLabelText("透明度"), value);
