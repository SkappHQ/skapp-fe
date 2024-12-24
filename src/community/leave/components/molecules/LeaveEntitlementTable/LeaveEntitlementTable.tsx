import { Box } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";

import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import Dropdown from "~community/common/components/molecules/Dropdown/Dropdown";
import Table from "~community/common/components/molecules/Table/Table";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { getAdjacentYearsWithCurrent } from "~community/common/utils/dateTimeUtils";
import { formatToFiveDecimalPlaces } from "~community/common/utils/numberUtils";
import { useGetLeaveTypes } from "~community/leave/api/LeaveTypesApi";
import { LeaveEntitlementModelTypes } from "~community/leave/enums/LeaveEntitlementEnums";
import { useLeaveStore } from "~community/leave/store/store";
import {
  LeaveEntitlementResponseType,
  LeaveEntitlementType
} from "~community/leave/types/LeaveEntitlementTypes";
import { exportLeaveBulkList } from "~community/leave/utils/leaveEntitlement/leaveEntitlementUtils";

import styles from "./styles";

interface Props {
  tableData: LeaveEntitlementResponseType | undefined;
  isFetching: boolean;
}

const LeaveEntitlementTable = ({ tableData, isFetching }: Props) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const translateText = useTranslator("leaveModule", "leaveEntitlements");

  const {
    selectedYear,
    setSelectedYear,
    page,
    setPage,
    setLeaveEntitlementModalType
  } = useLeaveStore((state) => state);

  const { data: leaveTypes } = useGetLeaveTypes();

  const leaveTypesColumns =
    leaveTypes?.map((leaveType) => ({
      field: leaveType?.name?.toLowerCase(),
      headerName: leaveType?.name?.toUpperCase()
    })) || [];

  const columns = [
    { field: "employee", headerName: translateText(["employeeNameHeader"]) },
    ...leaveTypesColumns
  ];

  const tableHeaders = columns.map((col) => ({
    id: col.field,
    label: col.headerName
  }));

  const transformToTableRows = () => {
    return (
      tableData?.items?.map((leaveEntitlement: LeaveEntitlementType) => {
        const userColumnData = {
          id: leaveEntitlement?.employeeId,
          employee: (
            <Box width="100%">
              <AvatarChip
                key={leaveEntitlement?.employeeId}
                firstName={leaveEntitlement?.firstName}
                lastName={leaveEntitlement?.lastName}
                avatarUrl={leaveEntitlement?.avatarUrl}
                isResponsiveLayout={true}
                chipStyles={classes.avatarChip}
              />
            </Box>
          )
        };

        const leaveEntitlementData = leaveTypes?.map((leaveType) => {
          const entitlement = leaveEntitlement?.entitlements?.find(
            (entitlement) =>
              entitlement?.name?.toLowerCase() ===
              leaveType?.name?.toLowerCase()
          );

          return {
            [leaveType?.name?.toLowerCase()]: entitlement
              ? formatToFiveDecimalPlaces(
                  parseFloat(entitlement?.totalDaysAllocated)
                )
              : "-"
          };
        });

        return Object.assign(userColumnData, ...(leaveEntitlementData || []));
      }) || []
    );
  };

  return (
    <Box sx={classes.tableWrapper}>
      <Table
        tableHeaders={tableHeaders}
        tableRows={transformToTableRows()}
        tableHeaderRowStyles={classes.tableHead}
        tableContainerStyles={classes.tableContainer}
        isPaginationEnabled={true}
        totalPages={tableData?.totalPages}
        currentPage={page - 1}
        onPaginationChange={(_event, value) => setPage(value)}
        tableHeaderCellStyles={classes.tableHeaderCell}
        emptySearchTitle={translateText(["emptySearchResult", "title"])}
        emptySearchDescription={translateText([
          "emptySearchResult",
          "description"
        ])}
        emptyDataTitle={translateText(["emptyScreen", "title"], {
          selectedYear: selectedYear
        })}
        emptyDataDescription={translateText(["emptyScreen", "description"])}
        emptyScreenButtonText={translateText(["emptyScreen", "buttonText"])}
        isDataAvailable={tableData?.items && tableData?.items?.length > 0}
        isLoading={isFetching}
        skeletonRows={3}
        exportButtonText={translateText(["exportBtnTxt"])}
        onExportButtonClick={() =>
          exportLeaveBulkList(tableData?.items ?? [], selectedYear)
        }
        onEmptyScreenBtnClick={() => {
          setLeaveEntitlementModalType(
            tableData?.items?.length === 0
              ? LeaveEntitlementModelTypes.DOWNLOAD_CSV
              : LeaveEntitlementModelTypes.OVERRIDE_CONFIRMATION
          );
        }}
        actionRowOneLeftButton={
          <Dropdown
            onItemClick={(event) =>
              setSelectedYear(event?.currentTarget?.innerText)
            }
            selectedItem={selectedYear}
            title={selectedYear}
            items={getAdjacentYearsWithCurrent()}
          />
        }
      />
    </Box>
  );
};

export default LeaveEntitlementTable;
