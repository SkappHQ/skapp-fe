import ReactECharts from "echarts-for-react";
import React from "react";

import {
  shouldCloseDialog,
  shouldMoveLeft,
  shouldMoveRight
} from "~community/common/utils/keyboardUtils";

import { GRAPH_LEFT, GRAPH_RIGHT } from "./echartOptions/constants";

interface HandleKeyPressParams {
  event: React.KeyboardEvent<HTMLDivElement>;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  chartDataLabels: string[];
  xIndexDay: { startIndex: number; endIndex: number };
  handleClick: (direction: string) => void;
  chartRef: React.RefObject<ReactECharts>;
}

export const handleGraphKeyboardNavigation = ({
  event,
  highlightedIndex,
  setHighlightedIndex,
  chartDataLabels,
  xIndexDay,
  handleClick,
  chartRef
}: HandleKeyPressParams): void => {
  if (!chartDataLabels.length) return;
  let newIndex = highlightedIndex ?? 0;

  if (shouldMoveRight(event.key)) {
    newIndex = Math.min(highlightedIndex + 1, chartDataLabels.length - 1);
    if (newIndex >= xIndexDay.endIndex) {
      handleClick(GRAPH_RIGHT);
    } else {
      setHighlightedIndex(newIndex);
      showTooltipAtIndex(chartRef, newIndex);
    }
    event.preventDefault();
  } else if (shouldMoveLeft(event.key)) {
    newIndex = Math.max(highlightedIndex - 1, 0);
    if (newIndex < xIndexDay.startIndex) {
      handleClick(GRAPH_LEFT);
    } else {
      setHighlightedIndex(newIndex);
      showTooltipAtIndex(chartRef, newIndex);
    }
    event.preventDefault();
  } else if (shouldCloseDialog(event.key)) {
    const chartInstance = chartRef.current?.getEchartsInstance?.();
    if (chartInstance) {
      chartInstance.dispatchAction({
        type: "hideTip"
      });
    }
  }
};

export const showTooltipAtIndex = (
  chartRef: React.RefObject<ReactECharts>,
  index: number
): void => {
  const chartInstance = chartRef.current?.getEchartsInstance?.();
  if (chartInstance) {
    chartInstance.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: index
    });
  }
};
