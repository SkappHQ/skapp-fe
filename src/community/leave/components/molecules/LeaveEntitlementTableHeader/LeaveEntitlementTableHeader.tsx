import { Box, Stack, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { FC } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";

import styles from "./styles";

interface Props {
  headerLabels: string[];
}

const LeaveEntitlementTableHeader: FC<Props> = ({ headerLabels }) => {
  const translateText = useTranslator("leaveModule", "leaveEntitlements");

  const theme: Theme = useTheme();
  const classes = styles(theme);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={classes.headerContainer}
    >
      <Box sx={classes.stickyColumn}>
        <Typography variant="body2">{translateText(["name"])}</Typography>
      </Box>
      {headerLabels?.map((header) => (
        <Box key={header} sx={classes.headerCell}>
          <Typography variant="body2">{header?.toUpperCase()}</Typography>
        </Box>
      ))}
    </Stack>
  );
};

export default LeaveEntitlementTableHeader;
