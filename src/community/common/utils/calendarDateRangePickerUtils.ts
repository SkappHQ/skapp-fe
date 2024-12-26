import { DateTime } from "luxon";
import { SetStateAction } from "react";

import { ToastType } from "~community/common/enums/ComponentEnums";
import { ToastProps } from "~community/common/types/ToastTypes";
import {
  convertToYYYYMMDDFromDateTime,
  convertYYYYMMDDToDateTime
} from "~community/common/utils/dateTimeUtils";
import { LeaveDurationTypes } from "~community/leave/enums/LeaveTypeEnums";
import { MyRequestsToastMsgKeyEnums } from "~community/leave/enums/ToastMsgKeyEnums";
import { MyLeaveRequestPayloadType } from "~community/leave/types/MyRequests";
import { Holiday } from "~community/people/types/HolidayTypes";

interface IsNotAWorkingDateProps {
  date: DateTime;
  workingDays: string[];
}

export const isNotAWorkingDate = ({
  date,
  workingDays
}: IsNotAWorkingDateProps) => {
  if (workingDays !== undefined) {
    return !workingDays.includes(date.toFormat("cccc").toUpperCase());
  }
  return false;
};

interface GetMyLeaveRequestForDayProps {
  myLeaveRequests: MyLeaveRequestPayloadType[] | undefined;
  date: DateTime;
}

export const getMyLeaveRequestForDay = ({
  myLeaveRequests,
  date
}: GetMyLeaveRequestForDayProps) => {
  if (myLeaveRequests !== undefined) {
    const myLeaveRequestForDay = myLeaveRequests?.find((leaveRequest) => {
      const startDate = DateTime.fromISO(leaveRequest.startDate);
      const endDate = DateTime.fromISO(leaveRequest.endDate);

      if (date >= startDate && date <= endDate) {
        return leaveRequest;
      }

      return null;
    });

    return myLeaveRequestForDay ?? null;
  }

  return null;
};

interface HandleDateChangeProps {
  date: DateTime | null;
  isRangePicker: boolean;
  selectedDates: DateTime[];
  setSelectedDates: (dates: DateTime[]) => void;
}

export const handleDateChange = ({
  date,
  isRangePicker,
  selectedDates,
  setSelectedDates
}: HandleDateChangeProps) => {
  if (!date) return;

  if (isRangePicker) {
    if (selectedDates.length === 2) {
      setSelectedDates([date]);
    } else if (selectedDates.length === 1) {
      if (date > selectedDates[0]) {
        setSelectedDates([selectedDates[0], date]);
      } else {
        setSelectedDates([date, selectedDates[0]]);
      }
    } else {
      setSelectedDates([date]);
    }
  } else {
    setSelectedDates([date]);
  }
};

interface HandleDateValidationProps {
  allowedDuration: LeaveDurationTypes;
  selectedDates: DateTime[];
  allHolidays: Holiday[] | undefined;
  myLeaveRequests: MyLeaveRequestPayloadType[] | undefined;
  setToastMessage: (value: SetStateAction<ToastProps>) => void;
  translateText: (key: string[], data?: Record<string, unknown>) => string;
}

export const handleDateValidation = ({
  allowedDuration,
  selectedDates,
  allHolidays,
  myLeaveRequests,
  setToastMessage,
  translateText
}: HandleDateValidationProps) => {
  if (!selectedDates) return;

  if (allowedDuration === LeaveDurationTypes.HALF_DAY) {
    if (selectedDates.length > 1) {
      setToastMessage({
        key: MyRequestsToastMsgKeyEnums.ONLY_HALF_DAY_LEAVE_ALLOWED,
        open: true,
        toastType: ToastType.ERROR,
        title: translateText(["onlyHalfDayLeaveAllowedError", "title"]),
        description: translateText([
          "onlyHalfDayLeaveAllowedError",
          "description"
        ])
      });
    }
  }

  if (allHolidays !== undefined) {
    const holidays = getHolidaysWithinDateRange({
      selectedDates,
      allHolidays
    });

    if (holidays !== undefined) {
      const holidayCount = holidays.length;

      if (holidayCount > 0) {
        const hasMultipleHolidays = holidayCount > 1;

        const toastType = ToastType.WARN;

        const titleKey = hasMultipleHolidays
          ? "multipleHolidaysExistsError"
          : "holidayExistsError";

        const title =
          translateText([titleKey, "title"], {
            holidayName: holidays[0].name,
            holidayCount: holidayCount - 1
          }) ?? "";
        const description = translateText([titleKey, "description"]) ?? "";

        const key = hasMultipleHolidays
          ? MyRequestsToastMsgKeyEnums.MULTIPLE_HOLIDAYS_EXIST
          : MyRequestsToastMsgKeyEnums.HOLIDAY_EXISTS;

        setToastMessage({
          key,
          open: true,
          toastType,
          title,
          description
        });
      }
    }
  }

  if (myLeaveRequests !== undefined) {
    const leaveRequests = getLeaveRequestsWithinDateRange({
      selectedDates,
      myLeaveRequests
    });

    const leaveRequestCount = leaveRequests?.length ?? 0;

    if (leaveRequestCount > 0) {
      const hasMultipleLeaves = leaveRequestCount > 1;

      const toastType = ToastType.WARN;

      const titleKey = hasMultipleLeaves
        ? "multipleLeavesAlreadyAppliedError"
        : "leaveAlreadyAppliedError";

      const title = translateText([titleKey, "title"]);
      const description = translateText([titleKey, "description"]);

      const key = hasMultipleLeaves
        ? MyRequestsToastMsgKeyEnums.MULTIPLE_LEAVES_ALREADY_APPLIED
        : MyRequestsToastMsgKeyEnums.LEAVE_ALREADY_APPLIED;

      setToastMessage({
        key,
        open: true,
        toastType,
        title,
        description
      });
    }
  }
};

interface GetHolidaysForDayProps {
  allHolidays: Holiday[] | undefined;
  date: DateTime;
}

export const getHolidaysForDay = ({
  allHolidays,
  date
}: GetHolidaysForDayProps): Holiday[] | null => {
  if (allHolidays) {
    const holidaysForDay = allHolidays.filter((holiday) => {
      return holiday.date === convertToYYYYMMDDFromDateTime(date);
    });

    return holidaysForDay ?? null;
  }

  return null;
};

interface GetHolidaysWithinDateRangeProps {
  selectedDates: DateTime[];
  allHolidays: Holiday[] | undefined;
}

export const getHolidaysWithinDateRange = ({
  selectedDates,
  allHolidays
}: GetHolidaysWithinDateRangeProps) => {
  if (!allHolidays) return [];

  const startDate = selectedDates[0];
  const endDate = selectedDates[1] ?? selectedDates[0];

  const holidaysWithinRange = allHolidays.filter((holiday) => {
    const holidayDate = convertYYYYMMDDToDateTime(holiday.date);

    return startDate <= holidayDate && holidayDate <= endDate;
  });

  return holidaysWithinRange;
};

interface GetLeaveRequestsWithinDateRangeProps {
  selectedDates: DateTime[];
  myLeaveRequests: MyLeaveRequestPayloadType[] | undefined;
}

export const getLeaveRequestsWithinDateRange = ({
  selectedDates,
  myLeaveRequests
}: GetLeaveRequestsWithinDateRangeProps) => {
  if (!myLeaveRequests) return [];

  const startDate = selectedDates[0];
  const endDate = selectedDates[1] ?? selectedDates[0];

  const leaveRequestsWithinRange = myLeaveRequests.filter((leaveRequest) => {
    const leaveStartDate = DateTime.fromISO(leaveRequest.startDate);
    const leaveEndDate = DateTime.fromISO(leaveRequest.endDate);

    return (
      (startDate >= leaveStartDate && startDate <= leaveEndDate) ||
      (endDate >= leaveStartDate && endDate <= leaveEndDate) ||
      (startDate <= leaveStartDate && endDate >= leaveEndDate)
    );
  });

  return leaveRequestsWithinRange;
};
