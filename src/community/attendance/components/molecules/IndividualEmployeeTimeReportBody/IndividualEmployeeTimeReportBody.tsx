import { Grid2 as Grid } from "@mui/material";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";

import { useGetIndividualUtilization } from "~community/attendance/api/AttendanceAdminApi";
import { useGetDailyLogsByEmployeeId } from "~community/attendance/api/AttendanceEmployeeApi";
import { useGetIndividualWorkHourGraphData } from "~community/attendance/api/attendanceManagerApi";
import { TimeUtilizationTrendTypes } from "~community/attendance/types/timeSheetTypes";
import { downloadEmployeeDailyLogCsv } from "~community/attendance/utils/TimesheetCsvUtil";
import PeopleLayout from "~community/common/components/templates/PeopleLayout/PeopleLayout";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useCommonStore } from "~community/common/stores/commonStore";
import { roundNumberToX } from "~community/common/utils/commonUtil";
import {
  getCurrentMonth,
  getMonthName,
  getStartAndEndDateOfTheMonth
} from "~community/common/utils/dateTimeUtils";

import WorkHourGraph from "../Graphs/WorkHourGraph";
import TimeUtilizationCard from "../TimeUtilizationCard/TimeUtilizationCard";
import TimesheetDailyRecordTable from "../TimesheetDailyRecordTable/TimesheetDailyRecordTable";

interface Props {
  selectedUser: number;
}

const IndividualEmployeeTimeReportSection: FC<Props> = ({ selectedUser }) => {
  const translateText = useTranslator("attendanceModule", "timesheet");

  const [month, setMonth] = useState(getCurrentMonth());

  const { data: session } = useSession();

  const { data: dailyLogData, isLoading: isDailyLogLoading } =
    useGetDailyLogsByEmployeeId(
      getStartAndEndDateOfTheMonth().start,
      getStartAndEndDateOfTheMonth().end,
      selectedUser
    );
  const { isDrawerToggled } = useCommonStore((state) => ({
    isDrawerToggled: state.isDrawerExpanded
  }));

  const { data: managerUtilizaionData } = useGetIndividualUtilization(
    selectedUser,
    true
  );

  const { data: workHoursGraphData, isLoading: isworkHoursGraphLoading } =
    useGetIndividualWorkHourGraphData(
      getMonthName(month)?.toUpperCase(),
      selectedUser,
      true
    );

  return (
    <PeopleLayout
      title={""}
      containerStyles={{
        padding: "0",
        margin: "0 auto",
        height: "auto",
        maxWidth: isDrawerToggled ? "90rem" : "103.125rem"
      }}
      showDivider={false}
      pageHead={translateText(["individualTimeSheetAnalytics.title"])}
    >
      <>
        <Grid container spacing={1}>
          <Grid size={{ xs: 2 }}>
            <TimeUtilizationCard
              lastThirtyDayChange={
                roundNumberToX(managerUtilizaionData?.lastThirtyDayChange, 1) ??
                "--"
              }
              trend={
                managerUtilizaionData?.toString()?.startsWith("-")
                  ? TimeUtilizationTrendTypes.TREND_DOWN
                  : TimeUtilizationTrendTypes.TREND_UP
              }
              percentage={
                roundNumberToX(managerUtilizaionData?.percentage, 1) ?? "--"
              }
            />
          </Grid>
          <Grid size={{ xs: 10 }}>
            <WorkHourGraph
              data={workHoursGraphData ?? { preProcessedData: [], labels: [] }}
              isLoading={isworkHoursGraphLoading}
              title={translateText(["individualTimeSheetAnalytics.workHours"])}
              month={month}
              setMonth={setMonth}
            />
          </Grid>
        </Grid>

        <Grid
          size={{ xs: 12 }}
          sx={{
            marginTop: "1.5rem"
          }}
        >
          <TimesheetDailyRecordTable
            dailyLogData={dailyLogData || []}
            downloadEmployeeDailyLogCsv={() => {
              downloadEmployeeDailyLogCsv(
                dailyLogData || [],
                session?.user.employee?.firstName || "",
                getStartAndEndDateOfTheMonth().start,
                getStartAndEndDateOfTheMonth().end
              );
            }}
            isDailyLogLoading={isDailyLogLoading}
          />
        </Grid>
      </>
    </PeopleLayout>
  );
};

export default IndividualEmployeeTimeReportSection;
