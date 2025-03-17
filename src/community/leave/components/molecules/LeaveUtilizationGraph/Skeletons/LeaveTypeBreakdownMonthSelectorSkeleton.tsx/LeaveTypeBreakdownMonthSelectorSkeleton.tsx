import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Theme, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";

import styles from "./styles";

const LeaveTypeBreakdownMonthSelectorSkeleton = () => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  return (
    <Stack sx={classes.monthSelectorContainer}>
      <ArrowBackIos sx={classes.iconText} />
      <Stack sx={classes.monthList}>
        {[
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dev"
        ].map((month, index) => (
          <Typography key={index} component="span" sx={classes.iconText}>
            {month}
          </Typography>
        ))}
      </Stack>
      <ArrowForwardIos sx={classes.iconText} />
    </Stack>
  );
};

export default LeaveTypeBreakdownMonthSelectorSkeleton;
