import { Box, CircularProgress } from "@mui/material";
import { JSX } from "react";

import { useUpdateEmployeeStatus } from "~community/attendance/api/AttendanceApi";
import { useGetTodaysTimeRequestAvailability } from "~community/attendance/api/AttendanceEmployeeApi";
import { useAttendanceStore } from "~community/attendance/store/attendanceStore";
import { AttendanceSlotType } from "~community/attendance/types/attendanceTypes";
import Icon from "~community/common/components/atoms/Icon/Icon";
import Tooltip from "~community/common/components/atoms/Tooltip/Tooltip";
import { TooltipPlacement } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { shouldActivateButton } from "~community/common/utils/keyboardUtils";

import styles from "./styles";

const PlayButton = (): JSX.Element => {
  const { attendanceParams } = useAttendanceStore((state) => state);
  const classes = styles();
  const status = attendanceParams.slotType;
  const translateText = useTranslator("attendanceModule", "timeWidget");
  const translateAria = useTranslator("attendanceAria", "timeWidget");

  const { isPending, mutate } = useUpdateEmployeeStatus();

  const {
    data: isTimeRequestAvailableToday,
    isLoading: isAvailabilityLoading
  } = useGetTodaysTimeRequestAvailability();

  const onClick = () => {
    if (
      status === AttendanceSlotType.RESUME ||
      status === AttendanceSlotType.START
    ) {
      mutate(AttendanceSlotType.PAUSE);
    } else {
      mutate(AttendanceSlotType.RESUME);
    }
  };

  const getTooltipText = () => {
    if (
      status === AttendanceSlotType.RESUME ||
      status === AttendanceSlotType.START
    ) {
      return translateText(["takeABreak"]);
    } else if (
      status === AttendanceSlotType.READY ||
      status === AttendanceSlotType.END ||
      status === AttendanceSlotType.LEAVE_DAY ||
      status === AttendanceSlotType.HOLIDAY ||
      status === AttendanceSlotType.NON_WORKING_DAY
    ) {
      return "";
    } else {
      return translateText(["resumeWork"]);
    }
  };

  return (
    <Tooltip
      id="play-button"
      title={getTooltipText()}
      placement={TooltipPlacement.BOTTOM}
      spanStyles={{
        borderRadius: "50%"
      }}
    >
      <Box
        tabIndex={0}
        role="0"
        component="button"
        sx={status && classes.buttonComponent(status)}
        onClick={onClick}
        onKeyDown={(e) => {
          if (shouldActivateButton(e.key)) {
            onClick();
          }
        }}
        disabled={
          isPending ||
          status === AttendanceSlotType.READY ||
          status === AttendanceSlotType.END ||
          isTimeRequestAvailableToday ||
          isAvailabilityLoading ||
          status === AttendanceSlotType.HOLIDAY ||
          status === AttendanceSlotType.NON_WORKING_DAY ||
          status === AttendanceSlotType.LEAVE_DAY
        }
        aria-label={
          status === AttendanceSlotType.RESUME ||
          status === AttendanceSlotType.START ||
          status === AttendanceSlotType.END
            ? translateAria(["pauseTimer"])
            : translateAria(["startTimer"])
        }
      >
        {isPending ? (
          <CircularProgress size={"1rem"} />
        ) : status === AttendanceSlotType.RESUME ||
          status === AttendanceSlotType.START ||
          status === AttendanceSlotType.END ? (
          <Icon name={IconName.PAUSE_ICON} />
        ) : (
          <Icon name={IconName.PLAY_ICON} />
        )}
      </Box>
    </Tooltip>
  );
};

export default PlayButton;
