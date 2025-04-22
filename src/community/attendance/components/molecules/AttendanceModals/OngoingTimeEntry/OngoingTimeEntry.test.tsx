import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OngoingTimeEntry from "./OngoingTimeEntry";
import MockTheme from "~community/common/mocks/MockTheme";

// Mock hooks and functions
jest.mock("~community/attendance/store/attendanceStore", () => ({
  useAttendanceStore: jest.fn(() => ({
    ongoingTimeEntry: {
      startTime: "09:00",
      endTime: null,
      workedHours: "4h 30m"
    },
    stopOngoingTimeEntry: jest.fn()
  }))
}));

jest.mock("~community/common/hooks/useTranslator", () => ({
  useTranslator: () => (key: string[]) => key[key.length - 1]
}));

describe("OngoingTimeEntry", () => {
  const mockCloseModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });


  test("calls closeModal when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MockTheme>
        <OngoingTimeEntry closeModal={mockCloseModal} />
      </MockTheme>
    );

    const cancelButton = screen.getByText("cancel");
    await user.click(cancelButton);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  test("calls stopOngoingTimeEntry and closeModal when stop button is clicked", async () => {
    const mockStopOngoingTimeEntry = jest.fn();
    jest.mocked(require("~community/attendance/store/attendanceStore").useAttendanceStore).mockReturnValue({
      ongoingTimeEntry: {
        startTime: "09:00",
        endTime: null,
        workedHours: "4h 30m"
      },
      stopOngoingTimeEntry: mockStopOngoingTimeEntry
    });

    const user = userEvent.setup();
    render(
      <MockTheme>
        <OngoingTimeEntry closeModal={mockCloseModal} />
      </MockTheme>
    );

    const stopButton = screen.getByText("stopEntry");
    await user.click(stopButton);

    expect(mockStopOngoingTimeEntry).toHaveBeenCalledTimes(0);
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});
