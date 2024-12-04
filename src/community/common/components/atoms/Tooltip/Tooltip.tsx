import { Theme, Typography, useTheme } from "@mui/material";
import Fade from "@mui/material/Fade";
import { FC, JSX } from "react";

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
  open,
  dataTestId,
  id,
  isDisabled = false,
  error,
  iconColor
}) => {
  const theme: Theme = useTheme();

  return (
    <StyledTooltip
      arrow
      id={id}
      data-testid={dataTestId}
      open={open}
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
