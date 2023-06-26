import DiveLogForm from "@/components/templates/DiveLogForm";
import { getSimpleDate } from "@/utils/commons";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  fillDate,
  fillPoint,
  fillTransparency,
  fillWaterTemprature,
} from "../__utils__/diveLogForm";
import renderer from "react-test-renderer";

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
    fillPoint("Ose");
    fillWaterTemprature("28");
    fillTransparency("8");
    const target = screen.getByText("追加");
    await fireEvent.click(target);

    // react-hook-form によって呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(back).toHaveBeenCalledTimes(0);
    expect(submit.mock.calls[0][0]).toStrictEqual({
      date: "2022-04-01",
      point: "Ose",
      waterTemprature: 28,
      transparency: 8,
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
      waterTemprature: null,
      transparency: null,
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

describe("snapshot test", () => {
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
    };

    const tree = renderer
      .create(<DiveLogForm diveLog={diveLog} onSubmit={submit} onBack={back} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
