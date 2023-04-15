import DiveLogForm from "@/components/templates/DiveLogForm";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const submit = jest.fn();

describe("test", () => {
  test("succeeded in submitting form", async () => {
    render(<DiveLogForm onSubmit={submit} />);
    const target = screen.getByText("追加");
    await fireEvent.click(target);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
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
