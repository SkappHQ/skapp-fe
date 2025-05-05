import { Chip, type SxProps, useTheme } from "@mui/material";
import { FC } from "react";

import { useMediaQuery } from "~community/common/hooks/useMediaQuery";
import { mergeSx } from "~community/common/utils/commonUtil";

import styles from "./styles";

interface Props {
  label: string | undefined;
  chipStyles?: SxProps | undefined;
  isResponsive?: boolean;
  id?: string;
  dataTestId?: string;
}

const ReadOnlyChip: FC<Props> = ({
  label,
  isResponsive = false,
  chipStyles,
  id,
  dataTestId
}) => {
  const theme = useTheme();
  const classes = styles(theme);

  // TODO: Is a custom breakpoint needed here? can't we use an existing breakpoint?
  const queryMatches = useMediaQuery();
  const isBelow1350 = queryMatches(1350);

  return (
    <Chip
      id={id}
      data-testid={dataTestId}
      aria-label={label}
      label={
        isBelow1350 && isResponsive
          ? label
              ?.split(" ")
              .slice(0, 2)
              .filter((word) => word !== undefined)
              .join(" ")
          : label
      }
      sx={mergeSx([classes.chipContainer, chipStyles])}
    />
  );
};

export default ReadOnlyChip;
