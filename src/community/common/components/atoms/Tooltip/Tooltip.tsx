import { Theme, Typography, useTheme } from "@mui/material";
import Fade from "@mui/material/Fade";
import React, { FC, JSX, useState } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import { TooltipPlacement } from "~community/common/enums/ComponentEnums";
import { IconName } from "~community/common/types/IconTypes";

import StyledTooltip from "./StyledTooltip";

interface Props {
  id?: string;
  dataTestId?: string;
  open?: boolean;
  placement?: TooltipPlacement;
  PopperProps?: Record<string, string | boolean>;
  title: string | JSX.Element;
  children?: JSX.Element;
  isDisabled?: boolean;
  error?: boolean;
  maxWidth?: string;
  iconColor?: string;
}

const Tooltip: FC<Props> = ({
  title,
  maxWidth = "31.25rem",
  children,
  PopperProps,
  placement = TooltipPlacement.TOP,
  open: controlledOpen,
  dataTestId,
  id,
  isDisabled = false,
  error,
  iconColor
}) => {
  const theme: Theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isDisabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(!open);
    }
  };

  const handleFocus = () => {
    if (!isDisabled) {
      setOpen(true);
    }
  };

  const handleBlur = () => {
    setOpen(false);
  };

  const isOpen = controlledOpen !== undefined ? controlledOpen : open;

  return (
    <StyledTooltip
      arrow
      id={id}
      data-testid={dataTestId}
      open={isOpen}
      placement={placement}
      title={title}
      TransitionComponent={Fade}
      PopperProps={PopperProps}
      customstyles={{
        tooltip: {
          maxWidth: maxWidth,
          borderRadius: children ? "0.75rem" : undefined
        }
      }}
    >
      <span
        tabIndex={isDisabled ? -1 : 0}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-disabled={isDisabled}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          pointerEvents: isDisabled ? "none" : "auto", // Prevent interaction when disabled
          cursor: isDisabled ? "not-allowed" : "pointer" // Change cursor when disabled
        }}
      >
        <Typography component="span">
          {children ?? (
            <Icon
              dataTestId="tooltip-icon"
              name={IconName.INFORMATION_ICON}
              fill={
                isDisabled
                  ? theme.palette.grey.A100
                  : error
                    ? theme.palette.error.contrastText
                    : iconColor
              }
            />
          )}
        </Typography>
      </span>
    </StyledTooltip>
  );
};

export default Tooltip;
