import { type Theme, useTheme } from "@mui/material/styles";

import { SingleTooltipFormatterParams } from "~community/common/types/EchartTypes";
import { getCommonEChartOptions } from "~community/common/utils/eChartsCommonStyles";
import { JobFamilyBreakdownType } from "~community/people/types/PeopleDashboardTypes";

import JobFamilyOverviewGraphTooltip from "./JobFamilyOverviewGraphTooltip";

export const useJobFamilyOverviewChartOptions = (
  data: JobFamilyBreakdownType[]
) => {
  const theme: Theme = useTheme();
  const commonOptions = getCommonEChartOptions(theme);

  return {
    ...commonOptions,
    tooltip: {
      trigger: "item",
      borderColor: "white",
      formatter: (params: SingleTooltipFormatterParams) =>
        JobFamilyOverviewGraphTooltip(
          params.value as number,
          params.name,
          params?.data?.jobTitles
        )
    },
    grid: {
      top: "-10%",
      left: "0%",
      right: "1%"
    },
    legend: {
      orient: "vertical",
      right: 30,
      top: "center",
      icon: "circle",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: theme.palette.text.primary,
        fontSize: 12,
        fontFamily: theme.typography.fontFamily
      }
    },
    series: [
      {
        type: "pie",
        radius: ["75%"], // Inner and outer radius to enlarge the chart
        center: ["35%", "50%"],
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
            label: "none"
          }
        },
        label: {
          show: false
        }
      }
    ]
  };
};
