import { Theme, useTheme } from "@mui/material";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useMemo } from "react";

import { getSelectionClasses } from "~community/common/utils/dateRangePickerUtils";

import styles from "./styles";

interface Props {
  pickerDaysProps: PickersDayProps<DateTime>;
  selectedDates: Date[];
  isRangePicker: boolean;
}

const DateRangePickerDay = ({
  pickerDaysProps,
  selectedDates,
  isRangePicker
}: Props) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const { day, outsideCurrentMonth, ...other } = pickerDaysProps;

  const muiClassNames = useMemo(() => {
    let classNames: string[] = [];

    if (isRangePicker) {
      classNames.push(
        getSelectionClasses({
          selectedDates,
          day
        })
      );
    }

    return classNames.join(" ");
  }, [day, isRangePicker, selectedDates]);

  return (
    <PickersDay
      className={muiClassNames}
      outsideCurrentMonth={outsideCurrentMonth}
      day={day}
      sx={classes.pickersDay}
      {...other}
    />
  );
};

export default DateRangePickerDay;
