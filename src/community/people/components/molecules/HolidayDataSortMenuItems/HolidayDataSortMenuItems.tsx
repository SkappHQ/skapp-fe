import { Box } from "@mui/material";
import { JSX } from "react";

import SortRow from "~community/common/components/atoms/SortRow/SortRow";
import { SortOrderTypes } from "~community/common/types/CommonTypes";
import { usePeopleStore } from "~community/people/store/store";

interface Props {
  handleClose: () => void;
  scrollToTop?: () => void | undefined;
}
const HolidayDataSortMenuItems = ({
  handleClose,
  scrollToTop
}: Props): JSX.Element => {
  const holidayDataSort = usePeopleStore(
    (state) => state.holidayDataParams.sortOrder
  );
  const handleHolidayDataSort = usePeopleStore(
    (state) => state.handleHolidayDataSort
  );

  return (
    <Box sx={{ backgroundColor: "common.white" }}>
      <SortRow
        text="Chronologically : Jan to Dec"
        selected={holidayDataSort === SortOrderTypes.ASC}
        onClick={() => {
          handleHolidayDataSort("sortOrder", SortOrderTypes.ASC);
          handleClose();
          scrollToTop && scrollToTop();
        }}
      />
      <SortRow
        text="Chronologically : Dec to Jan"
        selected={holidayDataSort === SortOrderTypes.DESC}
        onClick={() => {
          handleHolidayDataSort("sortOrder", SortOrderTypes.DESC);
          handleClose();
          scrollToTop && scrollToTop();
        }}
      />
    </Box>
  );
};

export default HolidayDataSortMenuItems;
