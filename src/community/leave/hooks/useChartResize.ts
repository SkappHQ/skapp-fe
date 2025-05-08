import ReactECharts from "echarts-for-react";
import { RefObject, useCallback, useEffect, useRef } from "react";

import { useCommonStore } from "~community/common/stores/commonStore";

/**
 * Custom hook to handle chart resizing when drawer is expanded/collapsed or window is resized
 * @param chartRef Reference to the ReactECharts component
 */
export const useChartResize = (chartRef: RefObject<ReactECharts>) => {
  const { isDrawerExpanded } = useCommonStore((state) => ({
    isDrawerExpanded: state.isDrawerExpanded
  }));

  const prevDrawerState = useRef(isDrawerExpanded);

  // Function to resize chart
  const resizeChart = useCallback(() => {
    if (chartRef.current && chartRef.current.getEchartsInstance()) {
      chartRef.current.getEchartsInstance().resize();
    }
  }, [chartRef]);

  // Listen for drawer state changes
  useEffect(() => {
    // If drawer state has changed, resize
    if (prevDrawerState.current !== isDrawerExpanded) {
      resizeChart();

      prevDrawerState.current = isDrawerExpanded;
    }
  }, [isDrawerExpanded, resizeChart]);

  // Listen for window resize events
  useEffect(() => {
    window.addEventListener("resize", resizeChart);

    return () => {
      window.removeEventListener("resize", resizeChart);
    };
  }, [resizeChart]);

  return { resizeChart };
};
