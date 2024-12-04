import { Box, Divider, Stack } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { ChangeEvent, JSX } from "react";

import TimesheetAnalyticsSkeleton from "~community/attendance/components/molecules/TimesheetAnalyticsSkeleton/TimesheetAnalyticsSkeleton";
import TableHeaderFill from "~community/attendance/components/molecules/TimesheetTableHeader/TableHeaderFill";
import TimesheetTableHeader from "~community/attendance/components/molecules/TimesheetTableHeader/TimesheetTableHeader";
import TimesheetTableRow from "~community/attendance/components/molecules/TimesheetTableRow/TImesheetTableRow";
import TImesheetTableRowFill from "~community/attendance/components/molecules/TimesheetTableRow/TImesheetTableRowFill";
import { useAttendanceStore } from "~community/attendance/store/attendanceStore";
import {
  ManagerTimesheetHeaderType,
  TimeRecordDataResponseType,
  TimeRecordDataType
} from "~community/attendance/types/timeSheetTypes";
import { downloadManagerTimesheetCsv } from "~community/attendance/utils/TimesheetCsvUtil";
import Button from "~community/common/components/atoms/Button/Button";
import Pagination from "~community/common/components/atoms/Pagination/Pagination";
import TableEmptyScreen from "~community/common/components/molecules/TableEmptyScreen/TableEmptyScreen";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useCommonStore } from "~community/common/stores/commonStore";
import { IconName } from "~community/common/types/IconTypes";
import { useDefaultCapacity } from "~community/configurations/api/timeConfigurationApi";

import { styles } from "./styles";

interface Props {
  recordData: TimeRecordDataResponseType;
  exportRecordData: TimeRecordDataResponseType;
  selectedTab: string;
  orgName?: string;
  teamName?: string;
  isRecordLoading?: boolean;
}

const EmployeeTimeRecordsTable = ({
  recordData,
  exportRecordData,
  selectedTab,
  orgName,
  teamName,
  isRecordLoading
}: Props): JSX.Element => {
  const translateText = useTranslator("attendanceModule", "timesheet");
  const theme: Theme = useTheme();
  const { timesheetAnalyticsParams, setTimesheetAnalyticsPagination } =
    useAttendanceStore((state) => state);

  const { data: timeConfigData } = useDefaultCapacity();

  const { isDrawerToggled } = useCommonStore((state) => ({
    isDrawerToggled: state.isDrawerExpanded
  }));

  const classes = styles(theme);

  const handleExportToCsv = () => {
    downloadManagerTimesheetCsv(
      exportRecordData,
      timesheetAnalyticsParams?.startDate,
      timesheetAnalyticsParams?.endDate,
      teamName,
      orgName
    );
  };

  return (
    <>
      {isRecordLoading ? (
        <TimesheetAnalyticsSkeleton />
      ) : (
        <Stack sx={classes.stackContainer}>
          {!isDrawerToggled ? (
            <TimesheetTableHeader
              headerLabels={
                recordData?.headerList as ManagerTimesheetHeaderType[]
              }
              selectedTab={selectedTab}
            />
          ) : (
            <Box sx={classes.boxContainer}>
              <TimesheetTableHeader
                headerLabels={
                  recordData?.headerList as ManagerTimesheetHeaderType[]
                }
                selectedTab={selectedTab}
              />
            </Box>
          )}
          <TableHeaderFill />
          {recordData?.items?.length === 0 ? (
            <Box sx={classes.emptyScreenContainer}>
              <TableEmptyScreen
                title={translateText(["noTimeEntryTitle"])}
                description={translateText(["noTimeEntryDes"])}
              />
            </Box>
          ) : !isDrawerToggled ? (
            recordData?.items?.map((record: TimeRecordDataType) => (
              <>
                <TImesheetTableRowFill noOfRows={recordData?.items?.length} />
                <TimesheetTableRow
                  key={record?.employee?.employee?.employeeId}
                  employee={{
                    employeeId: record?.employee?.employee
                      ?.employeeId as number,
                    firstName: record?.employee?.employee?.firstName as string,
                    lastName: record?.employee?.employee?.lastName as string,
                    avatarUrl: record?.employee?.employee?.authPic as string
                  }}
                  timesheetData={record?.timeRecords}
                  selectedTab={selectedTab}
                  totalWorkHours={timeConfigData?.[0]?.totalHours as number}
                />
              </>
            ))
          ) : (
            <Box sx={classes.boxContainer}>
              {recordData?.items?.map((record: TimeRecordDataType) => (
                <>
                  <TImesheetTableRowFill noOfRows={recordData?.items?.length} />
                  <TimesheetTableRow
                    key={record?.employee?.employee?.employeeId}
                    employee={{
                      employeeId: record?.employee?.employee
                        ?.employeeId as number,
                      firstName: record?.employee?.employee
                        ?.firstName as string,
                      lastName: record?.employee?.employee?.lastName as string,
                      avatarUrl: record?.employee?.employee?.authPic as string
                    }}
                    timesheetData={record?.timeRecords}
                    selectedTab={selectedTab}
                    totalWorkHours={timeConfigData?.[0]?.totalHours as number}
                  />
                </>
              ))}
            </Box>
          )}
        </Stack>
      )}
      {recordData?.items?.length !== 0 && (
        <Stack sx={classes.paginationContainer}>
          <Divider sx={classes.divider} />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Pagination
              totalPages={recordData?.totalPages}
              currentPage={timesheetAnalyticsParams.page}
              onChange={(_event: ChangeEvent<unknown>, value: number) =>
                setTimesheetAnalyticsPagination(value - 1)
              }
            />
            <Button
              buttonStyle={ButtonStyle.TERTIARY_OUTLINED}
              label={translateText(["exportToCsvBtnTxt"])}
              endIcon={IconName.DOWNLOAD_ICON}
              isFullWidth={false}
              styles={classes.buttonStyles}
              onClick={handleExportToCsv}
            />
          </Stack>
        </Stack>
      )}
      <Divider sx={classes.divider} />
    </>
  );
};

export default EmployeeTimeRecordsTable;
