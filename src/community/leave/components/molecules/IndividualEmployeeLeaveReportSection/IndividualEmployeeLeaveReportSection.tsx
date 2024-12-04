import { Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";

import PeopleLayout from "~community/common/components/templates/PeopleLayout/PeopleLayout";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useGetLeaveTypes } from "~community/leave/api/LeaveApi";
import { useLeaveStore } from "~community/leave/store/store";
import { LeaveType } from "~community/leave/types/CustomLeaveAllocationTypes";

import UserAssignedLeaveTypes from "../UserAssignedLeaveTypes/UserAssignedLeaveTypes";
import UserLeaveHistory from "../UserLeaveHistory/UserLeaveHistory";
import UserLeaveUtilization from "../UserLeaveUtilization/UserLeaveUtilization";

interface Props {
  selectedUser: number;
  employeeLastName?: string;
  employeeFirstName?: string;
}

const IndividualEmployeeLeaveReportSection: FC<Props> = ({
  selectedUser,
  employeeLastName,
  employeeFirstName
}) => {
  const translateText = useTranslator(
    "peopleModule",
    "individualLeaveAnalytics"
  );

  const { resetLeaveRequestParams } = useLeaveStore((state) => state);

  const [leaveTypesList, setLeaveTypesList] = useState<LeaveType[]>([]);

  const { data: leaveTypes, isLoading: leaveTypeIsLoading } =
    useGetLeaveTypes();

  useEffect(() => {
    if (leaveTypes && !leaveTypeIsLoading) setLeaveTypesList(leaveTypes);
  }, [leaveTypes, leaveTypeIsLoading]);

  useEffect(() => {
    resetLeaveRequestParams();
  }, []);
  return (
    <PeopleLayout
      title={""}
      containerStyles={{
        padding: "0",
        margin: "0 auto",
        height: "auto"
      }}
      showDivider={false}
      pageHead={translateText(["pageHead"])}
    >
      <Stack gap={"1.5rem"}>
        <UserAssignedLeaveTypes employeeId={selectedUser} pageSize={8} />

        {leaveTypesList?.length > 0 && (
          <UserLeaveUtilization
            employeeId={selectedUser}
            leaveTypesList={leaveTypesList}
          />
        )}

        <UserLeaveHistory
          employeeId={selectedUser}
          leaveTypesList={leaveTypesList}
          employeeLastName={employeeLastName}
          employeeFirstName={employeeFirstName}
        />
      </Stack>
    </PeopleLayout>
  );
};

export default IndividualEmployeeLeaveReportSection;
