import { Box, Theme, Typography, useTheme } from "@mui/material";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import Icon from "~community/common/components/atoms/Icon/Icon";
import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import Dropdown from "~community/common/components/molecules/Dropdown/Dropdown";
import FilterButton from "~community/common/components/molecules/FilterButton/FilterButton";
import Table from "~community/common/components/molecules/Table/Table";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { getRecentYearsInStrings } from "~community/common/utils/dateTimeUtils";
import {
  useGetEmployeeCustomAllocationReport,
  useGetEmployeeLeaveReportCSV
} from "~community/leave/api/LeaveReportApi";
import { useGetLeaveTypes } from "~community/leave/api/LeaveTypesApi";
import { SheetType } from "~community/leave/enums/LeaveReportEnums";
import { useLeaveStore } from "~community/leave/store/store";
import { downloadDataAsCSV } from "~community/leave/utils/leaveReport/exportReportUtils";

import {
  tableContainerStyles,
  tableHeaderCellStyles,
  tableHeaderRowStyles,
  tableRowStyles
} from "../CustomLeaveAllocationsTable/styles";

const CustomAllocationsReportTable: FC = () => {
  const translateText = useTranslator("leaveModule", "leaveReports");
  const theme: Theme = useTheme();

  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState<string[]>([]);

  const {
    reportsParams,
    setReportsParams,
    setReportsFilter,
    setReportsFilterOrder,
    setReportsFilterOrderIds,
    setReportsPagination,
    resetReportsParams,
    resetReportsFilter,
    resetReportsFilterOrder,
    resetReportsFilterOrderIds
  } = useLeaveStore();

  const { data: customAllocations, isLoading } =
    useGetEmployeeCustomAllocationReport(
      reportsParams.year,
      reportsParams.teamId,
      reportsParams.page,
      reportsParams.size,
      reportsParams.sortKey,
      reportsParams.sortOrder,
      reportsParams.leaveTypeId
    );

  const headerLabels: string[] = [
    "Member",
    "Team",
    "Leave Type",
    "Days",
    "Start Date",
    "End Date"
  ];

  const reportData = useGetEmployeeLeaveReportCSV(
    reportsParams.year,
    reportsParams.leaveTypeId,
    reportsParams.teamId,
    headerLabels,
    []
  );

  const { data: leaveTypes } = useGetLeaveTypes();

  const years = getRecentYearsInStrings();

  const leaveTypeButtons = useMemo(() => {
    return Array.isArray(leaveTypes)
      ? leaveTypes
          .filter((leaveType) => leaveType?.isActive)
          .map((leaveType) => ({
            id: leaveType?.typeId?.toString(),
            text: leaveType?.name
          }))
      : [];
  }, [leaveTypes]);

  const handleLeaveTypeFilter = (leaveType: { id: string; text: string }) => {
    const updatedTypes = selectedLeaveTypes.includes(leaveType.text)
      ? selectedLeaveTypes.filter((type) => type !== leaveType.text)
      : [...selectedLeaveTypes, leaveType.text];

    setSelectedLeaveTypes(updatedTypes);

    const updatedTypeIds = leaveTypeButtons
      .filter((button) => updatedTypes.includes(button.text))
      .map((button) => button.id);

    setReportsFilter("leaveType", updatedTypeIds);
    setReportsFilterOrder(updatedTypes);
    setReportsFilterOrderIds(updatedTypeIds);
  };

  const handleRemoveFilter = (leaveType: { id: string; text: string }) => {
    const updatedTypes = selectedLeaveTypes.includes(leaveType.text)
      ? selectedLeaveTypes.filter((type) => type !== leaveType.text)
      : [...selectedLeaveTypes, leaveType.text];

    setSelectedLeaveTypes(updatedTypes);

    const updatedTypeIds = leaveTypeButtons
      .filter((button) => updatedTypes.includes(button.text))
      .map((button) => button.id);

    setReportsFilter("leaveType", updatedTypeIds);
    setReportsFilterOrder(updatedTypes);
    setReportsFilterOrderIds(updatedTypeIds);
    setReportsParams("leaveTypeId", updatedTypeIds);
  };

  const handleApplyFilters = () => {
    if (selectedLeaveTypes.length === 1) {
      const selectedTypeId = leaveTypeButtons.find(
        (button) => button.text === selectedLeaveTypes[0]
      )?.id;
      setReportsParams("leaveTypeId", selectedTypeId || selectedLeaveTypes[0]);
    } else {
      const selectedTypeIds = selectedLeaveTypes
        .map(
          (type) => leaveTypeButtons.find((button) => button.text === type)?.id
        )
        .filter(Boolean);
      setReportsParams("leaveTypeId", selectedTypeIds);
    }

    setReportsParams("page", 0);
  };

  const handleResetFilters = (): void => {
    setSelectedLeaveTypes([]);
    resetReportsParams();
    resetReportsFilter();
    resetReportsFilterOrder();
    resetReportsFilterOrderIds();
  };

  useEffect(() => {
    return () => {
      resetReportsParams();
      resetReportsFilter();
      resetReportsFilterOrder();
      resetReportsFilterOrderIds();
    };
  }, [
    resetReportsFilter,
    resetReportsFilterOrder,
    resetReportsFilterOrderIds,
    resetReportsParams
  ]);

  const columns = useMemo(
    () => [
      { field: "member", headerName: translateText(["memberColumn"]) },
      { field: "team", headerName: translateText(["teamColumn"]) },
      { field: "leaveType", headerName: translateText(["leaveTypeColumn"]) },
      { field: "days", headerName: translateText(["daysColumn"]) },
      { field: "startDate", headerName: translateText(["fromColumn"]) },
      { field: "endDate", headerName: translateText(["toColumn"]) }
    ],
    [translateText]
  );

  const tableHeaders = useMemo(
    () => columns.map((col) => ({ id: col.field, label: col.headerName })),
    [columns]
  );

  const handleYearClick = (event: React.MouseEvent<HTMLElement>): void => {
    setReportsParams("year", event.currentTarget.innerText);
  };

  const yearFilter = (
    <Dropdown
      onItemClick={handleYearClick}
      selectedItem={reportsParams.year}
      title={reportsParams.year}
      items={years}
    />
  );
  const transformToTableRows = useCallback(() => {
    return (
      customAllocations?.data?.results[0]?.items?.map(
        (leaveAllocation: any) => {
          return {
            id: leaveAllocation?.employeeName,
            member: (
              <Box width="100%">
                <AvatarChip
                  firstName={leaveAllocation?.firstName}
                  lastName={leaveAllocation?.lastName}
                  avatarUrl={leaveAllocation?.authPic}
                  chipStyles={{ maxWidth: "fit-content" }}
                />
              </Box>
            ),
            team: (
              <Typography variant="body1">
                {leaveAllocation?.teams || "-"}
              </Typography>
            ),
            leaveType: (
              <IconChip
                icon={leaveAllocation.leaveTypeEmoji}
                label={leaveAllocation.leaveType}
              />
            ),
            days: (
              <Typography variant="body1">{leaveAllocation.days}</Typography>
            ),
            startDate: (
              <Typography variant="body1">
                {leaveAllocation.startDate || "-"}
              </Typography>
            ),
            endDate: (
              <Typography variant="body1">
                {leaveAllocation.endDate || "-"}
              </Typography>
            )
          };
        }
      ) || []
    );
  }, [customAllocations?.data.results]);

  const filterButton = (
    <FilterButton
      handleApplyBtnClick={handleApplyFilters}
      handleResetBtnClick={handleResetFilters}
      selectedFilters={selectedLeaveTypes.map((type) => ({
        filter: [type],
        handleFilterDelete: () => {
          handleRemoveFilter({
            id: leaveTypeButtons.find((btn) => btn.text === type)?.id || "",
            text: type
          });
        }
      }))}
      position={"bottom-end"}
      id={"filter-types"}
      isResetBtnDisabled={selectedLeaveTypes.length === 0}
    >
      <Typography variant="h5">
        {translateText(["filterPopperLeaveTypeTitle"])}
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {leaveTypeButtons.map((leaveType) => (
          <Button
            key={leaveType.id}
            isFullWidth={false}
            label={leaveType.text}
            buttonStyle={
              selectedLeaveTypes.includes(leaveType.text)
                ? ButtonStyle.SECONDARY
                : ButtonStyle.TERTIARY
            }
            onClick={() => handleLeaveTypeFilter(leaveType)}
            startIcon={
              selectedLeaveTypes.includes(leaveType.text) ? (
                <Icon name={IconName.CHECK_CIRCLE_ICON} />
              ) : undefined
            }
            styles={{
              p: "0.5rem 0.75rem",
              textTransform: "capitalize",
              height: "2rem",
              ml: "0.4rem",
              mb: "0.8rem"
            }}
          />
        ))}
      </Box>
    </FilterButton>
  );

  const downloadCSV = (reportType: SheetType) => {
    if (reportData) {
      downloadDataAsCSV(reportData, headerLabels, reportType);
    }
  };

  return (
    <Box>
      <Table
        tableHeaders={tableHeaders}
        tableRows={transformToTableRows()}
        tableHeaderRowStyles={tableHeaderRowStyles(theme)}
        tableHeaderCellStyles={tableHeaderCellStyles(theme)}
        tableContainerStyles={tableContainerStyles(theme)}
        tableRowStyles={tableRowStyles(theme)}
        currentPage={reportsParams.page}
        onPaginationChange={(_, value) => setReportsPagination(value - 1)}
        totalPages={customAllocations?.data?.results[0]?.totalPages || 1}
        isLoading={isLoading}
        skeletonRows={5}
        emptySearchTitle={translateText(["emptyScreenTitle"])}
        emptySearchDescription={translateText(["emptyScreenDescription"])}
        isDataAvailable={true}
        actionRowOneLeftButton={yearFilter}
        actionRowOneRightButton={filterButton}
        exportButtonText={translateText(["exportBtnTxt"])}
        onExportButtonClick={() => downloadCSV(SheetType.CustomAllocation)}
      />
    </Box>
  );
};

export default CustomAllocationsReportTable;
