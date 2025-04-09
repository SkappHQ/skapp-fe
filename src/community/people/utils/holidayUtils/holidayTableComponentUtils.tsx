import { Box, Typography } from "@mui/material";

import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";
import {
  Holiday,
  HolidayDurationType
} from "~community/people/types/HolidayTypes";

import { getFormattedDate } from "./commonUtils";

export const returnDurationLabel = (
  duration: HolidayDurationType,
  translateText: (key: string[]) => string
): string => {
  switch (duration) {
    case HolidayDurationType.FULLDAY:
      return translateText(["fullDay"]);
    case HolidayDurationType.HALFDAY_MORNING:
      return translateText(["halfDayMorning"]);
    case HolidayDurationType.HALFDAY_EVENING:
      return translateText(["halfDayEvening"]);
    default:
      return duration;
  }
};

export const getTableHeaders = (translateText: (key: string[]) => string) => [
  { id: "date", label: translateText(["tableDateColumnTitle"]) },
  {
    id: "holidayName",
    label: translateText(["tableHolidayNameColumnTitle"])
  }
];

export const transformToTableRows = (
  holidayData: Holiday[] | undefined,
  translateText: (key: string[]) => string,
  isRowDisabled: (id: number) => boolean,
  dateWrapperStyles: any
) => {
  return (
    (Array.isArray(holidayData) &&
      holidayData.map((holiday) => ({
        id: holiday.id,
        date: (
          <Box sx={dateWrapperStyles}>
            <Typography variant="body1">
              {getFormattedDate(holiday?.date || "", true)}
            </Typography>
            <BasicChip
              label={returnDurationLabel(
                holiday?.holidayDuration || HolidayDurationType.NONE,
                translateText
              )}
              chipStyles={{
                mx: "0.3125rem",
                cursor: isRowDisabled(holiday.id) ? "not-allowed" : "pointer"
              }}
            />
          </Box>
        ),
        holidayName: holiday?.name,
        actionData: holiday?.id
      }))) ||
    []
  );
};
