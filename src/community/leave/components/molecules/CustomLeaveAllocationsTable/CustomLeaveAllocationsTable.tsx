import { Box, Chip, Theme, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";
import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import Icon from "~community/common/components/atoms/Icon/Icon";
import IconButton from "~community/common/components/atoms/IconButton/IconButton";
import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import Dropdown from "~community/common/components/molecules/Dropdown/Dropdown";
import FilterButton from "~community/common/components/molecules/FilterButton/FilterButton";
import Table from "~community/common/components/molecules/Table/Table";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { getAdjacentYearsWithCurrent } from "~community/common/utils/dateTimeUtils";
import { useGetCustomLeaves } from "~community/leave/api/LeaveApi";
import { useGetLeaveTypes } from "~community/leave/api/LeaveTypesApi";
import { useLeaveStore } from "~community/leave/store/store";
import {
  CustomLeaveAllocationModalTypes,
  CustomLeaveAllocationType,
  LeaveAllocation
} from "~community/leave/types/CustomLeaveAllocationTypes";

import {
  iconButtonStyles,
  tableContainerStyles,
  tableHeaderCellStyles,
  tableHeaderRowStyles,
  tableRowStyles,
  typographyStyles
} from "./styles";

interface Props {
  searchTerm?: string;
  setHasFilteredData: (hasData: boolean) => void;
  setHasEmptyFilterResults: (isEmpty: boolean) => void;
}

const CustomLeaveAllocationsTable: React.FC<Props> = ({
  searchTerm,
  setHasFilteredData,
  setHasEmptyFilterResults
}) => {
  const translateText = useTranslator("leaveModule", "customLeave");
  const theme: Theme = useTheme();

  const {
    selectedYear,
    currentPage,
    setCurrentEditingLeaveAllocation,
    setCustomLeaveAllocationModalType,
    setIsLeaveAllocationModalOpen,
    setSelectedYear,
    setCurrentPage,
    setCustomLeaveAllocations
  } = useLeaveStore((state) => state);

  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState<string[]>([]);
  const [tempSelectedLeaveTypes, setTempSelectedLeaveTypes] = useState<
    string[]
  >([]);

  const leaveTypes = selectedLeaveTypes.join(",");
  const { data: customLeaveData, isLoading } = useGetCustomLeaves(
    currentPage,
    5,
    searchTerm,
    Number(selectedYear),
    leaveTypes
  );

  useEffect(() => {
    if (customLeaveData?.items) {
      setCustomLeaveAllocations(customLeaveData.items);
      setHasFilteredData(customLeaveData.items.length > 0);
      setHasEmptyFilterResults(
        customLeaveData.items.length === 0 &&
          (!!searchTerm || selectedLeaveTypes.length > 0)
      );
    } else {
      setHasFilteredData(false);
      setHasEmptyFilterResults(false);
    }
  }, [
    customLeaveData?.items,
    searchTerm,
    selectedLeaveTypes,
    setCustomLeaveAllocations,
    setHasFilteredData,
    setHasEmptyFilterResults
  ]);

  const handleEdit = useCallback(
    (leaveAllocation: LeaveAllocation) => {
      const updatedLeaveAllocation: CustomLeaveAllocationType = {
        entitlementId: leaveAllocation.entitlementId,
        employeeId: leaveAllocation.employee.employeeId,
        numberOfDaysOff: leaveAllocation.totalDaysAllocated,
        typeId: leaveAllocation.leaveType.typeId,
        assignedTo: {
          employeeId: leaveAllocation.employee.employeeId,
          firstName: leaveAllocation.employee.firstName,
          lastName: leaveAllocation.employee.lastName,
          avatarUrl: leaveAllocation.employee.authPic
        },
        validToDate: leaveAllocation.validTo,
        validFromDate: leaveAllocation.validFrom,
        totalDaysUsed: leaveAllocation.totalDaysUsed,
        totalDaysAllocated: leaveAllocation.totalDaysAllocated
      };

      setCurrentEditingLeaveAllocation(updatedLeaveAllocation);
      setCustomLeaveAllocationModalType(
        CustomLeaveAllocationModalTypes.EDIT_LEAVE_ALLOCATION
      );
      setIsLeaveAllocationModalOpen(true);
    },
    [
      setCurrentEditingLeaveAllocation,
      setCustomLeaveAllocationModalType,
      setIsLeaveAllocationModalOpen
    ]
  );

  const columns = useMemo(
    () => [
      { field: "employee", headerName: translateText(["tableHeaderOne"]) },
      { field: "duration", headerName: translateText(["tableHeaderTwo"]) },
      { field: "type", headerName: translateText(["tableHeaderThree"]) },
      { field: "actions", headerName: translateText(["tableHeaderFour"]) }
    ],
    [translateText]
  );

  const tableHeaders = useMemo(
    () => columns.map((col) => ({ id: col.field, label: col.headerName })),
    [columns]
  );

  const yearFilter = (
    <Dropdown
      onItemClick={(event) => {
        setSelectedYear(event?.currentTarget?.innerText);
      }}
      selectedItem={selectedYear}
      title={selectedYear}
      items={getAdjacentYearsWithCurrent()}
    />
  );

  const transformToTableRows = useCallback(() => {
    return (
      customLeaveData?.items?.map((leaveAllocation) => {
        return {
          id: leaveAllocation.entitlementId,
          employee: (
            <Box width="100%">
              <AvatarChip
                firstName={leaveAllocation.employee?.firstName}
                lastName={leaveAllocation.employee?.lastName}
                avatarUrl={leaveAllocation.employee?.authPic}
                chipStyles={{
                  display: "flex",
                  justifyContent: "start",
                  maxWidth: "fit-content"
                }}
              />
            </Box>
          ),
          duration: (
            <BasicChip
              label={
                leaveAllocation.totalDaysAllocated === 0.5
                  ? translateText(["halfDayChip"])
                  : `${leaveAllocation.totalDaysAllocated} ${
                      leaveAllocation.totalDaysAllocated === 1
                        ? translateText(["day"])
                        : translateText(["days"])
                    }`
              }
            />
          ),
          type: (
            <IconChip
              icon={
                leaveAllocation.leaveType?.emojiCode ||
                leaveAllocation.leaveType?.name
              }
              label={leaveAllocation.leaveType?.name}
              isTruncated={false}
            />
          ),
          actions: (
            <IconButton
              icon={<Icon name={IconName.EDIT_ICON} />}
              id={`${leaveAllocation.entitlementId}-edit-btn`}
              hoverEffect={false}
              buttonStyles={iconButtonStyles(theme)}
              onClick={() => handleEdit(leaveAllocation)}
            />
          )
        };
      }) || []
    );
  }, [customLeaveData?.items, handleEdit, translateText, theme]);

  const handleApplyFilters = () => {
    setSelectedLeaveTypes(tempSelectedLeaveTypes);
    setCurrentPage(0);
  };

  const handleResetFilters = () => {
    setTempSelectedLeaveTypes([]);
    setSelectedLeaveTypes([]);
    setCurrentPage(0);
  };

  const handleLeaveTypeFilter = (leaveType: { id: string; text: string }) => {
    setTempSelectedLeaveTypes((prev) =>
      prev.includes(leaveType.id)
        ? prev.filter((i) => i !== leaveType.id)
        : [...prev, leaveType.id]
    );
  };

  const { data: leaveTypesData } = useGetLeaveTypes();

  const leaveTypeOptions = useMemo(
    () =>
      leaveTypesData?.map((leaveType) => ({
        id: leaveType.typeId,
        name: leaveType.name
      })) || [],
    [leaveTypesData]
  );

  const filterButton = (
    <FilterButton
      handleApplyBtnClick={handleApplyFilters}
      handleResetBtnClick={handleResetFilters}
      selectedFilters={selectedLeaveTypes.map((type) => ({
        filter: [
          leaveTypeOptions.find((btn) => btn.id === Number(type))?.name ?? ""
        ],
        handleFilterDelete: () => {
          setTempSelectedLeaveTypes((prev) => prev.filter((i) => i !== type));
          setSelectedLeaveTypes((prev) => prev.filter((i) => i !== type));
        }
      }))}
      position={"bottom-end"}
      id={"filter-types"}
      isResetBtnDisabled={tempSelectedLeaveTypes.length === 0}
    >
      <Typography variant="h5" sx={typographyStyles(theme)}>
        {translateText(["filterButtonTitle"])}
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {leaveTypeOptions.map((leaveType) => (
          <Chip
            key={leaveType.id}
            label={leaveType.name}
            onClick={() =>
              handleLeaveTypeFilter({
                id: leaveType.id.toString(),
                text: leaveType.name
              })
            }
            sx={{
              backgroundColor: tempSelectedLeaveTypes.includes(
                leaveType.id.toString()
              )
                ? theme.palette.secondary.main
                : theme.palette.grey[100],
              color: tempSelectedLeaveTypes.includes(leaveType.id.toString())
                ? theme.palette.common.black
                : theme.palette.text.primary,
              "&:hover": {
                backgroundColor: tempSelectedLeaveTypes.includes(
                  leaveType.id.toString()
                )
                  ? theme.palette.secondary.dark
                  : theme.palette.grey[200]
              }
            }}
          />
        ))}
      </Box>
    </FilterButton>
  );

  const handleAddLeaveAllocation = () => {
    setCustomLeaveAllocationModalType(
      CustomLeaveAllocationModalTypes.ADD_LEAVE_ALLOCATION
    );
    setIsLeaveAllocationModalOpen(true);
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
        currentPage={currentPage}
        onPaginationChange={(_, value) => setCurrentPage(value - 1)}
        totalPages={customLeaveData?.totalPages || 1}
        isLoading={isLoading}
        skeletonRows={5}
        emptySearchTitle={translateText(["emptySearchResult", "title"])}
        emptySearchDescription={translateText([
          "emptySearchResult",
          "description"
        ])}
        emptyDataTitle={translateText(["emptyCustomLeaveScreen", "title"])}
        emptyDataDescription={translateText([
          "emptyCustomLeaveScreen",
          "description"
        ])}
        emptyScreenButtonText={translateText([
          "CustomLeaveAllocationsSectionBtn"
        ])}
        isDataAvailable={
          !!customLeaveData?.items?.length ||
          !!searchTerm ||
          !!selectedLeaveTypes.length
        }
        actionRowOneLeftButton={yearFilter}
        actionRowOneRightButton={filterButton}
        onEmptyScreenBtnClick={handleAddLeaveAllocation}
      />
    </Box>
  );
};

export default CustomLeaveAllocationsTable;
