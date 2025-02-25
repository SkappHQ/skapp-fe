import { Button, type ButtonProps } from "@mui/material";
import { styled } from "@mui/system";

import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { parseHexToRgb } from "~community/common/utils/commonUtil";

interface StyledButtonProps {
  buttonsize: ButtonSizes;
  buttonstyle: ButtonStyle;
  width: string;
  textcolor: string;
  isdefaulticoncolor: string;
  isstrokeavailable: string;
  shouldblink?: boolean; // New prop to enable blinking outline
}

const StyledButton = styled(Button)<ButtonProps & StyledButtonProps>(({
  theme,
  disabled,
  buttonsize,
  buttonstyle,
  width,
  textcolor,
  isdefaulticoncolor,
  isstrokeavailable,
  shouldblink
}) => {
  const padding = () => {
    switch (buttonsize) {
      case ButtonSizes.SMALL:
        return "0.5rem 1rem";
      case ButtonSizes.MEDIUM:
        return "0.75rem 1.25rem";
      case ButtonSizes.LARGE:
        return "1.25rem 2.5rem";
      default:
        return "1.25rem 2.5rem";
    }
  };

  const backgroundColor = () => {
    switch (buttonstyle) {
      case ButtonStyle.PRIMARY:
        return theme.palette.primary.main;
      case ButtonStyle.SECONDARY:
        return theme.palette.secondary.main;
      case ButtonStyle.TERTIARY:
      case ButtonStyle.TERTIARY_OUTLINED:
        return theme.palette.grey[100];
      case ButtonStyle.ERROR:
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const borderOnHover = () => {
    switch (buttonstyle) {
      case ButtonStyle.PRIMARY:
        return `0.125rem solid ${theme.palette.secondary.dark}`;
      case ButtonStyle.SECONDARY:
        return `0.125rem solid ${theme.palette.secondary.dark}`;
      case ButtonStyle.TERTIARY:
      case ButtonStyle.TERTIARY_OUTLINED:
        return `0.125rem solid ${theme.palette.grey[500]}`;
      case ButtonStyle.ERROR:
        return `0.125rem solid ${theme.palette.error.dark}`;
      default:
        return `0.125rem solid ${theme.palette.primary.main}`;
    }
  };

  const boxShadowColorOnHover = () => {
    switch (buttonstyle) {
      case ButtonStyle.PRIMARY:
        return theme.palette.primary.dark;
      case ButtonStyle.SECONDARY:
        return theme.palette.secondary.dark;
      case ButtonStyle.TERTIARY:
      case ButtonStyle.TERTIARY_OUTLINED:
        return theme.palette.grey[500];
      case ButtonStyle.ERROR:
        return theme.palette.error.dark;
      default:
        return null;
    }
  };

  const outline = () => {
    switch (buttonstyle) {
      case ButtonStyle.PRIMARY:
      case ButtonStyle.TERTIARY:
      case ButtonStyle.ERROR:
        return "none";
      case ButtonStyle.SECONDARY:
        return `0.0625rem solid ${theme.palette.secondary.dark}`;
      case ButtonStyle.TERTIARY_OUTLINED:
        return `0.0625rem solid ${theme.palette.grey[500]}`;
      default:
        return "none";
    }
  };

  const rgbForBlink = () => {
    if (shouldblink) {
      const rgbValues = parseHexToRgb(theme.palette.secondary.dark);

      return `${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}`;
    }

    return "";
  };

  return {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    padding: padding(),
    boxSizing: "border-box",
    width: width,
    backgroundColor: backgroundColor(),
    border: "0.125rem solid transparent",
    outline: outline(),
    outlineOffset: "-1px",
    borderRadius: "3.125rem",
    ".MuiTypography-root": {
      color: disabled ? theme.palette.grey[800] : textcolor
    },
    ".MuiButton-startIcon, .MuiButton-endIcon": {
      margin: "0rem",
      "svg path": {
        fill:
          disabled && isstrokeavailable === "false"
            ? theme.palette.grey[800]
            : isdefaulticoncolor === "false" && isstrokeavailable === "false"
              ? textcolor
              : "",
        stroke: isstrokeavailable === "false" || disabled ? "" : textcolor
      }
    },
    ".MuiCircularProgress-root": {
      color: textcolor
    },
    "&:hover": {
      outline: "none",
      border: borderOnHover(),
      boxShadow: `inset 0 0 0 0.125rem ${disabled ? theme.palette.text.secondary : boxShadowColorOnHover}`
    },
    "&.Mui-disabled": {
      outline: "none",
      backgroundColor: theme.palette.grey[100],
      boxShadow: `inset 0 0 0 0.063rem ${theme.palette.grey[300]}`,
      border: `0.125rem solid ${theme.palette.grey[300]}`
    },
    ...(shouldblink && {
      animation: "blink 1.5s ease-in-out infinite",
      "@keyframes blink": {
        "0%": {
          boxShadow: `0 0 0.25rem 0.125rem rgb(${rgbForBlink()})`
        },
        "50%": {
          boxShadow: `0 0 0.5rem 0.25rem rgb(${rgbForBlink()})`
        },
        "100%": {
          boxShadow: `0 0 0.25rem 0.125rem rgb(${rgbForBlink()})`
        }
      }
    })
  };
});

export default StyledButton;
