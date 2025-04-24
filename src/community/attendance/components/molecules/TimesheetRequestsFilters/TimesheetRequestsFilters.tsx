import { Box, Stack, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { DateTime } from "luxon";
import { FC, MouseEvent, useEffect, useState } from "react";

import TimesheetFilterModal from "~community/attendance/components/molecules/TimesheetFilterModal/TimesheetFilterModal";
import { useAttendanceStore } from "~community/attendance/store/attendanceStore";
import Icon from "~community/common/components/atoms/Icon/Icon";
import IconButton from "~community/common/components/atoms/IconButton/IconButton";
import DateRangePicker from "~community/common/components/molecules/DateRangePicker/DateRangePicker";
import { DATE_FORMAT } from "~community/common/constants/timeConstants";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { pascalCaseFormatter } from "~community/common/utils/commonUtil";
import {
  convertDateToFormat,
  getFirstDateOfYear
} from "~community/common/utils/dateTimeUtils";
import ShowSelectedFilters from "~community/people/components/molecules/ShowSelectedFilters/ShowSelectedFilters";

import styles from "./styles";

interface Props {
  isManager?: boolean;
}

const TimesheetRequestsFilters: FC<Props> = ({ isManager = false }: Props) => {
  const theme: Theme = useTheme();
  const translateText = useTranslator("attendanceModule", "timesheet");
  const translateAria = useTranslator(
    "attendanceAria",
    "timesheet",
    "timeEntryRequestTable"
  );
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [filterEl, setFilterEl] = useState<null | HTMLElement>(null);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const filterBeOpen: boolean = filterOpen && Boolean(filterEl);
  const filterId = filterBeOpen ? "filter-popper" : undefined;
  const classes = styles(theme);

  const {
    employeeSelectedTimesheetFilterLabels,
    employeeTimesheetRequestsFilters,
    selectedTimesheetFilterLabels,
    timesheetRequestsFilters,
    setEmployeeTimesheetSelectedFilterLabels,
    setEmployeeTimesheetRequestsFilters,
    resetEmployeeTimesheetRequestParams,
    setEmployeeTimesheetRequestSelectedDates,
    resetTimesheetRequestParamsToDefault,
    setTimesheetSelectedFilterLabels,
    setTimesheetRequestsFilters,
    resetTimesheetRequestParams,
    setTimesheetRequestSelectedDates
  } = useAttendanceStore((state) => state);

  const handleFilterClick = (event: MouseEvent<HTMLElement>): void => {
    setFilterEl(event.currentTarget);
    setFilterOpen((previousOpen) => !previousOpen);
  };

  const handleFilterClose = (): void => {
    setFilterEl(null);
    setFilterOpen(false);
  };

  const firstDateOfYear = getFirstDateOfYear(DateTime.now().year);

  const selectedFilterLabels = isManager
    ? selectedTimesheetFilterLabels
    : employeeSelectedTimesheetFilterLabels;

  const removeEmployeeFilters = (label: string) => {
    const employeeSelectedTimesheetFilterLabelsCopy = [...selectedFilterLabels];
    const employeeFilteredLabels =
      employeeSelectedTimesheetFilterLabelsCopy?.filter(
        (itemLabel) => itemLabel !== pascalCaseFormatter(label)
      );
    setEmployeeTimesheetSelectedFilterLabels(employeeFilteredLabels);

    const employeeTimesheetRequestsFiltersCopy: Record<string, string[]> = {
      ...employeeTimesheetRequestsFilters
    };
    Object.keys(employeeTimesheetRequestsFiltersCopy)?.forEach((category) => {
      const index = employeeTimesheetRequestsFiltersCopy[category]?.indexOf(
        label?.toLocaleUpperCase()
      );
      if (index !== -1) {
        employeeTimesheetRequestsFiltersCopy[category]?.splice(index, 1);
      }
    });
    setEmployeeTimesheetRequestsFilters(employeeTimesheetRequestsFiltersCopy);
  };

  const handleResetManager = () => {
    handleFilterClose();
    resetTimesheetRequestParams();
  };

  const handleApplyManager = (
    selectedFilters: Record<string, string[]>,
    selectedFilterLabels: string[]
  ) => {
    setTimesheetSelectedFilterLabels(selectedFilterLabels);
    setTimesheetRequestsFilters(selectedFilters);
    setFilterEl(null);
    setFilterOpen(false);
  };

  const removeManagerFilters = (label: string) => {
    const selectedTimesheetFilterLabelsCopy = [
      ...selectedTimesheetFilterLabels
    ];
    const filteredLabels = selectedTimesheetFilterLabelsCopy?.filter(
      (itemLabel) => itemLabel !== pascalCaseFormatter(label)
    );
    setTimesheetSelectedFilterLabels(filteredLabels);

    const timesheetRequestsFiltersCopy: Record<string, string[]> = {
      ...timesheetRequestsFilters
    };
    Object.keys(timesheetRequestsFiltersCopy)?.forEach((category) => {
      const index = timesheetRequestsFiltersCopy[category]?.indexOf(
        label?.toLocaleUpperCase()
      );
      if (index !== -1) {
        timesheetRequestsFiltersCopy[category]?.splice(index, 1);
      }
    });
    setTimesheetRequestsFilters(timesheetRequestsFiltersCopy);
  };

  const handleResetEmployee = () => {
    handleFilterClose();
    resetEmployeeTimesheetRequestParams();
  };

  const handleApplyEmployee = (
    selectedFilters: Record<string, string[]>,
    selectedFilterLabels: string[]
  ) => {
    setEmployeeTimesheetSelectedFilterLabels(selectedFilterLabels);
    setEmployeeTimesheetRequestsFilters(selectedFilters);
    setFilterEl(null);
    setFilterOpen(false);
  };

  useEffect(() => {
    const convertedStartDate = selectedDates?.[0]
      ? convertDateToFormat(selectedDates[0], DATE_FORMAT)
      : "";
    const convertedEndDate = selectedDates?.[1]
      ? convertDateToFormat(selectedDates[1], DATE_FORMAT)
      : "";

    if (isManager) {
      setTimesheetRequestSelectedDates([convertedStartDate, convertedEndDate]);
    } else {
      setEmployeeTimesheetRequestSelectedDates([
        convertedStartDate,
        convertedEndDate
      ]);
    }
  }, [
    isManager,
    selectedDates,
    setEmployeeTimesheetRequestSelectedDates,
    setTimesheetRequestSelectedDates
  ]);

  useEffect(() => {
    return () => {
      resetTimesheetRequestParamsToDefault();
      resetEmployeeTimesheetRequestParams();
    };
  }, [
    resetEmployeeTimesheetRequestParams,
    resetTimesheetRequestParamsToDefault
  ]);

  return (
    <Stack
      sx={classes.stackContainer}
      flexDirection={"row"}
      justifyContent={"space-between"}
    >
      <Stack
        display={"flex"}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"flex-start"}
      >
        <Typography variant="body2" sx={classes.fontStyles}>
          {translateText(["dateRangeLabel"])}
        </Typography>
        <DateRangePicker
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          minDate={firstDateOfYear.toJSDate()}
          hasBorder={true}
        />
      </Stack>
      <Box>
        <Stack direction="row" alignItems="center" gap={0.5}>
          {selectedFilterLabels?.length > 0 && (
            <Typography>{translateText(["filtrLabel"])}</Typography>
          )}
          <ShowSelectedFilters
            filterOptions={selectedFilterLabels}
            onDeleteIcon={
              isManager
                ? (removeManagerFilters as (label?: string) => void)
                : (removeEmployeeFilters as (label?: string) => void)
            }
          />
          <IconButton
            icon={<Icon name={IconName.FILTER_ICON} />}
            onClick={handleFilterClick}
            buttonStyles={classes.iconButtonStyles}
            ariaLabel={translateAria(["filterButton"])}
          />
        </Stack>
        <TimesheetFilterModal
          anchorEl={filterEl}
          handleClose={handleFilterClose}
          position="bottom-end"
          id={filterId}
          open={filterOpen}
          onApply={isManager ? handleApplyManager : handleApplyEmployee}
          onReset={isManager ? handleResetManager : handleResetEmployee}
          isManager={isManager}
        />
      </Box>
    </Stack>
  );
};

export default TimesheetRequestsFilters;
