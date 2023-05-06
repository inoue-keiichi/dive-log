import DiveLogForm from "@/components/templates/DiveLogForm";
import { getSimpleDate } from "@/utils/commons";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  fillDate,
  fillPoint,
  fillTransparency,
  fillWaterTemprature,
} from "../__utils__/diveLogForm";

const submit = jest.fn();

afterEach(() => {
  submit.mockClear();
});

describe("test", () => {
  test("succeeded in submitting form", async () => {
    render(<DiveLogForm onSubmit={submit} />);

    fillDate("2022-04-01");
    fillPoint("Ose");
    fillWaterTemprature("28");
    fillTransparency("8");
    const target = screen.getByText("追加");
    await fireEvent.click(target);

    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(submit.mock.calls[0][0]).toStrictEqual({
      date: "2022-04-01",
      point: "Ose",
      waterTemprature: 28,
      transparency: 8,
    });
  });

  test("succeeded in submitting form without values", async () => {
    render(<DiveLogForm onSubmit={submit} />);
    const target = screen.getByText("追加");
    await fireEvent.click(target);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(submit.mock.calls[0][0]).toStrictEqual({
      date: getSimpleDate(new Date()),
      point: "",
      waterTemprature: null,
      transparency: null,
    });
  });

  test("succeeded in submitting form with default values", async () => {
    const diveLog = {
      id: 1,
      userId: "uuid",
      point: "Ose",
      waterTemprature: 28,
      transparency: 8,
    };

    render(<DiveLogForm diveLog={diveLog} onSubmit={submit} />);
    const target = screen.getByText("上書き");
    await fireEvent.click(target);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  });
});
