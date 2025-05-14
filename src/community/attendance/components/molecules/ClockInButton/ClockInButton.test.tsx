import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MockTheme from "~community/common/mocks/MockTheme";

import ClockInButton from "./ClockInButton";

// Mock hooks and functions
jest.mock("~community/attendance/api/AttendanceApi", () => ({
  useUpdateEmployeeStatus: jest.fn(() => ({
    isPending: false,
    mutate: jest.fn()
  }))
}));

jest.mock("~community/attendance/store/attendanceStore", () => ({
  useAttendanceStore: jest.fn(() => ({
    attendanceParams: { slotType: "READY" },
    attendanceLeaveStatus: { onLeave: false },
    setSlotType: jest.fn(),
    setIsAttendanceModalOpen: jest.fn()
  }))
}));

jest.mock("~community/common/hooks/useTranslator", () => ({
  useTranslator: () => (key: string[]) => key[key.length - 1]
}));

jest.mock("~community/common/hooks/useMediaQuery", () => ({
  MediaQueries: { BELOW_600: "below_600" },
  useMediaQuery: jest.fn(() => () => false)
}));

describe("ClockInButton", () => {
  const mockMutate = jest.fn();
  const mockSetSlotType = jest.fn();
  const mockSetIsAttendanceModalOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .mocked(
        require("~community/attendance/api/AttendanceApi")
          .useUpdateEmployeeStatus
      )
      .mockReturnValue({
        isPending: false,
        mutate: mockMutate
      });
    jest
      .mocked(
        require("~community/attendance/store/attendanceStore")
          .useAttendanceStore
      )
      .mockReturnValue({
        attendanceParams: { slotType: "READY" },
        attendanceLeaveStatus: { onLeave: false },
        setSlotType: mockSetSlotType,
        setIsAttendanceModalOpen: mockSetIsAttendanceModalOpen
      });
  });

  test("renders the button with correct label", () => {
    render(
      <MockTheme>
        <ClockInButton />
      </MockTheme>
    );

    expect(screen.getByText("clockIn")).toBeInTheDocument();
  });

  test("calls mutate with correct arguments when button is clicked and status is READY", async () => {
    const user = userEvent.setup();
    render(
      <MockTheme>
        <ClockInButton />
      </MockTheme>
    );

    const button = screen.getByText("clockIn");
    await user.click(button);

    expect(mockMutate).toHaveBeenCalledWith(mockSetSlotType("START"));
    expect(mockSetIsAttendanceModalOpen).not.toHaveBeenCalled();
  });
});
