import { Box, Stack, Typography, useTheme } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { DateTime } from "luxon";
import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";

import {
  GRAPH_LEFT,
  GRAPH_RIGHT,
  WORK_HOUR_TREND_SHIFT_DAYS
} from "~community/attendance/utils/echartOptions/constants";
import { useWorkHourTrendChartOptions } from "~community/attendance/utils/echartOptions/workHourTrendChartOptions";
import ReadOnlyChip from "~community/common/components/atoms/Chips/BasicChip/ReadOnlyChip";
import { FilledArrow } from "~community/common/components/atoms/FilledArrow/FilledArrow";
import Icon from "~community/common/components/atoms/Icon/Icon";
import useSessionData from "~community/common/hooks/useSessionData";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { XIndexTypes } from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import { getMonthName } from "~community/common/utils/dateTimeUtils";
import { getTabIndex } from "~community/common/utils/keyboardUtils";

import TimesheetClockInOutSkeleton from "../Skeletons/TimesheetClockInOutSkeleton";

interface Props {
  isLoading?: boolean;
  error?: Error;
  data: {
    preProcessedData: number[];
    labels: string[];
  };
  title?: string;
  month: number;
  setMonth: Dispatch<SetStateAction<number>>;
}

const WorkHourGraph = ({
  isLoading,
  error,
  data,
  title,
  month,
  setMonth
}: Props): JSX.Element => {
  const { isFreeTier } = useSessionData();

  const translations = useTranslator("attendanceModule", "dashboards");
  const translateTextAria = useTranslator("attendanceAria", "dashboards");

  const { preProcessedData: datasets = [], labels = [] } = !isLoading
    ? data
    : {};

  const [xIndexDay, setXIndexDay] = useState<XIndexTypes>({
    startIndex: 0,
    endIndex: WORK_HOUR_TREND_SHIFT_DAYS
  });

  useEffect(() => {
    const startIndex = DateTime.local().day <= 15 ? 0 : 15;
    const endIndex = startIndex + WORK_HOUR_TREND_SHIFT_DAYS;

    setXIndexDay({
      startIndex,
      endIndex
    });
  }, [data]);

  const chartOptions = useWorkHourTrendChartOptions(
    labels,
    xIndexDay,
    datasets
  );

  const theme = useTheme();

  const handleClick = (direction: string): void => {
    setXIndexDay((prev) => {
      const shift =
        direction === GRAPH_LEFT
          ? -WORK_HOUR_TREND_SHIFT_DAYS
          : WORK_HOUR_TREND_SHIFT_DAYS;

      return {
        startIndex: Math.max(prev.startIndex + shift, 0),
        endIndex: Math.min(
          prev.endIndex + shift,
          labels.length > 0 ? labels.length - 1 : 0
        )
      };
    });
  };

  const handleChevronVisibility = (direction: "left" | "right"): string => {
    switch (direction) {
      case GRAPH_LEFT:
        return xIndexDay.startIndex <= 0 ? "hidden" : "visible";
      case GRAPH_RIGHT:
        return xIndexDay.endIndex >= labels.length - 1 ? "hidden" : "visible";
    }
  };

  const handleArrowClick = (direction: "left" | "right"): void => {
    if (direction === GRAPH_LEFT && month > 1) setMonth(month - 1);
    else if (direction === GRAPH_RIGHT && month < 12) setMonth(month + 1);
  };

  const FIRST_MONTH = 1;
  const LAST_MONTH = 12;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: ".75rem 1.5rem",
        height: "100%",
        gap: "1rem",
        backgroundColor: theme.palette.grey[50],
        borderRadius: ".75rem",
        width: "100%",
        pt: ".9375rem"
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
          {title}
        </Typography>

        {/* Month Navigator */}
        <Stack direction="row" gap="0.25rem">
          {month > FIRST_MONTH && (
            <FilledArrow
              onClick={() => handleArrowClick(GRAPH_LEFT)}
              isRightArrow={false}
              backgroundColor="grey.100"
              disabled={month === FIRST_MONTH || isFreeTier}
              ariaLabel={translateTextAria(["lateArrivalTrendMonthlyPrevious"])}
            />
          )}
          <ReadOnlyChip
            label={getMonthName(month)}
            chipStyles={{ backgroundColor: "grey.100", width: "7.5rem" }}
          />

          {month < LAST_MONTH && (
            <FilledArrow
              onClick={() => handleArrowClick(GRAPH_RIGHT)}
              isRightArrow
              backgroundColor="grey.100"
              disabled={month === LAST_MONTH || isFreeTier}
              ariaLabel={translateTextAria(["lateArrivalTrendMonthlyNext"])}
            />
          )}
        </Stack>
      </Box>
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
        {datasets.length === 0 ? null : error ? (
          <Typography>{translations(["error"])}</Typography>
        ) : isLoading ? (
          <TimesheetClockInOutSkeleton />
        ) : (
          <>
            <Box
              sx={{
                width: "100%",
                height: "100%"
              }}
            >
              <ReactECharts option={chartOptions} style={{ height: "10rem" }} />
            </Box>
            {data.preProcessedData.length !== 0 && (
              <Box
                tabIndex={getTabIndex(isFreeTier, -1)}
                role="button"
                onClick={() => handleClick(GRAPH_LEFT)}
                aria-label={translateTextAria([
                  "averageHoursWorkedPreviousDates"
                ])}
                sx={{
                  position: "absolute",
                  bottom: "0.5rem",
                  left: "5%",
                  cursor: "pointer",
                  visibility: handleChevronVisibility(GRAPH_LEFT)
                }}
              >
                <Icon name={IconName.CHEVRON_LEFT_ICON} />
              </Box>
            )}
            {data.preProcessedData.length !== 0 && (
              <Box
                tabIndex={getTabIndex(isFreeTier, -1)}
                role="button"
                aria-label={translateTextAria(["averageHoursWorkedNextDates"])}
                onClick={() => handleClick(GRAPH_RIGHT)}
                sx={{
                  position: "absolute",
                  bottom: "0.5rem",
                  right: "0.5%",
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
    </Box>
  );
};

export default WorkHourGraph;
