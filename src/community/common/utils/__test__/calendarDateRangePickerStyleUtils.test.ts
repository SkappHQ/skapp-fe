import { LeaveStates } from "~community/common/types/CommonTypes";
import { HolidayType } from "~community/leave/types/MyRequests";
import { HolidayDurationType } from "~community/people/types/HolidayTypes";

import {
  getHolidayClasses,
  getLeaveRequestClasses
} from "../calendarDateRangePickerStyleUtils";

describe("getHolidayClasses", () => {
  it("should return 'Mui-full-day-holiday' for full day holidays", () => {
    const holidays: HolidayType[] = [
      { id: 1, name: "Holiday", holidayDuration: HolidayDurationType.FULLDAY }
    ];
    expect(getHolidayClasses(holidays)).toBe("Mui-full-day-holiday");
  });

  it("should return 'Mui-half-day-morning-holiday' for morning half day holidays", () => {
    const holidays: HolidayType[] = [
      {
        id: 1,
        name: "Holiday",
        holidayDuration: HolidayDurationType.HALFDAY_MORNING
      }
    ];
    expect(getHolidayClasses(holidays)).toBe("Mui-half-day-morning-holiday");
  });

  it("should return 'Mui-half-day-evening-holiday' for evening half day holidays", () => {
    const holidays: HolidayType[] = [
      {
        id: 1,
        name: "Holiday",
        holidayDuration: HolidayDurationType.HALFDAY_EVENING
      }
    ];
    expect(getHolidayClasses(holidays)).toBe("Mui-half-day-evening-holiday");
  });

  it("should return 'Mui-full-day-holiday' if both morning and evening half day holidays are present", () => {
    const holidays: HolidayType[] = [
      {
        id: 1,
        name: "Holiday",
        holidayDuration: HolidayDurationType.HALFDAY_MORNING
      },
      {
        id: 2,
        name: "Holiday",
        holidayDuration: HolidayDurationType.HALFDAY_EVENING
      }
    ];
    expect(getHolidayClasses(holidays)).toBe("Mui-full-day-holiday");
  });

  it("should return a combination of unique holiday classes", () => {
    const holidays: HolidayType[] = [
      {
        id: 1,
        name: "Holiday",
        holidayDuration: HolidayDurationType.HALFDAY_MORNING
      },
      {
        id: 2,
        name: "Holiday",
        holidayDuration: HolidayDurationType.HALFDAY_MORNING
      }
    ];
    expect(getHolidayClasses(holidays)).toBe("Mui-half-day-morning-holiday");
  });
});

describe("getLeaveRequestClasses", () => {
  it("should return 'Mui-full-day-leave' for full day leave", () => {
    expect(getLeaveRequestClasses(LeaveStates.FULL_DAY)).toBe(
      "Mui-full-day-leave"
    );
  });

  it("should return 'Mui-half-day-morning-leave' for morning leave", () => {
    expect(getLeaveRequestClasses(LeaveStates.MORNING)).toBe(
      "Mui-half-day-morning-leave"
    );
  });

  it("should return 'Mui-half-day-evening-leave' for evening leave", () => {
    expect(getLeaveRequestClasses(LeaveStates.EVENING)).toBe(
      "Mui-half-day-evening-leave"
    );
  });

  it("should return an empty string for unknown leave state", () => {
    expect(getLeaveRequestClasses("UNKNOWN" as LeaveStates)).toBe("");
  });
});
