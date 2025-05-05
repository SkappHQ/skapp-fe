import { Box, Stack, Typography, useTheme } from "@mui/material";
import { JSX, useEffect, useState } from "react";

import PlayButton from "~community/attendance/components/molecules/PlayButton/PlayButton";
import { useAttendanceStore } from "~community/attendance/store/attendanceStore";
import { AttendanceSlotType } from "~community/attendance/types/attendanceTypes";
import { calculateWorkedDuration } from "~community/attendance/utils/CalculateWorkedDuration";
import {
  MediaQueries,
  useMediaQuery
} from "~community/common/hooks/useMediaQuery";

import styles from "./styles";

const Timer = ({ disabled }: { disabled: boolean }): JSX.Element => {
  const { attendanceParams, isAttendanceModalOpen } = useAttendanceStore(
    (state) => state
  );
  const theme = useTheme();
  const classes = styles(theme);
  const status = attendanceParams.slotType;
  const [timer, setTimer] = useState(calculateWorkedDuration(attendanceParams));

  const isBelow600 = useMediaQuery()(MediaQueries.BELOW_600);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    setTimer(calculateWorkedDuration(attendanceParams));

    if (
      (status === AttendanceSlotType.RESUME ||
        status === AttendanceSlotType.START) &&
      !isAttendanceModalOpen
    ) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (status === AttendanceSlotType.END) {
      setTimer(0);
    } else {
      interval && clearInterval(interval);
    }

    return () => {
      interval && clearInterval(interval);
    };
  }, [status, attendanceParams, isAttendanceModalOpen]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={1}
      component="div"
      sx={status && classes.container(status)}
    >
      <Box
        key={timer}
        sx={status && classes.timerComponent(status, isAttendanceModalOpen)}
      />
      {/* timer */}
      {!isBelow600 && (
        <Typography
          variant="h3"
          component="p"
          sx={classes.textStyle(disabled)}
          minWidth={68}
        >
          {timer
            ? new Date(timer * 1000).toISOString().substring(11, 19)
            : "00:00:00"}
        </Typography>
      )}
      <PlayButton />
    </Stack>
  );
};

export default Timer;
