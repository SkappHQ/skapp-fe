import { LeaveStates } from "~community/common/types/CommonTypes";
import {
  Holiday,
  HolidayDurationType
} from "~community/people/types/HolidayTypes";

export const getHolidayClasses = (holidays: Holiday[] | null): string => {
  const holidayClasses = holidays?.map((holiday) => {
    switch (holiday?.holidayDuration) {
      case HolidayDurationType.FULLDAY:
        return "Mui-full-day-holiday";
      case HolidayDurationType.HALFDAY_MORNING:
        return "Mui-half-day-morning-holiday";
      case HolidayDurationType.HALFDAY_EVENING:
        return "Mui-half-day-evening-holiday";
      default:
        return "";
    }
  });

  const uniqueHolidayClasses = new Set(holidayClasses);

  if (uniqueHolidayClasses.has("Mui-full-day-holiday")) {
    return "Mui-full-day-holiday";
  }

  if (
    uniqueHolidayClasses.has("Mui-half-day-morning-holiday") &&
    uniqueHolidayClasses.has("Mui-half-day-evening-holiday")
  ) {
    return "Mui-full-day-holiday";
  }

  return Array.from(uniqueHolidayClasses).join(" ");
};

export const getLeaveRequestClasses = (leaveState: LeaveStates): string => {
  switch (leaveState) {
    case LeaveStates.FULL_DAY:
      return "Mui-full-day-leave";
    case LeaveStates.MORNING:
      return "Mui-half-day-morning-leave";
    case LeaveStates.EVENING:
      return "Mui-half-day-evening-leave";
    default:
      return "";
  }
};
