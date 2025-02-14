import { FC, useEffect, useState } from "react";

import PeopleLayout from "~community/common/components/templates/PeopleLayout/PeopleLayout";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useGetLeaveTypes } from "~community/leave/api/LeaveApi";
import UserAssignedLeaveTypes from "~community/leave/components/molecules/UserAssignedLeaveTypes/UserAssignedLeaveTypes";
import UserLeaveHistory from "~community/leave/components/molecules/UserLeaveHistory/UserLeaveHistory";
import UserLeaveUtilization from "~community/leave/components/molecules/UserLeaveUtilization/UserLeaveUtilization";
import { useLeaveStore } from "~community/leave/store/store";
import { LeaveType } from "~community/leave/types/CustomLeaveAllocationTypes";
import UpgradeOverlay from "~enterprise/common/components/molecules/UpgradeOverlay/UpgradeOverlay";

import styles from "./styles";

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
  const classes = styles();

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
      containerStyles={classes.container}
      showDivider={false}
      pageHead={translateText(["pageHead"])}
    >
      <UpgradeOverlay customContainerStyles={classes.customContainerStyles}>
        <>
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
        </>
      </UpgradeOverlay>
    </PeopleLayout>
  );
};

export default IndividualEmployeeLeaveReportSection;
