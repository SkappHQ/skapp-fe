import { DateTime } from "luxon";

import { ToastType } from "~community/common/enums/ComponentEnums";
import {
  getHolidaysForDay,
  getHolidaysWithinDateRange,
  getLeaveRequestsWithinDateRange,
  getMyLeaveRequestForDay,
  handleDateChange,
  handleDateValidation,
  isNotAWorkingDate
} from "~community/common/utils/calendarDateRangePickerUtils";
import { LeaveDurationTypes } from "~community/leave/enums/LeaveTypeEnums";
import { MyRequestsToastMsgKeyEnums } from "~community/leave/enums/ToastMsgKeyEnums";

import {
  allHolidays,
  endDate,
  myLeaveRequests,
  nonWorkingDate,
  selectedDates,
  selectedDatesTwo,
  startDate,
  workingDate,
  workingDays
} from "./calendarDateRangePickerMockData";

describe("calendarDateRangePickerUtils", () => {
  describe("isNotAWorkingDate", () => {
    it("should return true if the date is not a working day", () => {
      const result = isNotAWorkingDate({
        date: nonWorkingDate,
        workingDays
      });
      expect(result).toBe(true);
    });

    it("should return false if the date is a working day", () => {
      const result = isNotAWorkingDate({
        date: workingDate,
        workingDays
      });
      expect(result).toBe(false);
    });
  });

  describe("getMyLeaveRequestForDay", () => {
    it("should return the leave request for the given date", () => {
      const result = getMyLeaveRequestForDay({
        myLeaveRequests,
        date: startDate
      });
      expect(result).toEqual(myLeaveRequests[0]);
    });

    it("should return null if no leave request is found for the given date", () => {
      const result = getMyLeaveRequestForDay({
        myLeaveRequests,
        date: workingDate
      });
      expect(result).toBeNull();
    });
  });

  describe("handleDateChange", () => {
    it("should set the selected date for single date picker", () => {
      const selectedDates: DateTime[] = [];
      const setSelectedDates = jest.fn();
      handleDateChange({
        date: workingDate,
        isRangePicker: false,
        selectedDates,
        setSelectedDates
      });
      expect(setSelectedDates).toHaveBeenCalledWith([workingDate]);
    });

    it("should set the selected date range for range picker", () => {
      const selectedDates: DateTime[] = [startDate];
      const setSelectedDates = jest.fn();
      handleDateChange({
        date: endDate,
        isRangePicker: true,
        selectedDates,
        setSelectedDates
      });
      expect(setSelectedDates).toHaveBeenCalledWith([startDate, endDate]);
    });
  });

  describe("handleDateValidation", () => {
    it("should show error toast if more than one date is selected for half-day leave", () => {
      const setToastMessage = jest.fn();
      const translateText = jest.fn().mockReturnValue("Error");
      handleDateValidation({
        allowedDuration: LeaveDurationTypes.HALF_DAY,
        selectedDates,
        allHolidays: undefined,
        myLeaveRequests: undefined,
        setToastMessage,
        translateText
      });
      expect(setToastMessage).toHaveBeenCalledWith({
        key: MyRequestsToastMsgKeyEnums.ONLY_HALF_DAY_LEAVE_ALLOWED,
        open: true,
        toastType: ToastType.ERROR,
        title: "Error",
        description: "Error"
      });
    });
  });

  describe("getHolidaysForDay", () => {
    it("should return holiday data for the given date", () => {
      const result = getHolidaysForDay({
        allHolidays,
        date: workingDate
      });
      expect(result).toEqual([allHolidays[0]]);
    });

    it("should return null if no holiday data is found for the given date", () => {
      const result = getHolidaysForDay({
        allHolidays,
        date: nonWorkingDate
      });
      expect(result).toEqual([]);
    });
  });

  describe("getHolidaysWithinDateRange", () => {
    it("should return holidays within the selected date range", () => {
      const result = getHolidaysWithinDateRange({
        selectedDates: selectedDatesTwo,
        allHolidays
      });
      expect(result).toEqual(allHolidays);
    });

    it("should return an empty array if no holidays are found within the selected date range", () => {
      const result = getHolidaysWithinDateRange({
        selectedDates,
        allHolidays
      });
      expect(result).toEqual([]);
    });
  });

  describe("getLeaveRequestsWithinDateRange", () => {
    it("should return leave requests within the selected date range", () => {
      const result = getLeaveRequestsWithinDateRange({
        selectedDates,
        myLeaveRequests
      });
      expect(result).toEqual([myLeaveRequests[0]]);
    });

    it("should return an empty array if no leave requests are found within the selected date range", () => {
      const result = getLeaveRequestsWithinDateRange({
        selectedDates: selectedDatesTwo,
        myLeaveRequests
      });
      expect(result).toEqual([]);
    });
  });
});
