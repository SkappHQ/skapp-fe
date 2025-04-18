import { Stack, Typography } from "@mui/material";
import { type SxProps, type Theme, useTheme } from "@mui/material/styles";
import { FC, useRef, useState } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import IconButton from "~community/common/components/atoms/IconButton/IconButton";
import { IconName } from "~community/common/types/IconTypes";
import { mergeSx } from "~community/common/utils/commonUtil";
import { shouldActivateButton } from "~community/common/utils/keyboardUtils";

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

  const displayColors = colors || [];

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
              {displayColors.map((color: string, index: number) => {
                return (
                  <Stack
                    key={index}
                    data-testid={`input-color-${index}`}
                    tabIndex={0}
                    onClick={() => handleColorClick(color)}
                    onKeyDown={(e) => {
                      if (shouldActivateButton(e.key)) {
                        handleColorClick(color);
                      }
                    }}
                    sx={{
                      ...classes.colorWidget,
                      backgroundColor: color
                    }}
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
              tabIndex={-1}
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
