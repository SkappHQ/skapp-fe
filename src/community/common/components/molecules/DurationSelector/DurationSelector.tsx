import { Stack, SxProps, Theme, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { DurationSelectorDisabledOptions } from "~community/common/types/MoleculeTypes";
import { mergeSx } from "~community/common/utils/commonUtil";
import { shouldActivateButton } from "~community/common/utils/keyboardUtils";

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
  onChange,
  error,
  commonButtonStyles
}: Props<T>) => {
  const translateText = useTranslator("commonComponents", "durationSelector");

  const theme: Theme = useTheme();
  const classes = styles(theme);

  const [isHalfDaySelected, setIsHalfDaySelected] = useState(false);

  useEffect(() => {
    if (value === options.halfDayMorning || value === options.halfDayEvening) {
      setIsHalfDaySelected(true);
    }
  }, [value, options.halfDayEvening, options.halfDayMorning]);

  const muiFullDayClasses = useMemo(() => {
    if (disabledOptions.fullDay) {
      return "Mui-disabled-button";
    } else if (value === options.fullDay) {
      return "Mui-selected-button";
    } else if (error) {
      return "Mui-error-button";
    }
    return "Mui-default-button";
  }, [disabledOptions.fullDay, error, options.fullDay, value]);

  const muiHalfDayClasses = useMemo(() => {
    if (disabledOptions.halfDayMorning && disabledOptions.halfDayEvening) {
      return "Mui-disabled-button";
    } else if (error) {
      return "Mui-error-button";
    }
    return "Mui-default-button";
  }, [disabledOptions.halfDayEvening, disabledOptions.halfDayMorning, error]);

  const muiHalfDayMorningClasses = useMemo(() => {
    if (disabledOptions.halfDayMorning) {
      return "Mui-disabled-button";
    } else if (value === options.halfDayMorning) {
      return "Mui-selected-button";
    } else if (error) {
      return "Mui-error-button";
    }
    return "Mui-default-button";
  }, [disabledOptions.halfDayMorning, error, options.halfDayMorning, value]);

  const muiHalfDayEveningClasses = useMemo(() => {
    if (disabledOptions.halfDayEvening) {
      return "Mui-disabled-button";
    } else if (value === options.halfDayEvening) {
      return "Mui-selected-button";
    } else if (error) {
      return "Mui-error-button";
    }
    return "Mui-default-button";
  }, [disabledOptions.halfDayEvening, error, options.halfDayEvening, value]);

  const onOptionClick = (value: T) => {
    onChange(value);
  };

  const handleHalfDayClick = () => {
    setIsHalfDaySelected(true);

    const halfDayOptionToSelect = disabledOptions.halfDayMorning
      ? options.halfDayEvening
      : options.halfDayMorning;

    onChange(halfDayOptionToSelect);
  };

  return (
    <Stack sx={classes.wrapper}>
      <Stack sx={classes.container}>
        <Typography
          variant="body1"
          sx={{
            color: error ? theme.palette.error.contrastText : "common.black"
          }}
        >
          {label} &nbsp;
          {isRequired && (
            <Typography component="span" sx={classes.asterisk}>
              *
            </Typography>
          )}
        </Typography>
        <Stack sx={classes.btnWrapper}>
          <Stack
            className={muiFullDayClasses}
            role="button"
            tabIndex={0}
            sx={mergeSx([classes.btn, commonButtonStyles])}
            onClick={() => onOptionClick(options.fullDay)}
            onKeyDown={(event) => {
              if (shouldActivateButton(event.key)) {
                onOptionClick(options.fullDay);
              }
            }}
          >
            <Typography
              className={muiFullDayClasses}
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
                className={muiHalfDayMorningClasses}
                role="button"
                tabIndex={0}
                sx={mergeSx([
                  classes.halfBtn,
                  classes.firstHalfBtn,
                  commonButtonStyles
                ])}
                onClick={() => onOptionClick(options.halfDayMorning)}
                onKeyDown={(event) => {
                  if (shouldActivateButton(event.key)) {
                    onOptionClick(options.halfDayMorning);
                  }
                }}
              >
                <Typography
                  className={muiHalfDayMorningClasses}
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
                className={muiHalfDayEveningClasses}
                role="button"
                tabIndex={0}
                sx={mergeSx([
                  classes.halfBtn,
                  classes.lastHalfBtn,
                  commonButtonStyles
                ])}
                onClick={() => onOptionClick(options.halfDayEvening)}
                onKeyDown={(event) => {
                  if (shouldActivateButton(event.key)) {
                    onOptionClick(options.halfDayEvening);
                  }
                }}
              >
                <Typography
                  className={muiHalfDayEveningClasses}
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
              role="button"
              tabIndex={0}
              className={muiHalfDayClasses}
              sx={mergeSx([classes.btn, commonButtonStyles])}
              onClick={handleHalfDayClick}
              onKeyDown={(event) => {
                if (shouldActivateButton(event.key)) {
                  handleHalfDayClick();
                }
              }}
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
