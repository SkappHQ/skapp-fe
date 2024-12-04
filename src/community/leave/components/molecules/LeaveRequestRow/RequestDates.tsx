import { Box, Typography } from "@mui/material";
import { FC } from "react";

import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";

interface Props {
  dates: string;
  days: string;
}
const RequestDates: FC<Props> = ({ dates, days }) => {
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
        minWidth: "10.625rem",
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
        {dates}
      </Typography>
      <BasicChip label={days} isResponsive={false} />
    </Box>
  );
};

export default RequestDates;
