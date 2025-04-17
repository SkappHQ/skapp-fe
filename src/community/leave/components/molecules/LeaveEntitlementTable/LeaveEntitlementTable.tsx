import { Box, Divider, Stack, Theme, useTheme } from "@mui/material";
import { useMemo, useState } from "react";

import TableHeaderFill from "~community/attendance/components/molecules/TimesheetTableHeader/TableHeaderFill";
import TImesheetTableRowFill from "~community/attendance/components/molecules/TimesheetTableRow/TImesheetTableRowFill";
import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import Pagination from "~community/common/components/atoms/Pagination/Pagination";
import Dropdown from "~community/common/components/molecules/Dropdown/Dropdown";
import TableSkeleton from "~community/common/components/molecules/Table/TableSkeleton";
import TableEmptyScreen from "~community/common/components/molecules/TableEmptyScreen/TableEmptyScreen";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useCommonStore } from "~community/common/stores/commonStore";
import { IconName } from "~community/common/types/IconTypes";
import {
  currentYear,
  getAdjacentYearsWithCurrent,
  nextYear
} from "~community/common/utils/dateTimeUtils";
import { useGetLeaveTypes } from "~community/leave/api/LeaveTypesApi";
import { LeaveEntitlementModelTypes } from "~community/leave/enums/LeaveEntitlementEnums";
import { useLeaveStore } from "~community/leave/store/store";
import {
  LeaveEntitlementResponseType,
  LeaveEntitlementType
} from "~community/leave/types/LeaveEntitlementTypes";
import { exportLeaveBulkList } from "~community/leave/utils/leaveEntitlement/leaveEntitlementUtils";

import LeaveEntitlementTableHeader from "../LeaveEntitlementTableHeader/LeaveEntitlementTableHeader";
import LeaveEntitlementTableRow from "../LeaveEntitlementTableRow/LeaveEntitlementTableRow";
import { styles } from "./styles";

interface Props {
  tableData: LeaveEntitlementResponseType | undefined;
  isFetching: boolean;
  searchTerm: string;
}

const LeaveEntitlementTable = ({
  tableData,
  isFetching,
  searchTerm
}: Props) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const translateText = useTranslator("leaveModule", "leaveEntitlements");

  const { isDrawerToggled } = useCommonStore((state) => ({
    isDrawerToggled: state.isDrawerExpanded
  }));

  const {
    leaveEntitlementTableSelectedYear,
    setLeaveEntitlementTableSelectedYear,
    page,
    setPage,
    setLeaveEntitlementModalType
  } = useLeaveStore((state) => ({
    leaveEntitlementTableSelectedYear: state.leaveEntitlementTableSelectedYear,
    setLeaveEntitlementTableSelectedYear:
      state.setLeaveEntitlementTableSelectedYear,
    page: state.page,
    setPage: state.setPage,
    setLeaveEntitlementModalType: state.setLeaveEntitlementModalType
  }));

  const [headerLabels, setHeaderLabels] = useState<string[]>([]);

  const { data: leaveTypes } = useGetLeaveTypes();

  useMemo(() => {
    if (leaveTypes) {
      const columns = leaveTypes?.map((leaveType) => ({
        field: leaveType?.name?.toLowerCase(),
        headerName: leaveType?.name?.toUpperCase()
      }));

      const tableHeaders = columns.map((col) => col.headerName);

      setHeaderLabels(tableHeaders);
    }
  }, [leaveTypes]);

  if (isFetching) {
    return <TableSkeleton rows={4} />;
  }

  const showEmptyTableButton =
    leaveEntitlementTableSelectedYear === currentYear.toString() ||
    leaveEntitlementTableSelectedYear === nextYear.toString();

  return (
    <>
      <Stack sx={classes.headerStack}>
        <Box>
          <Dropdown
            onItemClick={(event) =>
              setLeaveEntitlementTableSelectedYear(
                event?.currentTarget?.innerText
              )
            }
            selectedItem={leaveEntitlementTableSelectedYear}
            title={leaveEntitlementTableSelectedYear}
            items={getAdjacentYearsWithCurrent()}
          />
        </Box>
      </Stack>
      <Stack sx={classes.stackContainer}>
        {!isDrawerToggled ? (
          <LeaveEntitlementTableHeader headerLabels={headerLabels} />
        ) : (
          <Box sx={classes.boxContainer}>
            <LeaveEntitlementTableHeader headerLabels={headerLabels} />
          </Box>
        )}
        <TableHeaderFill />
        {searchTerm === "" && tableData?.items?.length === 0 ? (
          <Box sx={classes.emptyScreenContainer}>
            <TableEmptyScreen
              title={translateText(["emptyScreen", "title"], {
                selectedYear: leaveEntitlementTableSelectedYear
              })}
              description={translateText(["emptyScreen", "description"])}
              button={{
                label: showEmptyTableButton
                  ? translateText(["emptyScreen", "buttonText"])
                  : "",
                onClick: () => {
                  setLeaveEntitlementModalType(
                    tableData?.items?.length === 0
                      ? LeaveEntitlementModelTypes.DOWNLOAD_CSV
                      : LeaveEntitlementModelTypes.OVERRIDE_CONFIRMATION
                  );
                }
              }}
            />
          </Box>
        ) : (
          <>
            {tableData?.items?.map(
              (leaveEntitlement: LeaveEntitlementType, index: number) => (
                <>
                  {!isDrawerToggled ? (
                    <>
                      <TImesheetTableRowFill
                        noOfRows={tableData.items.length}
                      />
                      <LeaveEntitlementTableRow
                        key={index}
                        employee={{
                          employeeId: leaveEntitlement?.employeeId,
                          firstName: leaveEntitlement?.firstName,
                          lastName: leaveEntitlement?.lastName,
                          authPic: leaveEntitlement?.authPic
                        }}
                        totalAllocations={leaveEntitlement.entitlements}
                        leaveTypes={leaveTypes}
                      />
                    </>
                  ) : (
                    <Box sx={classes.boxContainer}>
                      <TImesheetTableRowFill
                        noOfRows={tableData.items.length}
                      />
                      <LeaveEntitlementTableRow
                        key={index}
                        employee={{
                          employeeId: leaveEntitlement?.employeeId,
                          firstName: leaveEntitlement?.firstName,
                          lastName: leaveEntitlement?.lastName,
                          authPic: leaveEntitlement?.authPic
                        }}
                        totalAllocations={leaveEntitlement.entitlements}
                        leaveTypes={leaveTypes}
                      />
                    </Box>
                  )}
                </>
              )
            )}
          </>
        )}
      </Stack>
      <Divider sx={classes.divider} />
      <Stack sx={classes.paginationContainer}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {(tableData?.totalPages ?? 0) > 1 ? (
            <Pagination
              totalPages={tableData?.totalPages ?? 0}
              currentPage={page - 1}
              onChange={(_event, value) => setPage(value)}
            />
          ) : (
            <Box></Box>
          )}

          <Button
            buttonStyle={ButtonStyle.TERTIARY_OUTLINED}
            label={translateText(["exportBtnTxt"])}
            endIcon={
              <Icon
                name={IconName.DOWNLOAD_ICON}
                fill={
                  tableData?.items?.length === 0
                    ? theme.palette.grey[800]
                    : theme.palette.common.black
                }
              />
            }
            isFullWidth={false}
            styles={classes.buttonStyles}
            disabled={tableData?.items?.length === 0}
            onClick={() =>
              exportLeaveBulkList(
                tableData?.items ?? [],
                leaveEntitlementTableSelectedYear
              )
            }
          />
        </Stack>
      </Stack>
    </>
  );
};

export default LeaveEntitlementTable;
