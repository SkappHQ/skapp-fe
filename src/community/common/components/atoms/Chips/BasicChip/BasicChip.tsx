import { Box, Chip, type SxProps, useTheme } from "@mui/material";
import { FC, useState } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import Tooltip from "~community/common/components/atoms/Tooltip/Tooltip";
import { TooltipPlacement } from "~community/common/enums/ComponentEnums";
import { useMediaQuery } from "~community/common/hooks/useMediaQuery";
import { IconName } from "~community/common/types/IconTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import styles from "./styles";

interface Props {
  label: string | undefined;
  chipStyles?: SxProps | undefined;
  isResponsive?: boolean;
  onClick?: () => void;
  onDeleteIcon?: (label?: string) => void;
  isTooltipEnabled?: boolean;
  id?: string;
  dataTestId?: string;
  coloredCloseIcon?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const BasicChip: FC<Props> = ({
  label,
  isResponsive = false,
  onClick,
  chipStyles,
  onDeleteIcon,
  isTooltipEnabled = false,
  id,
  dataTestId,
  coloredCloseIcon = false,
  onMouseEnter,
  onMouseLeave
}) => {
  const theme = useTheme();
  const classes = styles(theme);

  // TODO: Is a custom breakpoint needed here? can't we use an existing breakpoint?
  const queryMatches = useMediaQuery();
  const isBelow1350 = queryMatches(1350);

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleTooltipOpen = () => {
    if (isTooltipEnabled) {
      setIsTooltipOpen(true);
    }
  };

  const closeTooltip = () => {
    if (isTooltipEnabled) {
      setIsTooltipOpen(false);
    }
  };

  return (
    <Tooltip
      title={label ?? ""}
      placement={TooltipPlacement.BOTTOM}
      open={isTooltipOpen}
    >
      <Chip
        id={id}
        data-testid={dataTestId}
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
        onClick={onClick}
        onDelete={onDeleteIcon ? () => onDeleteIcon(label) : undefined}
        deleteIcon={
          <Box>
            <Icon
              name={IconName.CLOSE_ICON}
              fill={coloredCloseIcon ? theme.palette.primary.dark : "black"} // TODO: use the theme color
            />
          </Box>
        }
        onMouseEnter={onMouseEnter ?? handleTooltipOpen}
        onMouseLeave={onMouseLeave ?? closeTooltip}
      />
    </Tooltip>
  );
};

export default BasicChip;
