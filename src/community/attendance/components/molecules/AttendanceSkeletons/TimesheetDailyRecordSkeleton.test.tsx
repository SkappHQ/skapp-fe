import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import TimesheetDailyRecordSkeleton from "./TimesheetDailyRecordSkeleton";
import MockTheme from "~community/common/mocks/MockTheme";

describe("TimesheetDailyRecordSkeleton", () => {
  test("renders the skeleton", () => {
    render(
      <MockTheme>
        <TimesheetDailyRecordSkeleton />
      </MockTheme>
    );
  });
});
