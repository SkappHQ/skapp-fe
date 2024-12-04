import { Stack, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import ReactECharts from "echarts-for-react";
import { JSX, useEffect, useRef, useState } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import {
  formatChartButtonList,
  updateTogleState
} from "~community/common/utils/commonUtil";
import { LeaveTypeBreakDownReturnTypes } from "~community/leave/types/LeaveUtilizationTypes";
import { useLeaveUtilizationChartOptions } from "~community/leave/utils/eChartOptions/leaveUtilizationChartOptions";

import LeaveTypeBreakdownButtons from "./LeaveTypeBreakdownButtons";
import LeaveTypeBreakdownSkeleton from "./LeaveTypeBreakdownSkeleton";

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
  const theme: Theme = useTheme();
  const translateTexts = useTranslator("leaveModule", "dashboard");
  const [buttonColors, setButtonColors] = useState<string[]>([]);

  const chartRef = useRef();
  const [toggle, setToggle] = useState<Record<string, boolean> | undefined>(
    datasets?.toggle
  );

  const chartData = useLeaveUtilizationChartOptions(
    datasets,
    toggle,
    datasets?.months
  );

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
      updateTogleState({
        buttonType: leaveType,
        initialList: toggle
      })
    );
  };

  return (
    <>
      {!isLoading ? (
        <Stack
          sx={{
            backgroundColor: theme.palette.grey[100],
            borderRadius: ".75rem",
            display: "flex",
            flexDirection: "column",
            padding: ".9375rem 1.5rem",
            minHeight: "18.6875rem"
          }}
        >
          <Stack
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <Stack
              direction={"row"}
              sx={{
                justifyContent: "space-between"
              }}
            >
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%"
                }}
              />
            ) : error ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%"
                }}
              >
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
