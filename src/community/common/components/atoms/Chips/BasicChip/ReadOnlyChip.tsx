import { Chip, type SxProps, useTheme } from "@mui/material";
import { FC } from "react";

import {
  MediaQueries,
  useMediaQuery
} from "~community/common/hooks/useMediaQuery";
import { mergeSx } from "~community/common/utils/commonUtil";

import styles from "./styles";

interface Props {
  label?: string;
  chipStyles?: SxProps;
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

  const queryMatches = useMediaQuery();
  const isBelow1024 = queryMatches(MediaQueries.BELOW_1024);

  const getLabel = (label?: string) => {
    if (label === undefined) {
      return "";
    } else if (isBelow1024 && isResponsive) {
      return label
        ?.split(" ")
        .slice(0, 2)
        .filter((word) => word !== undefined)
        .join(" ");
    }

    return label;
  };

  return (
    <Chip
      id={id}
      data-testid={dataTestId}
      aria-label={label}
      label={getLabel(label)}
      sx={mergeSx([classes.chipContainer, chipStyles])}
    />
  );
};

export default ReadOnlyChip;
