import { useCallback } from "react";

import { useGetAllHolidays } from "~community/people/api/HolidayApi";
import { Holiday } from "~community/people/types/HolidayTypes";

import { getLocalDate } from "../utils/dateTimeUtils";

const useGetHoliday = () => {
  const { data: holidays } = useGetAllHolidays();

  const getHolidaysArrayByDate = useCallback(
    (date: Date): Holiday[] => {
      if (!holidays) return [];

      const holidayList = holidays.filter((holiday) => {
        const holidayDate = getLocalDate(holiday.date);
        return holidayDate === date.toISOString().split("T")[0];
      });

      return holidayList;
    },
    [holidays]
  );

  return { getHolidaysArrayByDate };
};

export default useGetHoliday;
