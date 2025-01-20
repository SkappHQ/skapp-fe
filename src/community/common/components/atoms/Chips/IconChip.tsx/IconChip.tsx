import { Chip, type SxProps } from "@mui/material";
import { FC, JSX, MouseEvent, MouseEventHandler } from "react";

import { useMediaQuery } from "~community/common/hooks/useMediaQuery";
import {
  getEmoji,
  hasUnicodeCharacters
} from "~community/common/utils/commonUtil";

import styles from "./styles";

interface Props {
  label?: string;
  icon?: JSX.Element | string;
  chipStyles?: SxProps;
  isResponsive?: boolean;
  textTransform?: "capitalize" | "uppercase" | "lowercase" | "none" | undefined; // TODO: create an enum for this
  onDelete?: (event: MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onClick?: MouseEventHandler<HTMLDivElement>;
  endIcon?: JSX.Element;
  mediumScreenWidth?: number;
  emojiSize?: string;
  isTruncated?: boolean;
  dataTestId?: string;
}

const IconChip: FC<Props> = ({
  icon,
  label: originalLabel,
  chipStyles,
  isResponsive = false,
  textTransform = "capitalize",
  onDelete = () => {},
  onClick = () => {},
  endIcon,
  dataTestId,
  mediumScreenWidth = 1300, // couldn't set to 1280, as the row is tightly packed from 1300
  emojiSize,
  isTruncated = true
}) => {
  const classes = styles();

  const queryMatches = useMediaQuery();
  const isMediumScreen = queryMatches(mediumScreenWidth);

  const getTruncatedLabel = () => {
    if (!originalLabel) {
      return "";
    }

    const label = originalLabel.toString();

    if (label.length <= 10) {
      return label;
    }

    return `${label.slice(0, 10)} ...`;
  };

  const renderIcon = () => {
    if (icon && typeof icon === "string" && hasUnicodeCharacters(icon)) {
      return <>{getEmoji(icon)}</>;
    }
    return (icon as JSX.Element) || <></>;
  };

  const renderLabel = () => {
    if (isResponsive && isMediumScreen) {
      return "";
    }
    return isTruncated ? getTruncatedLabel() : originalLabel;
  };

  return (
    // TODO: Try using a styled chip here, instead of passing the styles as props
    <Chip
      component="div"
      icon={renderIcon()}
      deleteIcon={endIcon}
      onDelete={endIcon ? onDelete : undefined}
      data-testid={dataTestId}
      onClick={onClick}
      label={renderLabel()}
      sx={classes.chip({
        isResponsive,
        isMediumScreen,
        textTransform,
        hasEndIcon: !!endIcon,
        emojiSize,
        chipStyles
      })}
    />
  );
};

export default IconChip;
