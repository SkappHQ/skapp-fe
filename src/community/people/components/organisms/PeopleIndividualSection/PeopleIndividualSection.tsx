import { useSession } from "next-auth/react";

import IndividualEmployeeTimeReportSection from "~community/attendance/components/molecules/IndividualEmployeeTimeReportBody/IndividualEmployeeTimeReportBody";
import {
  AdminTypes,
  EmployeeTypes,
  ManagerTypes
} from "~community/common/types/AuthTypes";
import IndividualEmployeeLeaveReportSection from "~community/leave/components/molecules/IndividualEmployeeLeaveReportSection/IndividualEmployeeLeaveReportSection";
import { usePeopleStore } from "~community/people/store/store";
import { EditPeopleFormTypes } from "~community/people/types/PeopleEditTypes";

import PrimaryContactDetailsSection from "../EmergencyDetailsSection/SubSections/PrimaryContactDetailsSection";
import SecondaryContactDetailsSection from "../EmergencyDetailsSection/SubSections/SecondaryContactDetailsSection";
import EmploymentDetailsSection from "../EmploymentFormSection/SubSections/EmploymentDetailsSection";
import GeneralDetailsSection from "../PersonDetailsSection/SubSections/GeneralDetailsSections";

interface Props {
  employeeId: number;
}

const PeopleIndividualSection = ({ employeeId }: Props) => {
  const { currentStep, employee } = usePeopleStore((state) => state);

  const { data } = useSession();

  const isLeaveManager = data?.user.roles?.includes(
    ManagerTypes.LEAVE_MANAGER || AdminTypes.LEAVE_ADMIN
  );

  const isAttendanceManager = data?.user.roles?.includes(
    ManagerTypes.ATTENDANCE_MANAGER || AdminTypes.ATTENDANCE_ADMIN
  );

  const isEmployee = data?.user.roles?.every((role) =>
    Object.values(EmployeeTypes).includes(role as EmployeeTypes)
  );

  const isManager = isLeaveManager || isAttendanceManager;

  const getSections = () => {
    switch (currentStep) {
      case EditPeopleFormTypes.personal:
        return (
          <>
            <GeneralDetailsSection isManager={true} />
            {isManager && (
              <>
                <PrimaryContactDetailsSection isManager={true} />
                <SecondaryContactDetailsSection isManager={true} />
              </>
            )}
          </>
        );
      case EditPeopleFormTypes.employment:
        return (
          <EmploymentDetailsSection isManager={true} isEmployee={isEmployee} />
        );
      case EditPeopleFormTypes.timesheet:
        return (
          <IndividualEmployeeTimeReportSection
            selectedUser={Number(employeeId)}
          />
        );
      case EditPeopleFormTypes.leave:
        return (
          <IndividualEmployeeLeaveReportSection
            selectedUser={Number(employeeId)}
            employeeLastName={employee?.personal?.general?.lastName}
            employeeFirstName={employee?.personal?.general?.firstName}
          />
        );
      default:
        return;
    }
  };

  return <>{getSections()}</>;
};

export default PeopleIndividualSection;
