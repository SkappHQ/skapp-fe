import { Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { type Theme, useTheme } from "@mui/material/styles";
import { FC } from "react";

import {
  TimeRecordType,
  TimesheetEmployeeType
} from "~community/attendance/types/timeSheetTypes";
import { formatDuration } from "~community/attendance/utils/TimeUtils";
import Tooltip from "~community/common/components/atoms/Tooltip/Tooltip";
import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import { TooltipPlacement } from "~community/common/enums/ComponentEnums";
import useGetHoliday from "~community/common/hooks/useGetHoliday";
import useGetWorkingDays from "~community/common/hooks/useGetWorkingDays";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { LeaveStates } from "~community/common/types/CommonTypes";
import { getEmoji } from "~community/common/utils/commonUtil";
import { isDateGraterThanToday } from "~community/common/utils/dateTimeUtils";

import EmojiChip from "../../atoms/EmojiChip/EmojiChip";
import { timesheetTableRowStyles } from "./styles";

interface Props {
  employee: TimesheetEmployeeType;
  timesheetData: TimeRecordType[];
  selectedTab: string;
  totalWorkHours: number;
}

const TimesheetTableRow: FC<Props> = ({
  employee,
  timesheetData,
  selectedTab,
  totalWorkHours
}) => {
  const theme: Theme = useTheme();
  const { getHolidaysArrayByDate } = useGetHoliday();
  const { isDateWorkingDay } = useGetWorkingDays();

  const translateText = useTranslator("attendanceModule", "timesheet");
  const styles = timesheetTableRowStyles(theme, selectedTab);

  const getLeaveLength = (leaveState: string) => {
    if (leaveState === LeaveStates.FULL_DAY) {
      return translateText(["fullDayTitle"]);
    } else {
      return translateText(["halfDayTitle"]);
    }
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={styles.rowContainer}
    >
      <Box sx={styles.stickyColumn}>
        {employee?.firstName && employee?.lastName ? (
          <AvatarChip
            firstName={employee?.firstName}
            lastName={employee?.lastName}
            avatarUrl={employee?.avatarUrl}
            isResponsiveLayout={true}
            chipStyles={{
              maxWidth: "fit-content",
              justifyContent: "flex-start"
            }}
            mediumScreenWidth={1024}
            smallScreenWidth={0}
          />
        ) : null}
      </Box>
      {timesheetData?.map((timeSheetRecord: TimeRecordType, index: number) => (
        <Box
          key={index}
          sx={styles.cell(
            !!getHolidaysArrayByDate(new Date(timeSheetRecord.date))?.length
          )}
        >
          {timeSheetRecord?.leaveRequest ? (
            <Tooltip
              title={`${getEmoji(
                timeSheetRecord?.leaveRequest?.leaveType?.emojiCode
              )}  ${getLeaveLength(timeSheetRecord?.leaveRequest?.leaveState)}`}
              maxWidth="max-content"
              placement={TooltipPlacement.BOTTOM}
            >
              <Box>
                <EmojiChip
                  name={
                    timeSheetRecord?.workedHours !== 0
                      ? formatDuration(timeSheetRecord?.workedHours)
                      : "Leave"
                  }
                  emoji={timeSheetRecord?.leaveRequest?.leaveType?.emojiCode}
                  leaveType={timeSheetRecord?.leaveRequest?.leaveState}
                />
              </Box>
            </Tooltip>
          ) : getHolidaysArrayByDate(new Date(timeSheetRecord.date))?.length ? (
            <Typography variant="body2" sx={styles.holidayText}>
              {isDateGraterThanToday(timeSheetRecord?.date) ||
              timeSheetRecord?.workedHours === 0
                ? "-"
                : formatDuration(timeSheetRecord?.workedHours)}
            </Typography>
          ) : timeSheetRecord?.workedHours < totalWorkHours &&
            timeSheetRecord?.workedHours > 0 ? (
            <Box sx={styles.errorBox}>
              <Typography sx={styles.holidayText}>
                {formatDuration(timeSheetRecord?.workedHours)}
              </Typography>
            </Box>
          ) : (
            <Typography sx={styles.holidayText}>
              {isDateGraterThanToday(timeSheetRecord?.date) ||
              (!isDateWorkingDay(timeSheetRecord?.date) &&
                timeSheetRecord?.workedHours === 0)
                ? "-"
                : formatDuration(timeSheetRecord?.workedHours)}
            </Typography>
          )}
        </Box>
      ))}
    </Stack>
  );
};

export default TimesheetTableRow;
