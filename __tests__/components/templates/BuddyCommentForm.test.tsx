import BuddyCommentForm from "@/components/templates/BuddyCommentForm";
import { ShareDiveLog } from "@/pages/api/share/diveLogs/[uuid]";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { fill } from "../__utils__/common";

const submit = jest.fn();
afterEach(() => {
  submit.mockClear();
});

describe("BuddyCommentForm", () => {
  // TODO: clipboardのテスト書く
  test("succeeded in submitting a comment", async () => {
    const diveLog: ShareDiveLog = {
      date: "2023-08-23",
      place: null,
      point: null,
      divingStartTime: null,
      divingEndTime: null,
      buddyComments: [],
    };

    render(<BuddyCommentForm diveLog={diveLog} onSubmit={submit} />);
    fill(screen.getByLabelText("名前"), "JAI");
    fill(screen.getByLabelText("コメント"), "楽しいダイビングだった。");
    const submitButton = screen.getByText("送信");
    fireEvent.click(submitButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  });

  test("cannot submit in a comment when without name", async () => {
    const diveLog: ShareDiveLog = {
      date: "2023-08-23",
      place: null,
      point: null,
      divingStartTime: null,
      divingEndTime: null,
      buddyComments: [],
    };

    render(<BuddyCommentForm diveLog={diveLog} onSubmit={submit} />);
    fill(screen.getByLabelText("コメント"), "楽しいダイビングだった。");
    const submitButton = screen.getByText("送信");
    fireEvent.click(submitButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(0));
  });

  test("cannot submit without a comment", async () => {
    const diveLog: ShareDiveLog = {
      date: "2023-08-23",
      place: null,
      point: null,
      divingStartTime: null,
      divingEndTime: null,
      buddyComments: [],
    };

    render(<BuddyCommentForm diveLog={diveLog} onSubmit={submit} />);
    fill(screen.getByLabelText("名前"), "JAI");
    const submitButton = screen.getByText("送信");
    fireEvent.click(submitButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(0));
  });
});

describe("BuddyCommentForm snapshot", () => {
  test("Comment Form with other bubby comments and the diveLog", async () => {
    const diveLog: ShareDiveLog = {
      date: "2023-08-23",
      place: "大瀬",
      point: "湾内",
      divingStartTime: "09:30",
      divingEndTime: "10:00",
      buddyComments: [
        {
          id: 1,
          name: "鈴木",
          text: "今日の海は味噌汁だった。",
          createdAt: new Date("2023-08-01"),
        },
        {
          id: 2,
          name: "原田",
          text: "海底はまだ冷たくて早く陸に帰りたかった...",
          createdAt: new Date("2023-08-01"),
        },
      ],
    };

    const tree = render(
      <BuddyCommentForm diveLog={diveLog} onSubmit={submit} />
    );
    expect(tree).toMatchSnapshot();
  });
});
