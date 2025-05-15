import { Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { type Theme, useTheme } from "@mui/material/styles";
import { FC } from "react";

import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";

import { carryForwardTableRowStyles } from "./styles";

interface Props {
  name: string;
  recordData: number[];
}

const CarryForwardTableRow: FC<Props> = ({ name, recordData }) => {
  const theme: Theme = useTheme();
  const styles = carryForwardTableRowStyles(theme);

  const splitName = (name: string): { firstName: string; lastName: string } => {
    const [firstName, lastName = ""] = name.split(" ");
    return { firstName, lastName };
  };
  const { firstName, lastName } = splitName(name);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={styles.rowContainer}
    >
      <Box sx={styles.stickyColumn}>
        {name ? (
          <AvatarChip
            firstName={firstName}
            lastName={lastName}
            avatarUrl={""}
            isResponsiveLayout={true}
            chipStyles={{
              maxWidth: "100%",
              justifyContent: "flex-start"
            }}
            mediumScreenWidth={theme.breakpoints.values.lg}
            smallScreenWidth={0}
          />
        ) : null}
      </Box>

      {recordData.map((value, entryIndex) => (
        <Box key={entryIndex} sx={styles.rowContainer}>
          <Box sx={styles.headerCell}>
            <Typography variant="body2" sx={styles.label}>
              {value}
            </Typography>
          </Box>
        </Box>
      ))}
    </Stack>
  );
};

export default CarryForwardTableRow;
