import DiveLogForm from "@/components/templates/DiveLogForm";
import { getSimpleDate } from "@/utils/commons";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  fillAverageDepth,
  fillDate,
  fillDivingEndTime,
  fillDivingStartTime,
  fillMaxDepth,
  fillMemo,
  fillPlace,
  fillPoint,
  fillTankEndPressure,
  fillTankStartPressure,
  fillTemprature,
  fillTransparency,
  fillWaterTemprature,
  fillWeight,
} from "../__utils__/diveLogForm";
import renderer from "react-test-renderer";
import {
  click,
  selectIconRadioButton,
  selectRadioButton,
} from "../__utils__/common";

jest.setTimeout(10 * 1000);

// 新規のDiveLogFormを作ると現在の日付が初期値になる。
// 期待値を固定するためにモック化する。
const mockDate = new Date("2023/06/27");
jest.useFakeTimers();
jest.setSystemTime(mockDate);

const submit = jest.fn();
const back = jest.fn();
const deletee = jest.fn(); // 予約語

afterEach(() => {
  submit.mockClear();
  back.mockClear();
  deletee.mockClear();
});

describe("test", () => {
  test("succeeded in submitting form", async () => {
    render(<DiveLogForm onSubmit={submit} onBack={back} />);

    fillDate("2022-04-01");
    fillPlace("Ose");
    fillPoint("Wannai");
    fillDivingStartTime("09:30");
    fillDivingEndTime("10:00");
    fillAverageDepth("18");
    fillMaxDepth("25");
    fillTankStartPressure("200");
    fillTankEndPressure("50");
    click(screen.getByLabelText("スチール"));
    fillWeight("5");
    click(screen.getByLabelText("ウェット"));
    click(screen.getByLabelText("晴れ"));
    fillTemprature("35");
    fillWaterTemprature("28");
    fillTransparency("8");
    fillMemo("Good Diving!!");
    const target = screen.getByText("追加");
    fireEvent.click(target);

    // react-hook-form によって呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(back).toHaveBeenCalledTimes(0);
    expect(submit.mock.calls[0][0]).toStrictEqual({
      date: "2022-04-01",
      place: "Ose",
      point: "Wannai",
      divingStartTime: "09:30",
      divingEndTime: "10:00",
      averageDepth: 18,
      maxDepth: 25,
      tankStartPressure: 200,
      tankEndPressure: 50,
      tankKind: "STEEL",
      weight: 5,
      suit: "WET",
      weather: "SUNNY",
      temprature: 35,
      waterTemprature: 28,
      transparency: 8,
      memo: "Good Diving!!",
    });
  });

  test("succeeded in submitting form without values", async () => {
    render(<DiveLogForm onSubmit={submit} onBack={back} />);
    const target = screen.getByText("追加");
    await fireEvent.click(target);
    // react-hook-form によって呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(back).toHaveBeenCalledTimes(0);
    expect(submit.mock.calls[0][0]).toStrictEqual({
      date: getSimpleDate(new Date()),
      point: "",
      waterTemprature: undefined,
      transparency: undefined,
      averageDepth: undefined,
      divingEndTime: undefined,
      divingStartTime: undefined,
      maxDepth: undefined,
      memo: "",
      place: "",
      suit: undefined,
      tankEndPressure: undefined,
      tankKind: undefined,
      tankStartPressure: undefined,
      temprature: undefined,
      weather: undefined,
      weight: undefined,
    });
  });

  test("succeeded in submitting form with default values", async () => {
    const diveLog = {
      date: "2023-06-27",
      point: "Ose",
      waterTemprature: 28,
      transparency: 8,
    };

    render(<DiveLogForm diveLog={diveLog} onSubmit={submit} onBack={back} />);
    const target = screen.getByText("上書き");
    await fireEvent.click(target);
    // react-hook-form によって呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(back).toHaveBeenCalledTimes(0);
  });

  test("succeeded in going back page", async () => {
    render(<DiveLogForm onSubmit={submit} onBack={back} />);

    const target = screen.getByTestId("back-button");
    await fireEvent.click(target);

    // react-hook-form によって呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(0));
    expect(back).toHaveBeenCalledTimes(1);
  });

  test("succeeded in delete button", async () => {
    const diveLog = {
      date: "2023-06-27",
      point: "Ose",
      waterTemprature: 28,
      transparency: 8,
    };

    render(
      <DiveLogForm
        diveLog={diveLog}
        onSubmit={submit}
        onBack={back}
        onDelete={deletee}
      />
    );

    const target = screen.getByTestId("dive-log-delete-button");
    await fireEvent.click(target);

    // react-hook-form によって呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(0));
    expect(back).toHaveBeenCalledTimes(0);
    expect(deletee).toHaveBeenCalledTimes(1);
  });
});

describe.skip("snapshot test", () => {
  test("new Dive log form", async () => {
    const tree = renderer
      .create(<DiveLogForm onSubmit={submit} onBack={back} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("existing Dive log form", async () => {
    const diveLog = {
      date: "2023-06-27",
      point: "Ose",
      waterTemprature: 28,
      transparency: 8,
      averageDepth: null,
      divingEndTime: "00:00",
      divingStartTime: "00:00",
      maxDepth: null,
      memo: "",
      place: "",
      suit: null,
      tankEndPressure: null,
      tankKind: null,
      tankStartPressure: null,
      temprature: null,
      weather: null,
      weight: null,
    };

    const tree = renderer
      .create(<DiveLogForm diveLog={diveLog} onSubmit={submit} onBack={back} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
