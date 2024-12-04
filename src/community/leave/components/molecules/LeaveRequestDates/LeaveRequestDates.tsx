import { Box, Typography } from "@mui/material";
import { FC } from "react";

import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { getAsDaysString } from "~community/common/utils/dateTimeUtils";
import { getStartEndDate } from "~community/leave/utils/leaveRequest/LeaveRequestUtils";

interface Props {
  startDate: string;
  endDate: string;
  days: string;
}

const RequestDates: FC<Props> = ({ startDate, endDate, days }) => {
  const translateText = useTranslator("leaveModule", "myRequests");

  return (
    <Box
      sx={{
        color: "common.black",
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "0.625rem",
        paddingLeft: "1.25rem"
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "common.black",
          whiteSpace: "nowrap"
        }}
      >
        {getStartEndDate(startDate, endDate)}
      </Typography>
      <BasicChip
        label={
          days == "1"
            ? translateText(["myLeaveRequests", "fullDay"])
            : days < "1"
              ? translateText(["myLeaveRequests", "halfDay"])
              : getAsDaysString(days)
        }
        chipStyles={{
          "&:hover": {
            backgroundColor: "inherit",
            cursor: "default"
          }
        }}
      />
    </Box>
  );
};

export default RequestDates;
