import { Avatar, Theme, useTheme } from "@mui/material";
import { FC, KeyboardEvent } from "react";
import * as React from "react";

import ArrowFilledLeft from "~community/common/assets/Icons/ArrowFilledLeft";
import ArrowFilledRight from "~community/common/assets/Icons/ArrowFilledRight";

interface Props {
  onClick: (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>
  ) => void;
  disabled?: boolean;
  enableKeyboardNavigation?: boolean;
  isRightArrow?: boolean;
  ariaLabel?: string;
  tabIndex?: number;
  backgroundColor?: string;
}

export const FilledArrow: FC<Props> = ({
  onClick,
  disabled = false,
  enableKeyboardNavigation = true,
  isRightArrow = true,
  ariaLabel,
  backgroundColor = "common.white",
  tabIndex = 0
}: Props) => {
  const theme: Theme = useTheme();

  return (
    <Avatar
      onClick={(event: React.MouseEvent<HTMLDivElement>) => {
        if (!disabled) {
          onClick(event);
        }
      }}
      aria-disabled={disabled}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (!disabled && event.key === "Enter" && enableKeyboardNavigation) {
          onClick(event);
        }
      }}
      sx={{
        cursor: disabled ? "default" : "pointer",
        backgroundColor: disabled ? "grey.50" : backgroundColor,
        height: "2.5rem",
        width: "2.5rem",
        borderRadius: "10rem"
      }}
      role="button"
      tabIndex={disabled ? -1 : tabIndex}
      aria-label={ariaLabel}
    >
      {isRightArrow ? (
        <ArrowFilledRight
          width={"4"}
          height={"8"}
          fill={disabled ? theme.palette.grey[800] : theme.palette.grey[400]}
        />
      ) : (
        <ArrowFilledLeft
          width={"4"}
          height={"8"}
          fill={disabled ? theme.palette.grey[800] : theme.palette.grey[400]}
        />
      )}
    </Avatar>
  );
};
