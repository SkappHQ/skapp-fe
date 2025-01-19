import { Box, Divider, Stack, Typography } from "@mui/material";
import {
  ChangeEvent,
  FC,
  MouseEvent,
  useEffect,
  useMemo,
  useState
} from "react";

import Button from "~community/common/components/atoms/Button/Button";
import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import Dropdown from "~community/common/components/molecules/Dropdown/Dropdown";
import FilterButton from "~community/common/components/molecules/FilterButton/FilterButton";
import Table from "~community/common/components/molecules/Table/Table";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { SortKeyTypes, StyleProps } from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import { pascalCaseFormatter } from "~community/common/utils/commonUtil";
import {
  useGetEmployeeLeaveRequestData,
  useGetEmployeeLeaveRequests,
  useGetLeaveAllocation
} from "~community/leave/api/MyRequestApi";
import { useLeaveStore } from "~community/leave/store/store";
import { LeaveRequestDataType } from "~community/leave/types/EmployeeLeaveRequestTypes";
import { LeaveStatusTypes } from "~community/leave/types/LeaveTypes";
import { leaveStatusIconSelector } from "~community/leave/utils/leaveRequest/LeaveRequestUtils";

import LeaveRequestDates from "../LeaveRequestDates/LeaveRequestDates";
import styles from "./styles";

const LeaveRequests: FC = () => {
  const currentPage = useLeaveStore((state) => state.leaveRequestParams.page);
  const leaveRequestSort = useLeaveStore(
    (state) => state.leaveRequestParams.sortKey
  );
  const classes = styles();
  const {
    resetLeaveRequestParams,
    leaveRequestsFilter,
    setLeaveRequestParams,
    setPagination,
    selectedYear,
    handleLeaveRequestsSort,
    setIsEmployeeModal,
    setEmployeeLeaveRequestData,
    newLeaveId,
    setNewLeaveId
  } = useLeaveStore((state) => state);

  const [filter, setFilter] = useState<{ status: string[]; type: string[] }>({
    status: leaveRequestsFilter.status || [],
    type: leaveRequestsFilter.type || []
  });

  const { data: leaveRequests, isLoading } = useGetEmployeeLeaveRequests();
  const { data: leaveTypesData } = useGetLeaveAllocation(selectedYear);

  const {
    refetch,
    isSuccess,
    data: leaveData
  } = useGetEmployeeLeaveRequestData(newLeaveId as number);

  const translateText = useTranslator("leaveModule", "myRequests");

  useEffect(() => {
    if (isSuccess && leaveData) {
      setEmployeeLeaveRequestData(leaveData);
    }
  }, [isSuccess, leaveData]);

  const columns = [
    {
      field: "duration",
      headerName: translateText([
        "myLeaveRequests",
        "duration"
      ]).toLocaleUpperCase()
    },
    {
      field: "type",
      headerName: translateText(["myLeaveRequests", "type"]).toLocaleUpperCase()
    },
    {
      field: "status",
      headerName: translateText([
        "myLeaveRequests",
        "status"
      ]).toLocaleUpperCase()
    }
  ];

  const tableHeaders = columns.map((col) => ({
    id: col.field,
    label: col.headerName
  }));

  const tableHeaderTypographyStyles = {
    pl: "1.5rem"
  };

  const transformToTableRows = () => {
    return leaveRequests?.items?.map((employeeLeaveRequest: any) => ({
      id: employeeLeaveRequest.leaveRequestId,
      duration: (
        <LeaveRequestDates
          days={employeeLeaveRequest.durationDays}
          startDate={employeeLeaveRequest.startDate}
          endDate={employeeLeaveRequest.endDate}
        />
      ),
      type: (
        <Box width="100%">
          <IconChip
            label={employeeLeaveRequest.leaveType.name}
            icon={employeeLeaveRequest.leaveType.emojiCode}
            isTruncated={false}
            chipStyles={{
              maxWidth: "100%",
              "&:hover": {
                backgroundColor: "inherit",
                cursor: "default"
              }
            }}
          />
        </Box>
      ),
      status: (
        <IconChip
          label={employeeLeaveRequest.status.toLowerCase()}
          icon={leaveStatusIconSelector(employeeLeaveRequest.status)}
          chipStyles={{
            "&:hover": {
              backgroundColor: "inherit",
              cursor: "default"
            }
          }}
        />
      )
    }));
  };

  const leaveTypeOptions = useMemo(
    () =>
      leaveTypesData?.map(
        (result: { leaveType: { typeId: string; name: string } }) => ({
          id: result.leaveType.typeId,
          name: result.leaveType.name
        })
      ) || [],
    [leaveTypesData]
  );

  const getLeaveTypeNameById = (id: string) => {
    const leaveType = leaveTypeOptions.find(
      (type: { id: string; name: string }) => type.id === id
    );
    return leaveType ? leaveType.name : null;
  };

  const handleApplyFilters = () => {
    setLeaveRequestParams("status", filter.status);
    setLeaveRequestParams("leaveType", filter.type);
  };

  const handleResetFilters = () => {
    setFilter({
      status: [],
      type: []
    });
    resetLeaveRequestParams();
  };

  const leaveStatusArray = [
    LeaveStatusTypes.PENDING,
    LeaveStatusTypes.APPROVED,
    LeaveStatusTypes.DENIED,
    LeaveStatusTypes.REVOKED,
    LeaveStatusTypes.CANCELLED
  ];

  const filterButton = (
    <FilterButton
      handleApplyBtnClick={handleApplyFilters}
      handleResetBtnClick={handleResetFilters}
      selectedFilters={[
        {
          filter: filter.type.map((typeId) => getLeaveTypeNameById(typeId)),
          handleFilterDelete: (option) => {
            const updatedTypeFilter = filter.type.filter(
              (item) => getLeaveTypeNameById(item) !== option
            );
            setFilter((prev) => ({
              ...prev,
              type: updatedTypeFilter
            }));
            setLeaveRequestParams("leaveType", updatedTypeFilter);
          }
        },
        {
          filter: filter.status,
          handleFilterDelete: (option) => {
            const updatedStatusFilter = filter.status.filter(
              (item) => item !== option
            );
            setFilter((prev) => ({
              ...prev,
              status: updatedStatusFilter
            }));
            setLeaveRequestParams("status", updatedStatusFilter);
          }
        }
      ]}
      position={"bottom-end"}
      id={"filter-types"}
      isResetBtnDisabled={!filter.type.length && !filter.status.length}
    >
      <Typography variant="h5">
        {translateText(["myLeaveRequests", "filterButtonStatus"])}
      </Typography>
      <Stack sx={classes.filterStackStyles}>
        {leaveStatusArray.map((leaveStatus) => (
          <Button
            key={leaveStatus}
            label={pascalCaseFormatter(leaveStatus)}
            isFullWidth={false}
            onClick={() => {
              setFilter((prev) => ({
                ...prev,
                status: prev.status.includes(leaveStatus)
                  ? prev.status.filter((item) => item !== leaveStatus)
                  : [...prev.status, leaveStatus]
              }));
            }}
            buttonStyle={
              filter.status.includes(leaveStatus)
                ? ButtonStyle.SECONDARY
                : ButtonStyle.TERTIARY
            }
            size={ButtonSizes.MEDIUM}
            startIcon={
              filter.status.includes(leaveStatus)
                ? IconName.CHECK_CIRCLE_ICON
                : null
            }
            styles={classes.filterChipButtonStyles}
          />
        ))}
      </Stack>
      <Typography variant="h5">
        {translateText(["myLeaveRequests", "filterButtonType"])}
      </Typography>
      <Stack sx={classes.filterStackStyles}>
        {leaveTypeOptions.map(({ id, name }: { id: string; name: string }) => (
          <Button
            key={id}
            label={name}
            isFullWidth={false}
            onClick={() => {
              setFilter((prev) => ({
                ...prev,
                type: prev.type.includes(id)
                  ? prev.type.filter((item) => item !== id)
                  : [...prev.type, id]
              }));
            }}
            buttonStyle={
              filter.type.includes(id)
                ? ButtonStyle.SECONDARY
                : ButtonStyle.TERTIARY
            }
            size={ButtonSizes.MEDIUM}
            startIcon={
              filter.type.includes(id) ? IconName.CHECK_CIRCLE_ICON : null
            }
            styles={classes.filterChipButtonStyles}
          />
        ))}
      </Stack>
    </FilterButton>
  );

  const dropdownItems = [
    {
      label: translateText(["myLeaveRequests", "dateRequested"]),
      value: SortKeyTypes.CREATED_DATE
    },
    {
      label: translateText(["myLeaveRequests", "leaveDate"]),
      value: SortKeyTypes.START_DATE
    }
  ];

  const handleItemClick = (
    event: MouseEvent<HTMLElement>,
    item: (typeof dropdownItems)[number]
  ) => {
    handleLeaveRequestsSort("sortKey", item.value);
  };

  const selectedItem = dropdownItems.find(
    (item) => item.value === leaveRequestSort
  );

  const sortButton = (
    <Dropdown
      onItemClick={handleItemClick}
      selectedItem={selectedItem || dropdownItems[0]}
      title={translateText(["myLeaveRequests", "sortBy"], {
        sortBy: selectedItem?.label
      })}
      items={dropdownItems}
      displayKey="label"
      dropdownBtnStyles={{ width: "100%" } as StyleProps}
    />
  );

  const handleRowClick = (leaveRequest: any): void => {
    setIsEmployeeModal(false);
    setEmployeeLeaveRequestData({} as LeaveRequestDataType);
    setNewLeaveId(leaveRequest.id);
  };

  useEffect(() => {
    if (newLeaveId) {
      refetch()
        .then(() => {
          setIsEmployeeModal(true);
        })
        .catch(console.error);
    }
  }, [newLeaveId]);

  return (
    <Box tabIndex={0}>
      <Typography
        variant="h1"
        sx={{
          marginBottom: "1.5rem",
          marginTop: "1.5rem"
        }}
      >
        {translateText(["myLeaveRequests", "requestTitle"])}
      </Typography>
      <Divider sx={{ mb: "1rem" }} />
      <Table
        tableHeaders={tableHeaders}
        tableRows={transformToTableRows()}
        actionRowOneLeftButton={sortButton}
        actionRowOneRightButton={filterButton}
        isPaginationEnabled={true}
        totalPages={leaveRequests?.totalPages}
        currentPage={currentPage as number}
        onPaginationChange={(_event: ChangeEvent<unknown>, value: number) =>
          setPagination(value - 1)
        }
        onRowClick={handleRowClick}
        tableHeaderTypographyStyles={tableHeaderTypographyStyles}
        emptyDataTitle={translateText([
          "myLeaveRequests",
          "emptyLeaveRequestTitle"
        ])}
        emptyDataDescription={translateText([
          "myLeaveRequests",
          "emptyLeaveRequestDes"
        ])}
        isLoading={isLoading}
        skeletonRows={5}
      />
    </Box>
  );
};

export default LeaveRequests;
