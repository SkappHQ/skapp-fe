import { Box, Stack, Theme, Typography, useTheme } from "@mui/material";
import { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";

import DropDownArrow from "~community/common/assets/Icons/DropdownArrow";
import FilterIcon from "~community/common/assets/Icons/FilterIcon";
import Button from "~community/common/components/atoms/Button/Button";
import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import IconButton from "~community/common/components/atoms/IconButton/IconButton";
import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import DateRangePicker from "~community/common/components/molecules/DateRangePicker/DateRangePicker";
import Table from "~community/common/components/molecules/Table/Table";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { FilterButtonTypes } from "~community/common/types/CommonTypes";
import { MenuTypes } from "~community/common/types/MoleculeTypes";
import {
  convertDateToFormat,
  getAsDaysString,
  getDateForPeriod
} from "~community/common/utils/dateTimeUtils";
import {
  useGetLeaveRequestData,
  useGetLeaveTypes
} from "~community/leave/api/LeaveApi";
import { useLeaveStore } from "~community/leave/store/store";
import {
  LeaveRequestItemsType,
  leaveRequestRowDataTypes
} from "~community/leave/types/LeaveRequestTypes";
import {
  removeFiltersByLabel,
  requestTypeSelector,
  requestedLeaveTypesPreProcessor
} from "~community/leave/utils/LeaveRequestFilterActions";
import ShowSelectedFilters from "~community/people/components/molecules/ShowSelectedFilters/ShowSelectedFilters";

import LeaveRequestMenu from "../LeaveRequestMenu/LeaveRequestMenu";
import RequestDates from "../LeaveRequestRow/RequestDates";

interface Props {
  employeeLeaveRequests: LeaveRequestItemsType[];
  totalPages?: number;
  isLoading?: true | false;
}

const ManagerLeaveRequest: FC<Props> = ({
  totalPages,
  employeeLeaveRequests,
  isLoading
}) => {
  const theme: Theme = useTheme();
  const translateText = useTranslator(
    "leaveModule",
    "leaveRequests",
    "leaveRequestTable"
  );

  const {
    resetLeaveRequestParams,
    leaveRequestsFilter,
    leaveRequestFilterOrder,
    setLeaveRequestFilterOrder,
    setLeaveRequestsFilter,
    setLeaveRequestParams,
    setPagination,
    setIsManagerModal,
    setLeaveRequestData,
    setNewLeaveId,
    newLeaveId
  } = useLeaveStore((state) => state);

  const currentPage: number = useLeaveStore(
    (state) => state.leaveRequestParams.page
  ) as number;

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [sortEl, setSortEl] = useState<null | HTMLElement>(null);
  const [filterEl, setFilterEl] = useState<null | HTMLElement>(null);
  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filterArray, setFilterArray] = useState<string[]>([]);
  const [leaveTypeButtons, setLeaveTypeButtons] = useState<FilterButtonTypes[]>(
    []
  );

  const filterBeOpen: boolean = filterOpen && Boolean(filterEl);
  const filterId = filterBeOpen ? "filter-popper" : undefined;
  const sortByOpen = sortOpen && Boolean(sortEl);
  const sortId = sortByOpen ? "sortBy-popper" : undefined;

  const { data: leaveTypes, isLoading: leaveTypesLoading } = useGetLeaveTypes();
  const {
    refetch,
    isSuccess: getleaveByIdSuccess,
    data: getLeaveByIdData
  } = useGetLeaveRequestData(newLeaveId as number);
  const columns = [
    {
      field: "name",
      headerName: translateText(["name"]).toLocaleUpperCase()
    },
    {
      field: "duration",
      headerName: translateText(["duration"]).toLocaleUpperCase()
    },
    { field: "type", headerName: translateText(["type"]).toLocaleUpperCase() },
    {
      field: "status",
      headerName: translateText(["status"]).toLocaleUpperCase()
    }
  ];

  const tableHeaders = columns.map((col) => ({
    id: col.field,
    label: col.headerName
  }));

  const handleSortClick = (event: MouseEvent<HTMLElement>): void => {
    setSortEl(event.currentTarget);
    setSortOpen((previousOpen) => !previousOpen);
  };

  const handleSortClose = (): void => {
    setSortEl(null);
    setSortOpen(false);
  };

  const handleFilterClick = (event: MouseEvent<HTMLElement>): void => {
    setFilterEl(event.currentTarget);
    setFilterOpen((previousOpen) => !previousOpen);
  };

  const handleFilterClose = (): void => {
    setFilterEl(null);
    setFilterOpen(false);
  };

  const onClickReset = () => {
    resetLeaveRequestParams();
    setFilterArray([]);
    setSelectedDates([]);
  };

  const handelRowClick = async (leaveRequest: { id: number }) => {
    setIsManagerModal(false);
    setLeaveRequestData({} as leaveRequestRowDataTypes);
    setNewLeaveId(leaveRequest.id);
  };

  const removeFilters = (label?: string) => {
    removeFiltersByLabel(
      leaveRequestsFilter,
      setLeaveRequestFilterOrder,
      setLeaveRequestsFilter,
      setLeaveRequestParams,
      leaveTypeButtons,
      filterArray,
      setFilterArray,
      label
    );
  };

  const renderSortBy = () => {
    return (
      <Box>
        <Button
          label="Sort By"
          buttonStyle={ButtonStyle.TERTIARY}
          styles={{
            border: "0.0625rem solid",
            borderColor: "grey.500",
            py: "0.5rem",
            px: "1rem"
          }}
          endIcon={<DropDownArrow />}
          onClick={handleSortClick}
          disabled={employeeLeaveRequests?.length === 0}
          ariaLabel="Sort by: Pressing enter on this button opens a menu where you can choose to sort by date requested or urgency."
          aria-describedby={sortId}
        />
        <LeaveRequestMenu
          anchorEl={sortEl}
          handleClose={handleSortClose}
          position="bottom-start"
          menuType={MenuTypes.SORT}
          id={sortId}
          open={sortOpen}
        />
      </Box>
    );
  };

  const renderDateRange = () => {
    return (
      <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{
            px: "1.25rem"
          }}
        >
          Date:
        </Typography>
        <DateRangePicker
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
        />
      </Stack>
    );
  };

  const renderFilterBy = () => {
    return (
      <Box>
        <Stack direction="row" alignItems="center" gap={0.5}>
          {filterArray.length > 0 && <Typography>Filter :</Typography>}
          <ShowSelectedFilters
            filterOptions={leaveRequestFilterOrder}
            onDeleteIcon={removeFilters}
          />
          <IconButton
            icon={<FilterIcon />}
            onClick={handleFilterClick}
            buttonStyles={{
              border: "0.0625rem solid",
              borderColor: "grey.500",
              bgcolor: theme.palette.grey[100],
              p: "0.625rem 1.25rem",
              transition: "0.2s ease",
              "&:hover": {
                boxShadow: `inset 0 0 0 0.125rem ${theme.palette.grey[500]}`
              }
            }}
            aria-describedby={filterId}
            dataProps={{
              "aria-label":
                "Filter: Pressing enter on this button opens a menu where you can choose to filter by leave status, leave type and date."
            }}
          />
        </Stack>
        <LeaveRequestMenu
          anchorEl={filterEl}
          handleClose={handleFilterClose}
          position="bottom-end"
          menuType={MenuTypes.FILTER}
          id={filterId}
          open={filterOpen}
          leaveTypeButtons={leaveTypeButtons}
          onReset={onClickReset}
        />
      </Box>
    );
  };

  const transformToTableRows = () => {
    return employeeLeaveRequests?.map((employeeLeaveRequest) => ({
      id: employeeLeaveRequest.leaveRequestId,
      name: (
        <AvatarChip
          firstName={employeeLeaveRequest?.employee?.firstName ?? ""}
          lastName={employeeLeaveRequest?.employee?.lastName ?? ""}
          avatarUrl={employeeLeaveRequest?.employee.authPic ?? ""}
          isResponsiveLayout
          chipStyles={{
            maxWidth: "15.625rem"
          }}
        />
      ),
      duration: (
        <RequestDates
          days={getAsDaysString(employeeLeaveRequest?.durationDays ?? "")}
          dates={employeeLeaveRequest?.leaveRequestDates}
        />
      ),
      type: (
        <IconChip
          label={employeeLeaveRequest?.leaveType?.name}
          icon={employeeLeaveRequest?.leaveType?.emojiCode}
          isResponsive={true}
          chipStyles={{
            alignSelf: "center",
            [`@media (max-width: 81.25rem)`]: {
              marginLeft: "2rem"
            }
          }}
          isTruncated={!theme.breakpoints.up("xl")}
        />
      ),
      status: (
        <IconChip
          label={employeeLeaveRequest?.status.toLowerCase()}
          icon={requestTypeSelector(employeeLeaveRequest?.status)}
          isResponsive={true}
          chipStyles={{
            alignSelf: "flex-end",
            [`@media (max-width: 81.25rem)`]: {
              marginRight: "2.25rem",
              padding: "1rem"
            }
          }}
          isTruncated={!theme.breakpoints.up("xl")}
        />
      )
    }));
  };

  useEffect(() => {
    if (leaveTypes && !leaveTypesLoading) {
      setLeaveTypeButtons(requestedLeaveTypesPreProcessor(leaveTypes));
    }
  }, [leaveTypes, leaveTypesLoading]);

  useEffect(() => {
    setFilterArray(leaveRequestFilterOrder);
    setLeaveRequestParams("size", "6");
    const startDate = getDateForPeriod("year", "start");
    const endDate = getDateForPeriod("year", "end");

    const selectedStartDate = selectedDates[0]
      ? convertDateToFormat(selectedDates[0], "yyyy-MM-dd")
      : startDate;
    const selectedEndDate = selectedDates[1]
      ? convertDateToFormat(selectedDates[1], "yyyy-MM-dd")
      : endDate;

    setLeaveRequestParams("startDate", selectedStartDate);
    setLeaveRequestParams("endDate", selectedEndDate);
  }, [leaveRequestFilterOrder, selectedDates, setLeaveRequestParams]);

  useEffect(() => {
    if (employeeLeaveRequests?.length === 0 && totalPages === 0) {
      if (currentPage !== 0) {
        setLeaveRequestParams("page", (currentPage - 1).toString());
        setPagination(currentPage - 1);
      }
    }
  }, [
    currentPage,
    employeeLeaveRequests?.length,
    setLeaveRequestParams,
    setPagination,
    totalPages
  ]);

  useEffect(() => {
    if (getleaveByIdSuccess && getLeaveByIdData) {
      setLeaveRequestData(getLeaveByIdData);
    }
  }, [getLeaveByIdData, getleaveByIdSuccess]);

  useEffect(() => {
    if (newLeaveId) {
      refetch()
        .then(() => setIsManagerModal(true))
        .catch(console.error);
    }
  }, [newLeaveId]);

  return (
    <Table
      tableHeaders={tableHeaders}
      tableRows={transformToTableRows()}
      actionRowOneLeftButton={
        <Stack flexDirection={"row"}>
          {renderSortBy()}
          {renderDateRange()}
        </Stack>
      }
      actionRowOneRightButton={renderFilterBy()}
      emptyDataDescription={translateText(["noLeaveRequestsManagerDetails"])}
      emptyDataTitle={translateText(["noLeaveRequests"])}
      skeletonRows={5}
      isLoading={isLoading}
      totalPages={totalPages}
      currentPage={currentPage}
      onPaginationChange={(_event: ChangeEvent<unknown>, value: number) =>
        setPagination(value - 1)
      }
      onRowClick={handelRowClick}
    />
  );
};

export default ManagerLeaveRequest;
