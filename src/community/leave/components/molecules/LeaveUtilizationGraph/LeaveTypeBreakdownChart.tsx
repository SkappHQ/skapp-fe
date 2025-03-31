import { Stack, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import ReactECharts from "echarts-for-react";
import { JSX, useEffect, useRef, useState } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import {
  formatChartButtonList,
  updateToggleState
} from "~community/common/utils/commonUtil";
import { LeaveTypeBreakDownReturnTypes } from "~community/leave/types/LeaveUtilizationTypes";
import { useLeaveUtilizationChartOptions } from "~community/leave/utils/eChartOptions/leaveUtilizationChartOptions";

import LeaveTypeBreakdownButtons from "./LeaveTypeBreakdownButtons";
import LeaveTypeBreakdownSkeleton from "./Skeletons/LeaveTypeBreakdownSkeleton/LeaveTypeBreakdownSkeleton";
import styles from "./styles";

interface Props {
  isLoading: boolean;
  error: Error | null;
  datasets: LeaveTypeBreakDownReturnTypes | undefined;
}
const LeaveTypeBreakdownChart = ({
  isLoading,
  error,
  datasets
}: Props): JSX.Element => {
  const chartRef = useRef<ReactECharts>(null);

  const theme: Theme = useTheme();
  const classes = styles(theme);

  const translateTexts = useTranslator("leaveModule", "dashboard");

  const [buttonColors, setButtonColors] = useState<string[]>([]);
  const [toggle, setToggle] = useState<Record<string, boolean> | undefined>(
    datasets?.toggle
  );

  const chartData = useLeaveUtilizationChartOptions({
    datasets,
    toggle,
    monthsArray: datasets?.months
  });

  useEffect(() => {
    if (toggle === undefined) setToggle(datasets?.toggle);
  }, [datasets?.toggle, toggle]);

  useEffect(() => {
    if (datasets?.data) {
      setButtonColors(datasets?.data.map((data) => data.color));
    }
  }, [datasets?.data]);

  const toggleData = (leaveType: string): void => {
    setToggle(
      updateToggleState({
        buttonType: leaveType,
        initialList: toggle
      })
    );
  };

  return (
    <>
      {!isLoading ? (
        <Stack sx={classes.container}>
          <Stack sx={classes.innerContainer}>
            <Stack sx={classes.header}>
              <Typography variant="h4">
                {translateTexts(["leaveUtilization"])}
              </Typography>
              <LeaveTypeBreakdownButtons
                toggle={toggle}
                onClick={toggleData}
                colors={formatChartButtonList({
                  colorList: buttonColors,
                  labelList: datasets?.labels || []
                })}
                isGraph
              />
            </Stack>
            {isLoading || toggle === undefined ? (
              <Box sx={classes.loadingPlaceholder} />
            ) : error ? (
              <Box sx={classes.errorContainer}>
                <Typography>
                  {translateTexts(["somethingWentWrong"])}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display:
                    toggle &&
                    !Object.values(toggle).every((value: Object) => !value)
                      ? "block"
                      : "none"
                }}
              >
                <ReactECharts option={chartData} ref={chartRef} />
              </Box>
            )}
          </Stack>
        </Stack>
      ) : (
        <LeaveTypeBreakdownSkeleton />
      )}
    </>
  );
};

export default LeaveTypeBreakdownChart;
