import { Theme, useTheme } from "@mui/material";
import {
  PickersDay as MuiPickersDay,
  PickersDayProps
} from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useMemo } from "react";

import styles from "~community/common/components/molecules/DateRangePickersDay/styles";
import {
  getHolidayClasses,
  getLeaveRequestClasses
} from "~community/common/utils/calendarDateRangePickerStyleUtils";
import {
  getHolidaysForDay,
  getMyLeaveRequestForDay
} from "~community/common/utils/calendarDateRangePickerUtils";
import { getSelectionClasses } from "~community/common/utils/dateRangePickerUtils";
import { MyLeaveRequestPayloadType } from "~community/leave/types/MyRequests";
import { Holiday } from "~community/people/types/HolidayTypes";

interface Props {
  pickerDaysProps: PickersDayProps<DateTime>;
  selectedDates: DateTime[];
  onDayClick: (date: DateTime<boolean>) => void;
  isRangePicker: boolean;
  myLeaveRequests?: MyLeaveRequestPayloadType[];
  workingDays?: string[] | undefined;
  allHolidays: Holiday[] | undefined;
}

const CalendarDateRangePickersDay = ({
  pickerDaysProps,
  selectedDates,
  onDayClick,
  isRangePicker,
  myLeaveRequests,
  workingDays,
  allHolidays
}: Props) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const { day, outsideCurrentMonth, ...other } = pickerDaysProps;

  const holidaysForDay = useMemo(() => {
    return getHolidaysForDay({
      allHolidays,
      date: day
    });
  }, [day, allHolidays]);

  const myLeaveRequestForDay = useMemo(() => {
    return getMyLeaveRequestForDay({
      myLeaveRequests,
      date: day
    });
  }, [day, myLeaveRequests]);

  const muiClassNames = useMemo(() => {
    let classNames: string[] = [];

    if (holidaysForDay?.length) {
      classNames.push(getHolidayClasses(holidaysForDay));
    }

    if (myLeaveRequestForDay) {
      classNames.push(getLeaveRequestClasses(myLeaveRequestForDay.leaveState));
    }

    if (isRangePicker) {
      classNames.push(
        getSelectionClasses({
          selectedDates,
          workingDays,
          holidaysForDay,
          day
        })
      );
    }

    return classNames.join(" ");
  }, [
    holidaysForDay,
    myLeaveRequestForDay,
    isRangePicker,
    selectedDates,
    day,
    workingDays
  ]);

  return (
    <MuiPickersDay
      className={muiClassNames ?? ""}
      outsideCurrentMonth={outsideCurrentMonth}
      day={day}
      sx={classes.pickersDay}
      onClick={() => onDayClick(day)}
      {...other}
    />
  );
};

export default CalendarDateRangePickersDay;
