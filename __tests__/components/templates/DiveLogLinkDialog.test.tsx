import DiveLogLinkDialog from "@/components/templates/DiveLogLinkDialog";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const close = jest.fn();
afterEach(() => {
  close.mockClear();
});

describe("test", () => {
  // TODO: clipboardのテスト書く
  test.skip("succeeded in adding a new diving log", async () => {
    render(
      <DiveLogLinkDialog
        open={true}
        link={
          "http://localhost:3000/buddy/9c474f20-89d8-4265-8613-f0effeaebf24/comments"
        }
        onClose={close}
      />
    );
    const copyButton = screen.getByText("コピー");
    fireEvent.click(copyButton);
    // react-hook-form によって submit が呼び出されるまで待機
    //await waitFor(() => expect().toHaveBeenCalledTimes(1));
  });

  test("succeeded in close the dialog", async () => {
    render(
      <DiveLogLinkDialog
        open={true}
        link={
          "http://localhost:3000/buddy/9c474f20-89d8-4265-8613-f0effeaebf24/comments"
        }
        onClose={close}
      />
    );
    const cancelButton = screen.getByText("キャンセル");
    fireEvent.click(cancelButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
  });
});
