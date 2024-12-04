import { Stack } from "@mui/material";
import { DateTime } from "luxon";

import { FilledArrow } from "~community/common/components/atoms/FilledArrow/FilledArrow";

const navigateDate = (
  currentStartDate: string,
  currentEndDate: string,
  weeks: number,
  setStartDate: (date: string) => void,
  setEndDate: (date: string) => void,
  dateFormat: string
) => {
  setStartDate(
    DateTime.fromFormat(currentStartDate, dateFormat)
      .plus({ weeks })
      .toFormat(dateFormat)
  );

  setEndDate(
    DateTime.fromFormat(currentEndDate, dateFormat)
      .plus({ weeks })
      .toFormat(dateFormat)
  );
};

const DateNavigator = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  navigateWeeks,
  dateFormat
}: {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  navigateWeeks: number;
  dateFormat: string;
}) => {
  const handleNavigate = (direction: "forward" | "backward") => {
    const weeks = direction === "forward" ? navigateWeeks : -navigateWeeks;
    navigateDate(
      startDate,
      endDate,
      weeks,
      setStartDate,
      setEndDate,
      dateFormat
    );
  };

  return (
    <Stack direction="row" gap={"0.25rem"} mt={1} justifyContent={"end"}>
      <FilledArrow
        enableKeyboardNavigation={false}
        onClick={() => handleNavigate("backward")}
        isRightArrow={false}
        backgroundColor={"grey.100"}
      />
      <FilledArrow
        enableKeyboardNavigation={false}
        onClick={() => handleNavigate("forward")}
        isRightArrow={true}
        backgroundColor={"grey.100"}
      />
    </Stack>
  );
};

export default DateNavigator;
