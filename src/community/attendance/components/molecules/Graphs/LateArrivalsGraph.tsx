import { Box, type Theme, Typography, useTheme } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { DateTime } from "luxon";
import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";

import {
  GRAPH_LEFT,
  GRAPH_RIGHT,
  LATE_ARRIVALS_CHART_SHIFT_DAYS,
  lateArrivalsGraphTypes
} from "~community/attendance/utils/echartOptions/constants";
import { useLateArrivalsGraphOptions } from "~community/attendance/utils/echartOptions/lateArrivalsGraphOptions";
import Icon from "~community/common/components/atoms/Icon/Icon";
import ToggleSwitch from "~community/common/components/atoms/ToggleSwitch/ToggleSwitch";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { XIndexTypes } from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";

import TimesheetClockInOutSkeleton from "../Skeletons/TimesheetClockInOutSkeleton";

interface Props {
  error?: Error;
  chartData: {
    preProcessedData: number[];
    labels: string[];
  };
  type?: string;
  dataCategory?: string;
  setDataCategory: Dispatch<SetStateAction<string>>;
  withTeamFilter?: boolean;
  isDataLoading?: boolean;
  title?: string;
}

const LateArrivalsGraph = ({
  error,
  chartData,
  dataCategory,
  setDataCategory,
  isDataLoading
}: Props): JSX.Element => {
  const translations = useTranslator("attendanceModule", "dashboards");
  const theme: Theme = useTheme();
  const currentMonth = DateTime.local().toFormat("MMM");

  const findTimeIndex = (labels: string[], standardTime: string) => {
    return (
      labels?.findIndex((time: string) => time?.includes(standardTime)) - 3
    );
  };

  const [xIndexDay, setXIndexDay] = useState<XIndexTypes>({
    startIndex: 0,
    endIndex: 0
  });

  const MaxNumberOfWeeks = 51;
  const MaxNumberOfMonths = 12;

  // set start and end index around current week/month
  useEffect(() => {
    const startIndex =
      dataCategory === lateArrivalsGraphTypes.WEEKLY.value
        ? findTimeIndex(chartData.labels, currentMonth) + 1
        : findTimeIndex(chartData.labels, currentMonth);
    const endIndex = startIndex + LATE_ARRIVALS_CHART_SHIFT_DAYS;

    setXIndexDay({
      startIndex,
      endIndex
    });
  }, [chartData?.labels, dataCategory]);

  const lateArrivalsGraphOptions = useLateArrivalsGraphOptions(
    chartData,
    xIndexDay
  );

  const handleClick = (direction: string): void => {
    if (direction === GRAPH_LEFT) {
      setXIndexDay((prev) => ({
        startIndex: prev.startIndex - LATE_ARRIVALS_CHART_SHIFT_DAYS,
        endIndex: prev.endIndex - LATE_ARRIVALS_CHART_SHIFT_DAYS
      }));
    }
    if (direction === GRAPH_RIGHT) {
      setXIndexDay((prev) => ({
        startIndex: prev.startIndex + LATE_ARRIVALS_CHART_SHIFT_DAYS,
        endIndex: prev.endIndex + LATE_ARRIVALS_CHART_SHIFT_DAYS
      }));
    }
  };

  const handleChevronVisibility = (direction: "left" | "right"): string => {
    const isWeekly = dataCategory === lateArrivalsGraphTypes.WEEKLY.value;
    const maxIndex = isWeekly ? MaxNumberOfWeeks : MaxNumberOfMonths;

    if (direction === GRAPH_LEFT) {
      return xIndexDay.startIndex <= 0 ? "hidden" : "visible";
    }

    if (direction === GRAPH_RIGHT) {
      return xIndexDay.endIndex >= maxIndex ? "hidden" : "visible";
    }

    return "hidden";
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0rem",
          gap: "0.125rem",
          width: "100%",
          height: "100%",
          minHeight: "10.9375rem",
          position: "relative"
        }}
      >
        {error ? (
          <Typography>{translations(["error"])}</Typography>
        ) : (
          <>
            <Box
              sx={{
                padding: ".75rem 1.5rem",
                backgroundColor: theme.palette.grey[50],
                borderRadius: ".75rem",
                height: "100%",
                width: "100%"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%"
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem"
                  }}
                >
                  {translations(["attendanceDashboard.lateArrivals"])}
                </Typography>

                <ToggleSwitch
                  options={[
                    lateArrivalsGraphTypes.WEEKLY.label,
                    lateArrivalsGraphTypes.MONTHLY.label
                  ]}
                  setCategoryOption={(option: string) => {
                    setDataCategory(
                      option === lateArrivalsGraphTypes.WEEKLY.label
                        ? lateArrivalsGraphTypes.WEEKLY.value
                        : lateArrivalsGraphTypes.MONTHLY.value
                    );
                  }}
                  categoryOption={
                    dataCategory === lateArrivalsGraphTypes.WEEKLY.value
                      ? lateArrivalsGraphTypes.WEEKLY.label
                      : lateArrivalsGraphTypes.MONTHLY.label
                  }
                />
              </Box>
              {isDataLoading ? (
                <TimesheetClockInOutSkeleton />
              ) : (
                <Box>
                  <ReactECharts
                    option={lateArrivalsGraphOptions}
                    style={{ height: "16.25rem" }}
                  />
                </Box>
              )}
            </Box>
            {chartData?.preProcessedData?.length !== 0 && (
              <Box
                onClick={() => handleClick(GRAPH_LEFT)}
                sx={{
                  position: "absolute",
                  bottom: "1.8rem",
                  left: "6%",
                  cursor: "pointer",
                  visibility: handleChevronVisibility(GRAPH_LEFT)
                }}
              >
                <Icon name={IconName.CHEVRON_LEFT_ICON} />
              </Box>
            )}
            {chartData?.preProcessedData?.length !== 0 && (
              <Box
                onClick={() => handleClick(GRAPH_RIGHT)}
                sx={{
                  position: "absolute",
                  bottom: "1.8rem",
                  right: "2.5%",
                  cursor: "pointer",
                  visibility: handleChevronVisibility(GRAPH_RIGHT)
                }}
              >
                <Icon name={IconName.CHEVRON_RIGHT_ICON} />
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default LateArrivalsGraph;
