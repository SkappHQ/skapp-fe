import { FC } from "react";

import { GetLeaveUtilizationChartDetails } from "~community/leave/api/LeaveAnalyticsApi";
import { LeaveType } from "~community/leave/types/CustomLeaveAllocationTypes";

import LeaveTypeBreakdownChart from "../LeaveUtilizationGraph/LeaveTypeBreakdownChart";

interface Props {
  employeeId: number;
  leaveTypesList: LeaveType[];
}

const UserLeaveUtilization: FC<Props> = ({ employeeId, leaveTypesList }) => {
  const {
    isLoading,
    error,
    data: datasets
  } = GetLeaveUtilizationChartDetails(
    employeeId,
    leaveTypesList as unknown as LeaveType[]
  );

  return (
    <div>
      <LeaveTypeBreakdownChart
        datasets={datasets}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default UserLeaveUtilization;
