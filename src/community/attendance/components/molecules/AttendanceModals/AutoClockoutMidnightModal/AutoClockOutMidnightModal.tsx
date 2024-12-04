import { Box, Stack, Typography } from "@mui/material";
import { FC } from "react";

import { useUpdateEmployeeStatus } from "~community/attendance/api/AttendanceApi";
import { useAttendanceStore } from "~community/attendance/store/attendanceStore";
import { AttendanceSlotType } from "~community/attendance/types/attendanceTypes";
import {
  calculateWorkedDuration,
  calculateWorkedDurationInHoursAndMinutes
} from "~community/attendance/utils/CalculateWorkedDuration";
import Button from "~community/common/components/atoms/Button/Button";
import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";
import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import Icon from "~community/common/components/atoms/Icon/Icon";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";

import styles from "./styles";

interface Props {
  closeModal: () => void;
}

const AutoClockOutMidnightModal: FC<Props> = ({ closeModal }) => {
  const { setSlotType, attendanceParams } = useAttendanceStore(
    (state) => state
  );
  const classes = styles();
  const clockOutTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const translateText = useTranslator("attendanceModule", "timeWidget");

  const { isPending, mutate } = useUpdateEmployeeStatus();

  const handleClockinAgain = (): void => {
    mutate(setSlotType(AttendanceSlotType.START));
    closeModal();
  };

  const handleCancel = (): void => {
    closeModal();
  };

  const workedHours = calculateWorkedDurationInHoursAndMinutes(
    calculateWorkedDuration(attendanceParams)
  );

  return (
    <>
      <Box component="div">
        <Box sx={classes.container}>
          <Typography variant="body2" sx={classes.headerText}>
            {translateText(["autoClockedOutMessage"])}
          </Typography>
          <Box sx={classes.bodyContainer}>
            <Stack
              direction="row"
              justifyContent="flex-start"
              spacing={1}
              alignItems="center"
              component="div"
              tabIndex={0}
            >
              <Typography variant="body2" sx={{ fontSize: ".875rem" }}>
                {translateText(["clockOutTime"])}:
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconChip
                  icon={<Icon name={IconName.CLOCK_ICON} />}
                  label={clockOutTime}
                  chipStyles={classes.iconChipStyles}
                />
              </Stack>
              <Typography variant="body2" sx={classes.workHourStyles}>
                {translateText(["workedHours"])}:
              </Typography>
              <Stack direction="row" spacing={1}>
                <BasicChip
                  label={workedHours}
                  chipStyles={classes.basicChipStyles}
                />
              </Stack>
            </Stack>
          </Box>
          <Stack spacing={2}>
            <Button
              label={translateText(["clockInAgain"])}
              endIcon={IconName.RIGHT_ARROW_ICON}
              onClick={handleClockinAgain}
              ariaLabel={translateText(["clockInAgain"])}
              isLoading={isPending}
            />
            <Button
              buttonStyle={ButtonStyle.TERTIARY}
              label={translateText(["cancel"])}
              endIcon={IconName.CLOSE_ICON}
              onClick={handleCancel}
              ariaLabel={translateText(["cancel"])}
            />
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default AutoClockOutMidnightModal;
