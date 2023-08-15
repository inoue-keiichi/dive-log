import DiveLogList from "@/components/templates/DiveLogList";
import { DiveLog } from "@/schemas/diveLog";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const addNew = jest.fn();
const edit = jest.fn();

afterEach(() => {
  addNew.mockClear();
  edit.mockClear();
});

describe("test", () => {
  test("succeeded in adding a new diving log", async () => {
    render(<DiveLogList diveLogs={[]} onAddNew={addNew} onEdit={edit} />);
    const addNewButton = screen.getByText("新規追加");
    fireEvent.click(addNewButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(addNew).toHaveBeenCalledTimes(1));
  });

  test("succeeded in adding a new diving log with existing diving log books", async () => {
    const divingLogs = [
      {
        id: 1,
        userId: "uuid1",
        point: "Ose",
        date: "2023-07-07",
        waterTemprature: 28,
        transparency: 8,
      },
      {
        id: 2,
        userId: "uuid2",
        point: "Kawana",
        date: "2023-07-07",
        waterTemprature: 23,
        transparency: 12,
      },
    ];

    render(
      <DiveLogList diveLogs={divingLogs} onAddNew={addNew} onEdit={edit} />
    );
    const addNewButton = screen.getByText("新規追加");
    fireEvent.click(addNewButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(addNew).toHaveBeenCalledTimes(1));
  });

  test("succeeded in editting a diving log", async () => {
    render(
      <DiveLogList
        diveLogs={[
          {
            id: 1,
            date: "2023-07-07",
            point: "Ose",
            waterTemprature: 28,
            transparency: 8,
          },
        ]}
        onAddNew={addNew}
        onEdit={edit}
      />
    );
    const editButton = screen.getByText("編集");
    fireEvent.click(editButton);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(edit).toHaveBeenCalledTimes(1));
  });

  test("succeeded in editting diving logs", async () => {
    render(
      <DiveLogList
        diveLogs={[
          {
            id: 1,
            date: "2023-07-07",
            point: "Ose",
            waterTemprature: 28,
            transparency: 8,
          },
          {
            id: 2,
            date: "2023-07-07",
            point: "Kawana",
            waterTemprature: 23,
            transparency: 12,
          },
        ]}
        onAddNew={addNew}
        onEdit={edit}
      />
    );
    const editButtons = screen.getAllByText("編集");
    fireEvent.click(editButtons[0]);
    // react-hook-form によって submit が呼び出されるまで待機
    await waitFor(() => expect(edit).nthCalledWith(1, 1));
    fireEvent.click(editButtons[1]);
    await waitFor(() => expect(edit).nthCalledWith(2, 2));
  });
});
