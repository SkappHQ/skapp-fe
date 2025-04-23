import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ClockInButton from "~community/attendance/components/molecules/ClockInButton/ClockInButton";
import MockTheme from "~community/common/mocks/MockTheme";

// Mock hooks and functions
jest.mock("~community/attendance/api/AttendanceApi", () => ({
  useUpdateEmployeeStatus: jest.fn(() => ({
    isPending: false,
    mutate: jest.fn()
  }))
}));

jest.mock("~community/common/hooks/useTranslator", () => ({
  useTranslator: () => (key: string[]) => key[key.length - 1]
}));

describe("ClockInButton", () => {
  const mockMutate = jest.fn();

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
  });

  test("renders the button with correct label", () => {
    render(
      <MockTheme>
        <ClockInButton />
      </MockTheme>
    );

    expect(screen.getByText("clockIn")).toBeInTheDocument();
  });

  test("calls mutate function when button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MockTheme>
        <ClockInButton />
      </MockTheme>
    );

    const button = screen.getByText("clockIn");
    await user.click(button);

    expect(mockMutate).toHaveBeenCalledTimes(1);
  });
});
