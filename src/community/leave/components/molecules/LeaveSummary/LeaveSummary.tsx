import { Chip, Stack, Theme, Typography, useTheme } from "@mui/material";
import { DateTime } from "luxon";
import { useMemo } from "react";

import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";
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

  const primaryManager = useMemo(() => {
    if (!myManagers || myManagers.length === 0) return null;
    return myManagers.find((manager) => manager.isPrimaryManager === true);
  }, [myManagers]);

  const otherManagers = useMemo(() => {
    if (!myManagers || myManagers.length === 0) return [];
    return myManagers.filter((manager) => manager.isPrimaryManager === false);
  }, [myManagers]);

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
            <AvatarChip
              key={primaryManager?.employeeId ?? ""}
              firstName={primaryManager?.firstName ?? ""}
              lastName={primaryManager?.lastName ?? ""}
              avatarUrl={primaryManager?.authPic ?? ""}
              chipStyles={classes.chipStyles}
            />

            {otherManagers.length > 0 && (
              <AvatarChip
                key={otherManagers[0]?.employeeId ?? ""}
                firstName={otherManagers[0]?.firstName ?? ""}
                lastName={otherManagers[0]?.lastName ?? ""}
                avatarUrl={otherManagers[0]?.authPic ?? ""}
                chipStyles={classes.chipStyles}
              />
            )}
            {otherManagers.length > 2 && (
              <BasicChip
                chipStyles={{
                  backgroundColor: theme.palette.grey[100],
                  height: "3rem",
                  width: "4rem",
                  borderRadius: "10rem"
                }}
                label={`+${otherManagers.length - 1}`}
              />
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default LeaveSummary;
