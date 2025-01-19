import { Stack, Typography } from "@mui/material";
import { type SxProps, type Theme, useTheme } from "@mui/material/styles";
import { FC, useRef, useState } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import IconButton from "~community/common/components/atoms/IconButton/IconButton";
import { IconName } from "~community/common/types/IconTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import { styles } from "./styles";

interface Props {
  label: string;
  colors: string[];
  onClick: (value: string) => void;
  selectedColor: string;
  error?: string;
  required?: boolean;
  componentStyle?: SxProps;
}

const ColorPalette: FC<Props> = ({
  label,
  colors,
  componentStyle,
  onClick,
  selectedColor,
  error,
  required
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const anchorEl = useRef<HTMLDivElement | null>(null);

  const [isPopperOpen, setIsPopperOpen] = useState<boolean>(false);

  const handleColorClick = (color: string): void => {
    setIsPopperOpen(false);
    onClick(color);
  };

  const reorderedColors = selectedColor
    ? [
        selectedColor,
        ...(colors ? colors.filter((color) => color !== selectedColor) : [])
      ]
    : colors || [];

  return (
    <Stack sx={mergeSx([classes.wrapper, componentStyle])}>
      <Typography
        component="label"
        sx={{
          color: error
            ? theme.palette.error.contrastText
            : theme.palette.common.black
        }}
      >
        {label}
        {required && (
          <Typography component="span" sx={classes.asterisk}>
            &nbsp; *
          </Typography>
        )}
      </Typography>
      <Stack sx={classes.container}>
        <Stack
          ref={anchorEl}
          sx={{
            backgroundColor: error
              ? theme.palette.error.light
              : theme.palette.grey[100],
            border: error
              ? `${theme.palette.error.contrastText} 0.0625rem solid`
              : "none",
            ...classes.field
          }}
        >
          <>
            <Stack
              data-testid="color-palette"
              sx={{
                height: isPopperOpen ? "max-content" : "28px",
                overflow: isPopperOpen ? "visible" : "hidden",
                ...classes.colorWidgetWrapper
              }}
            >
              {reorderedColors.map((color: string, index: number) => {
                return (
                  <Stack
                    onClick={() => handleColorClick(color)}
                    key={index}
                    sx={{
                      ...classes.colorWidget,
                      backgroundColor: color
                    }}
                    data-testid={`input-color-${index}`}
                  >
                    {selectedColor === color && (
                      <Icon
                        name={IconName.CHECK_ICON}
                        fill={theme.palette.common.white}
                      />
                    )}
                  </Stack>
                );
              })}
            </Stack>
            <IconButton
              id="drop-down-icon-btn"
              icon={<Icon name={IconName.DROPDOWN_ARROW_ICON} />}
              buttonStyles={classes.dropDownButton}
              onClick={() => setIsPopperOpen(!isPopperOpen)}
            />
          </>
        </Stack>
      </Stack>
      {!!error && (
        <Typography variant="body2" sx={classes.error}>
          {error}
        </Typography>
      )}
    </Stack>
  );
};

export default ColorPalette;
