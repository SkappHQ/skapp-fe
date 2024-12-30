import { Box, Stack, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { FC } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";

import { tableHeaderStyles } from "./styles";

interface Props {
  headerLabels: string[];
}

const LeaveEntitlementTableHeader: FC<Props> = ({ headerLabels }) => {
  const theme: Theme = useTheme();
  const translateText = useTranslator("leaveModule", "leaveEntitlements");
  const styles = tableHeaderStyles(theme);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={styles.headerContainer}
    >
      <Box sx={styles.stickyColumn}>
        <Typography variant="body2">{translateText(["name"])}</Typography>
      </Box>
      {headerLabels?.map((header, index) => (
        <Box key={index} sx={styles.headerCell}>
          <Typography variant="body2">{header?.toUpperCase()}</Typography>
        </Box>
      ))}
    </Stack>
  );
};

export default LeaveEntitlementTableHeader;
