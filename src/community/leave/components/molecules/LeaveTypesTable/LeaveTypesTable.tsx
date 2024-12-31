import { Box } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useEffect } from "react";

import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";
import Table from "~community/common/components/molecules/Table/Table";
import ROUTES from "~community/common/constants/routes";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { getEmoji } from "~community/common/utils/commonUtil";
import { useGetLeaveTypes } from "~community/leave/api/LeaveTypesApi";
import { LeaveTypeFormTypes } from "~community/leave/enums/LeaveTypeEnums";
import { useLeaveStore } from "~community/leave/store/store";
import { LeaveTypeType } from "~community/leave/types/AddLeaveTypes";
import { getLeaveTypeDurationTableContent } from "~community/leave/utils/leaveTypes/LeaveTypeUtils";

import styles from "./styles";

const LeaveTypesTable = () => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const translateText = useTranslator("leaveModule", "leaveTypes");

  const router = useRouter();

  const { allLeaveTypes, setEditingLeaveType, setAllLeaveTypes } =
    useLeaveStore((state) => state);

  const { data: leaveTypes, isFetching: isLeaveTypesFetching } =
    useGetLeaveTypes();

  const columns = [
    { field: "leaveTypeName", headerName: translateText(["nameHeader"]) },
    { field: "durations", headerName: translateText(["durationsHeader"]) },
    {
      field: "carriedForward",
      headerName: translateText(["carriedForwardHeader"])
    }
  ];

  const tableHeaders = columns.map((col) => ({
    id: col.field,
    label: col.headerName
  }));

  const transformToTableRows = () => {
    return (
      (leaveTypes as LeaveTypeType[])?.map((leaveType: LeaveTypeType) => ({
        id: leaveType?.typeId,
        leaveTypeName: (
          <BasicChip
            label={`${getEmoji(`${leaveType?.emojiCode}`)} ${leaveType?.name}`}
          />
        ),
        durations: getLeaveTypeDurationTableContent(
          leaveType?.leaveDuration
        ).map((duration: string, index: number) => (
          <BasicChip
            key={duration}
            label={duration}
            chipStyles={{ marginRight: index === 0 ? "2rem" : 0 }}
          />
        )),
        carriedForward: (
          <BasicChip
            label={
              leaveType?.isCarryForwardEnabled
                ? translateText(["enabled"])
                : translateText(["disabled"])
            }
          />
        ),
        actionData: leaveType
      })) || []
    );
  };

  const handleEditTeam = (leaveType: LeaveTypeType): void => {
    setEditingLeaveType(leaveType);
    router.push(ROUTES.LEAVE.ADD_EDIT_LEAVE_TYPES(LeaveTypeFormTypes.EDIT));
  };

  useEffect(() => {
    setAllLeaveTypes(leaveTypes ?? []);
  }, [leaveTypes, setAllLeaveTypes]);

  return (
    <Box sx={classes.tableWrapper}>
      <Table
        tableHeaders={tableHeaders}
        tableRows={transformToTableRows()}
        tableHeaderRowStyles={classes.tableHead}
        tableContainerStyles={classes.tableContainer}
        isPaginationEnabled={false}
        tableHeaderCellStyles={classes.tableHeaderCell}
        isDataAvailable={allLeaveTypes?.length > 0}
        isLoading={isLeaveTypesFetching}
        skeletonRows={6}
        actionColumnIconBtnLeft={{
          onClick: (leaveType) => handleEditTeam(leaveType)
        }}
      />
    </Box>
  );
};

export default LeaveTypesTable;
