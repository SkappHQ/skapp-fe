import { Box, Stack, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { FC } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";

import { carryForwardTableHeaderStyles } from "./styles";

interface Props {
  leaveHeaders: string[];
}

const CarryForwardTableHeader: FC<Props> = ({ leaveHeaders }) => {
  const theme: Theme = useTheme();
  const translateTexts = useTranslator("attendanceModule", "timesheet");
  const styles = carryForwardTableHeaderStyles(theme);

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={styles.headerContainer}
      >
        <Box sx={styles.stickyColumn}>
          <Typography variant="body2">
            {translateTexts(["nameHeaderTxt"])}
          </Typography>
        </Box>
        {leaveHeaders?.map((header, index) => (
          <Box sx={styles.headerCell} key={index}>
            <Typography variant="body2">{header?.toUpperCase()}</Typography>
          </Box>
        ))}
      </Stack>
    </>
  );
};

export default CarryForwardTableHeader;
