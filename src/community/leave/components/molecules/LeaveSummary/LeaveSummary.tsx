import { Chip, Stack, Theme, Typography, useTheme } from "@mui/material";
import { DateTime } from "luxon";
import { useMemo } from "react";

import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import { daysTypes } from "~community/common/constants/stringConstants";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { LeaveStates } from "~community/common/types/CommonTypes";
import { getEmoji } from "~community/common/utils/commonUtil";
import { ResourceAvailabilityPayload } from "~community/leave/types/MyRequests";
import {
  getDuration,
  getLeavePeriod
} from "~community/leave/utils/myRequests/leaveSummaryUtils";
import { useGetMyManagers } from "~community/people/api/PeopleApi";
import { MyManagersType } from "~community/people/types/EmployeeTypes";

import styles from "./styles";

interface Props {
  workingDays: daysTypes[];
  resourceAvailability: ResourceAvailabilityPayload[] | undefined;
  leaveTypeName: string;
  leaveTypeEmoji: string;
  leaveDuration: LeaveStates;
  startDate: DateTime;
  endDate: DateTime;
}

const LeaveSummary = ({
  workingDays,
  resourceAvailability,
  leaveTypeName,
  leaveTypeEmoji,
  leaveDuration,
  startDate,
  endDate
}: Props) => {
  const commonTranslateText = useTranslator("durations");

  const translateText = useTranslator(
    "leaveModule",
    "myRequests",
    "applyLeaveModal",
    "leaveSummary"
  );

  const theme: Theme = useTheme();
  const classes = styles(theme);

  const { data: myManagers } = useGetMyManagers();

  const duration = useMemo(() => {
    return getDuration({
      workingDays: workingDays,
      resourceAvailability: resourceAvailability,
      leaveState: leaveDuration,
      translateText: commonTranslateText,
      startDate: startDate,
      endDate: endDate
    });
  }, [commonTranslateText, leaveDuration]);

  return (
    <Stack sx={classes.wrapper}>
      <Typography variant="body1">{translateText(["title"])}</Typography>
      <Stack sx={classes.container}>
        <Stack sx={classes.row}>
          <Typography variant="body2" sx={classes.label}>
            {translateText(["type"])}
          </Typography>
          <Chip
            label={leaveTypeName}
            icon={
              <Typography component="span">
                {getEmoji(leaveTypeEmoji)}
              </Typography>
            }
            sx={classes.chip}
          />
        </Stack>

        <Stack sx={classes.row}>
          <Typography variant="body2" sx={classes.label}>
            {translateText(["duration"])}
          </Typography>
          <Stack sx={classes.chipWrapper}>
            <Chip label={duration} sx={classes.chip} />
            {startDate ? (
              <Chip
                label={getLeavePeriod(startDate, endDate)}
                sx={classes.chip}
              />
            ) : (
              <></>
            )}
          </Stack>
        </Stack>
        <Stack sx={classes.row}>
          <Typography variant="body2" sx={classes.label}>
            {translateText(["recipient"])}
          </Typography>
          <Stack sx={classes.chipWrapper}>
            {myManagers?.map((manager: MyManagersType) => (
              <AvatarChip
                key={manager.employeeId}
                firstName={manager.firstName}
                lastName={manager.lastName}
                avatarUrl={manager.authPic}
                chipStyles={classes.chipStyles}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default LeaveSummary;
