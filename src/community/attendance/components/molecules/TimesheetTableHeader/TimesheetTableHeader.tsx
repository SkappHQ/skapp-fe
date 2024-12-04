import { Box, Stack, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { FC } from "react";

import { ManagerTimesheetHeaderType } from "~community/attendance/types/attendanceTypes";
import useGetHoliday from "~community/common/hooks/useGetHoliday";
import { useTranslator } from "~community/common/hooks/useTranslator";

import EmojiChip from "../../atoms/EmojiChip/EmojiChip";
import { timesheetTableHeaderStyles } from "./styles";

interface Props {
  headerLabels: ManagerTimesheetHeaderType[];
  selectedTab: string;
}

const TimesheetTableHeader: FC<Props> = ({ headerLabels, selectedTab }) => {
  const theme: Theme = useTheme();
  const translateText = useTranslator("attendanceModule", "timesheet");
  const { getHolidaysArrayByDate } = useGetHoliday();
  const styles = timesheetTableHeaderStyles(theme, selectedTab);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={styles.headerContainer}
    >
      <Box sx={styles.stickyColumn}>
        <Typography variant="body2">
          {translateText(["nameHeaderTxt"])}
        </Typography>
      </Box>
      {headerLabels?.map((header, index) => (
        <Box key={index} sx={styles.headerCell}>
          <Typography variant="body2">
            {header?.headerDate?.toUpperCase()}
          </Typography>
          {!!getHolidaysArrayByDate(header?.headerDateObject)?.length && (
            <EmojiChip
              name="Holiday"
              emoji="1f3d6-fe0f"
              leaveType="Holiday"
              titleStyles={styles.emojiTitle}
              circleSize={1}
              containerStyles={styles.emojiChipContainer}
            />
          )}
        </Box>
      ))}
    </Stack>
  );
};

export default TimesheetTableHeader;
