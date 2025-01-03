import { PopperPlacementType } from "@mui/base";
import {
  ClickAwayListener,
  Paper,
  Popper,
  Stack,
  type SxProps,
  Typography
} from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import {
  LocalizationProvider,
  PickersCalendarHeader,
  PickersDay,
  PickersDayProps,
  StaticDatePicker
} from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import {
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import Tooltip from "~community/common/components/atoms/Tooltip/Tooltip";
import { REVERSE_DATE_FORMAT } from "~community/common/constants/timeConstants";
import { IconName } from "~community/common/types/IconTypes";
import { mergeSx } from "~community/common/utils/commonUtil";
import { convertDateToFormat } from "~community/common/utils/dateTimeUtils";
import {
  addedHolidays,
  holiday,
  holidayType
} from "~community/people/types/HolidayTypes";

import CalendarHeader from "./CalendarHeader/CalendarHeader";
import styles from "./styles";

interface Props {
  addedHolidays?: addedHolidays[];
  minDate?: DateTime;
  maxDate?: DateTime;
  value?: DateTime;
  onchange: (newValue: string) => void;
  error?: string;
  inputStyle?: SxProps;
  tooltipStyles?: SxProps;
  label: string;
  componentStyle?: SxProps;
  readOnly?: boolean;
  isWithLeaves?: boolean;
  isOnlyWorkingDays?: boolean;
  isWithHolidays?: boolean;
  placeholder: string | undefined;
  tooltip?: string;
  inputFormat?: string;
  required?: boolean;
  disableMaskedInput?: boolean;
  defaultCalendarMonth?: DateTime;
  disabled?: boolean;
  isEditable?: boolean;
  isPreviousHolidayDisabled?: boolean;
  holidays?: holiday[] | undefined;
  placeHolder?: string;
  name?: string;
  popperStyles?: SxProps;
  selectedDate: DateTime | undefined;
  setSelectedDate: Dispatch<SetStateAction<DateTime | undefined>>;
  isYearHidden?: boolean;
}

const InputDate: FC<Props> = ({
  minDate,
  maxDate,
  value,
  onchange,
  tooltipStyles,
  tooltip,
  error,
  label,
  componentStyle,
  required = false,
  disabled = false,
  holidays,
  placeholder,
  popperStyles,
  selectedDate,
  setSelectedDate,
  inputFormat,
  isYearHidden
}) => {
  const theme: Theme = useTheme();
  const classes = styles();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [placement, setPlacement] = useState<PopperPlacementType>("bottom");
  const [alreadyAppliedHolidays, setAlreadyAppliedHolidays] = useState<
    holidayType[]
  >([]);

  const open: boolean = Boolean(anchorEl);

  useEffect(() => {
    if (holidays) {
      const appliedHolidays = holidays?.pages[0]?.items?.map(
        (item: holidayType) => ({
          date: item.date,
          name: item.name,
          holidayType: item.holidayDuration || undefined
        })
      );
      setAlreadyAppliedHolidays(appliedHolidays);
    }
  }, [holidays]);

  const isHoliday = (day: DateTime) => {
    return alreadyAppliedHolidays?.find((holiday) => {
      const holidayDate = DateTime.fromISO(holiday?.date);
      if (!holidayDate.isValid) {
        return false;
      }

      return holidayDate.hasSame(day, "day");
    });
  };

  const HolidayPickersDay = (props: PickersDayProps<DateTime>) => {
    const { day, outsideCurrentMonth, ...other } = props;
    let backgroundStyle = {};

    const appliedHoliday = alreadyAppliedHolidays && isHoliday(day);

    if (appliedHoliday) {
      if (appliedHoliday?.holidayType === "FULL_DAY") {
        backgroundStyle = {
          backgroundColor: theme.palette.grey[200]
        };
      } else if (appliedHoliday.holidayType === "HALF_DAY_MORNING") {
        backgroundStyle = {
          background: `linear-gradient(90deg, ${theme.palette.grey[200]} 50%, transparent 50%)`
        };
      } else if (appliedHoliday.holidayType === "HALF_DAY_EVENING") {
        backgroundStyle = {
          background: `linear-gradient(90deg, transparent 50%, ${theme.palette.grey[200]} 50%)`
        };
      }
    }

    return (
      <Box
        style={{
          borderRadius: "50%"
        }}
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
          sx={{ ...backgroundStyle }}
        />
      </Box>
    );
  };

  const calculatePlacement = useCallback((event: MouseEvent<HTMLElement>) => {
    if (!event.currentTarget) return;

    const targetRect = event.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const bottomSpace = viewportHeight - targetRect.bottom;
    const topSpace = targetRect.top;

    setPlacement(
      bottomSpace < 300 && bottomSpace < topSpace ? "top" : "bottom"
    );
  }, []);

  const handleClick = (event: MouseEvent<HTMLElement>): void => {
    calculatePlacement(event);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleDateChange = (date: DateTime | null) => {
    if (!date) return;
    setSelectedDate(date);
    onchange(date ? date.toISO() || "" : "");
  };

  const onAccept = (date: DateTime | null) => {
    if (date) handleClose();
  };

  return (
    <Box
      sx={{
        width: "100%",
        mt: "0.75rem",
        display: "flex",
        flexDirection: "column",
        ...componentStyle
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={mergeSx([classes.labelWrapper, tooltipStyles])}
      >
        <Typography
          component="label"
          lineHeight={1.5}
          sx={{
            fontWeight: 400,
            color: disabled
              ? theme.palette.text.disabled
              : error
                ? theme.palette.error.contrastText
                : theme.palette.common.black
          }}
        >
          {label}
          {required && (
            <span style={{ color: theme.palette.error.contrastText }}>*</span>
          )}
        </Typography>
        {tooltip && (
          <Tooltip id="emoji-field" title={tooltip} isDisabled={disabled} />
        )}
      </Stack>

      <Box
        sx={{
          bgcolor: "grey.100",
          mt: "0.5rem",
          height: "3rem",
          borderRadius: "0.5rem",
          overflow: "hidden",
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          alignItems: "center",
          border: error
            ? `${theme.palette.error.contrastText} 0.0625rem solid`
            : "none"
        }}
      >
        <Typography
          sx={{
            color: selectedDate
              ? theme.palette.common.black
              : theme.palette.grey[600],

            opacity: 1
          }}
        >
          {selectedDate
            ? convertDateToFormat(
                selectedDate.toJSDate(),
                inputFormat ? inputFormat : REVERSE_DATE_FORMAT
              )
            : placeholder}
        </Typography>
        <Box onClick={(e) => !disabled && handleClick(e)}>
          <Icon
            name={IconName.CALENDAR_ICON}
            width="100px"
            height="100px"
            fill={disabled ? theme.palette.grey[600] : "black"}
          />
        </Box>
      </Box>
      <Popper
        id="custom-date-picker"
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        disablePortal
        sx={mergeSx([classes.popper, popperStyles])}
        tabIndex={0}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={value}
                slots={{
                  day: HolidayPickersDay,
                  calendarHeader: isYearHidden
                    ? CalendarHeader
                    : PickersCalendarHeader
                }}
                slotProps={{
                  leftArrowIcon: {
                    sx: {
                      "&.Mui-disabled": {
                        visibility: "hidden"
                      }
                    }
                  },
                  rightArrowIcon: {
                    sx: {
                      "&.Mui-disabled": {
                        visibility: "hidden"
                      }
                    }
                  }
                }}
                views={["year", "month", "day"]}
                onChange={handleDateChange}
                minDate={minDate}
                maxDate={maxDate}
                onAccept={(e) => onAccept(e)}
              />
            </LocalizationProvider>
          </Paper>
        </ClickAwayListener>
      </Popper>

      {!!error && (
        <Typography
          variant="body2"
          sx={mergeSx([
            classes.errorText,
            { color: theme.palette.error.contrastText }
          ])}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};
export default InputDate;
