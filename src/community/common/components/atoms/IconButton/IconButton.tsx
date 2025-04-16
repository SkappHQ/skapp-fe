import { Collapse, type SxProps, Theme, Typography } from "@mui/material";
import { JSX, MouseEvent, useState } from "react";

import { useMediaQuery } from "~community/common/hooks/useMediaQuery";

import { CSIconButton } from "./CSIconButton";
import styles from "./styles";

interface Props {
  icon: JSX.Element;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  buttonStyles?: SxProps<Theme>;
  disabled?: boolean;
  hoverEffect?: boolean;
  text?: string;
  disableRipple?: boolean;
  dataProps?: Record<string, string | boolean | number>;
  isTextPermenent?: boolean;
  id?: string;
  ariaLabel?: string;
  tabIndex?: number;
}

const IconButton = ({
  icon,
  text,
  onClick = () => {},
  buttonStyles = null,
  disabled = false,
  hoverEffect = false,
  disableRipple = true,
  dataProps,
  isTextPermenent = false,
  id,
  ariaLabel,
  tabIndex = 0
}: Props): JSX.Element => {
  const queryMatches = useMediaQuery();
  const isBelow1420 = queryMatches(1420);

  const classes = styles();

  const [showText, setShowText] = useState(false);
  return (
    <CSIconButton
      id={id || ""}
      sx={{
        ...buttonStyles
      }}
      tabIndex={tabIndex}
      onClick={onClick}
      disabled={disabled}
      disableRipple={disableRipple}
      onMouseEnter={() => setShowText(true)}
      onMouseLeave={() => setShowText(false)}
      {...dataProps}
      data-testid={id || ""}
      aria-label={ariaLabel}
    >
      {hoverEffect && !isBelow1420 && (
        <Collapse orientation="horizontal" in={showText}>
          <Typography sx={classes.collapseTypography}>{text}</Typography>
        </Collapse>
      )}

      {isTextPermenent && (
        <Typography sx={classes.permanentTypography}>{text}</Typography>
      )}

      {icon}
    </CSIconButton>
  );
};

export default IconButton;
