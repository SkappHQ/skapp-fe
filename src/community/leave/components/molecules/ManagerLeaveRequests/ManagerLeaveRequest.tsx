import { Stack, Theme, useTheme } from "@mui/material";
import { ChangeEvent, FC, useEffect, useState } from "react";

import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import DateRangePicker from "~community/common/components/molecules/DateRangePicker/DateRangePicker";
import Table from "~community/common/components/molecules/Table/Table";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { FilterButtonTypes } from "~community/common/types/CommonTypes";
import {
  convertDateToFormat,
  getAsDaysString,
  getDateForPeriod
} from "~community/common/utils/dateTimeUtils";
import {
  useGetLeaveRequestData,
  useGetLeaveTypes
} from "~community/leave/api/LeaveApi";
import RequestDates from "~community/leave/components/molecules/LeaveRequestRow/RequestDates";
import ManagerLeaveRequestFilterByBtn from "~community/leave/components/molecules/ManagerLeaveRequestFilterByBtn/MangerLeaveRequestFilterByBtn";
import ManagerLeaveRequestsSortByBtn from "~community/leave/components/molecules/ManagerLeaveRequestsSortByBtn/ManagerLeaveRequestsSortByBtn";
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

  const commonTranslateText = useTranslator(
    "commonComponents",
    "dateRangePicker"
  );

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
  } = useLeaveStore((state) => ({
    resetLeaveRequestParams: state.resetLeaveRequestParams,
    leaveRequestsFilter: state.leaveRequestsFilter,
    leaveRequestFilterOrder: state.leaveRequestFilterOrder,
    setLeaveRequestFilterOrder: state.setLeaveRequestFilterOrder,
    setLeaveRequestsFilter: state.setLeaveRequestsFilter,
    setLeaveRequestParams: state.setLeaveRequestParams,
    setPagination: state.setPagination,
    setIsManagerModal: state.setIsManagerModal,
    setLeaveRequestData: state.setLeaveRequestData,
    setNewLeaveId: state.setNewLeaveId,
    newLeaveId: state.newLeaveId
  }));

  const currentPage: number = useLeaveStore(
    (state) => state.leaveRequestParams.page
  ) as number;

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [filterArray, setFilterArray] = useState<string[]>([]);
  const [leaveTypeButtons, setLeaveTypeButtons] = useState<FilterButtonTypes[]>(
    []
  );

  const { data: leaveTypes, isLoading: leaveTypesLoading } = useGetLeaveTypes();

  const {
    refetch,
    isSuccess: getLeaveByIdSuccess,
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
    if (getLeaveByIdSuccess && getLeaveByIdData) {
      setLeaveRequestData(getLeaveByIdData);
    }
  }, [getLeaveByIdData, getLeaveByIdSuccess]);

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
        <Stack flexDirection={"row"} gap="1.25rem">
          <ManagerLeaveRequestsSortByBtn
            isDisabled={employeeLeaveRequests?.length === 0}
          />
          <DateRangePicker
            label={commonTranslateText(["label"])}
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
          />
        </Stack>
      }
      actionRowOneRightButton={
        <ManagerLeaveRequestFilterByBtn
          leaveTypeButtons={leaveTypeButtons}
          onClickReset={onClickReset}
          removeFilters={removeFilters}
        />
      }
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
