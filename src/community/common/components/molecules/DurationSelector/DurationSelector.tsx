import { Stack, SxProps, Theme, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { DurationSelectorDisabledOptions } from "~community/common/types/MoleculeTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import styles from "./styles";

interface Props<T> {
  label: string;
  isRequired?: boolean;
  options: {
    fullDay: T;
    halfDayMorning: T;
    halfDayEvening: T;
  };
  disabledOptions: DurationSelectorDisabledOptions;
  value: T;
  defaultValue?: T;
  onChange: (value: T) => void;
  error?: string | undefined;
  commonButtonStyles?: SxProps;
}

const DurationSelector = <T,>({
  label,
  isRequired = true,
  options,
  disabledOptions = {
    fullDay: false,
    halfDayMorning: false,
    halfDayEvening: false
  },
  value,
  defaultValue,
  onChange,
  error,
  commonButtonStyles
}: Props<T>) => {
  const translateText = useTranslator("commonComponents", "durationSelector");

  const theme: Theme = useTheme();

  const classes = styles(theme);

  const [isHalfDaySelected, setIsHalfDaySelected] = useState(false);

  const onOptionClick = (value: T) => {
    onChange(value);
  };

  const onHalfDayClick = () => {
    setIsHalfDaySelected(true);
  };

  useEffect(() => {
    if (defaultValue === options.halfDayMorning) {
      setIsHalfDaySelected(true);
    }
  }, [disabledOptions, value]);

  return (
    <Stack sx={classes.wrapper}>
      <Stack sx={classes.container}>
        <Typography variant="body1">
          {label} &nbsp;
          {isRequired && (
            <Typography component="span" sx={classes.asterisk}>
              *
            </Typography>
          )}
        </Typography>
        <Stack sx={classes.btnWrapper}>
          <Stack
            className={
              disabledOptions.fullDay
                ? "Mui-disabled-button"
                : value === options.fullDay
                  ? "Mui-selected-button"
                  : "Mui-default-button"
            }
            sx={mergeSx([classes.btn, commonButtonStyles])}
            onClick={() => onOptionClick(options.fullDay)}
          >
            <Typography
              className={
                disabledOptions.fullDay
                  ? "Mui-disabled-button"
                  : value === options.fullDay
                    ? "Mui-selected-button"
                    : "Mui-default-button"
              }
              sx={classes.btnText}
              variant="body1"
            >
              {translateText(["fullDay"])}
            </Typography>
            {!disabledOptions.fullDay && value === options.fullDay && (
              <Icon name={IconName.SUCCESS_ICON} />
            )}
          </Stack>
          {isHalfDaySelected ? (
            <Stack sx={classes.btnGroup}>
              <Stack
                className={
                  disabledOptions.halfDayMorning
                    ? "Mui-disabled-button"
                    : value === options.halfDayMorning
                      ? "Mui-selected-button"
                      : "Mui-default-button"
                }
                sx={mergeSx([
                  classes.halfBtn,
                  classes.firstHalfBtn,
                  commonButtonStyles
                ])}
                onClick={() => onOptionClick(options.halfDayMorning)}
              >
                <Typography
                  className={
                    disabledOptions.halfDayMorning
                      ? "Mui-disabled-button"
                      : value === options.halfDayMorning
                        ? "Mui-selected-button"
                        : "Mui-default-button"
                  }
                  sx={classes.btnText}
                  variant="body1"
                >
                  {translateText(["morning"])}
                </Typography>
                {!disabledOptions.halfDayMorning &&
                  value === options.halfDayMorning && (
                    <Icon name={IconName.SUCCESS_ICON} />
                  )}
              </Stack>
              <Stack
                className={
                  disabledOptions.halfDayEvening
                    ? "Mui-disabled-button"
                    : value === options.halfDayEvening
                      ? "Mui-selected-button"
                      : "Mui-default-button"
                }
                sx={mergeSx([
                  classes.halfBtn,
                  classes.lastHalfBtn,
                  commonButtonStyles
                ])}
                onClick={() => onOptionClick(options.halfDayEvening)}
              >
                <Typography
                  className={
                    disabledOptions.halfDayEvening
                      ? "Mui-disabled-button"
                      : value === options.halfDayEvening
                        ? "Mui-selected-button"
                        : "Mui-default-button"
                  }
                  sx={classes.btnText}
                  variant="body1"
                >
                  {translateText(["evening"])}
                </Typography>
                {!disabledOptions.halfDayEvening &&
                  value === options.halfDayEvening && (
                    <Icon name={IconName.SUCCESS_ICON} />
                  )}
              </Stack>
            </Stack>
          ) : (
            <Stack
              className={
                disabledOptions.halfDayMorning && disabledOptions.halfDayEvening
                  ? "Mui-disabled-button"
                  : "Mui-default-button"
              }
              sx={mergeSx([classes.btn, commonButtonStyles])}
              onClick={onHalfDayClick}
            >
              <Typography
                className={
                  disabledOptions.halfDayMorning &&
                  disabledOptions.halfDayEvening
                    ? "Mui-disabled-button"
                    : "Mui-default-button"
                }
                sx={classes.btnText}
                variant="body1"
              >
                {translateText(["halfDay"])}
              </Typography>
              <Icon
                name={IconName.RIGHT_ARROW_ICON}
                fill={
                  disabledOptions.halfDayMorning &&
                  disabledOptions.halfDayEvening
                    ? theme.palette.grey.A100
                    : theme.palette.text.secondary
                }
              />
            </Stack>
          )}
        </Stack>
      </Stack>
      {!!error && (
        <Typography
          variant="caption"
          sx={{ color: theme.palette.error.contrastText }}
        >
          {error}
        </Typography>
      )}
    </Stack>
  );
};

export default DurationSelector;
