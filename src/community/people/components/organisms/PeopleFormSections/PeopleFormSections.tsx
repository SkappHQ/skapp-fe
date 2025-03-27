import IndividualEmployeeTimeReportSection from "~community/attendance/components/molecules/IndividualEmployeeTimeReportBody/IndividualEmployeeTimeReportBody";
import IndividualEmployeeLeaveReportSection from "~community/leave/components/molecules/IndividualEmployeeLeaveReportSection/IndividualEmployeeLeaveReportSection";
import { usePeopleStore } from "~community/people/store/store";
import { EditPeopleFormTypes } from "~community/people/types/PeopleEditTypes";

import EntitlementsDetailsForm from "../AddNewResourceFlow/EntitlementsDetailsSection/EntitlementsDetailsForm";
import EmergencyDetailsForm from "../EmergencyDetailsSection/EmergencyDetailsForm";
import EmploymentDetailsForm from "../EmploymentFormSection/EmploymentDetailsForm";
import PersonalDetailsForm from "../PersonDetailsSection/PersonalDetailsForm";
import SystemPermissionFormSection from "../SystemPermissionFormSection/SystemPermissionFormSection";

interface Props {
  employeeId?: number;
  isAddFlow?: boolean;
}

const PeopleFormSections = ({ employeeId, isAddFlow = false }: Props) => {
  const { currentStep, activeStep, employee } = usePeopleStore(
    (state) => state
  );

  const getAddFlowSection = () => {
    switch (activeStep) {
      case 0:
        return <PersonalDetailsForm isAddFlow={isAddFlow} />;
      case 1:
        return <EmergencyDetailsForm isAddFlow={isAddFlow} />;
      case 2:
        return <EmploymentDetailsForm isAddFlow={isAddFlow} />;
      case 3:
        return <SystemPermissionFormSection isAddFlow={isAddFlow} />;
      case 4:
        return <EntitlementsDetailsForm />;
      default:
        return null;
    }
  };

  const getEditFlowSection = () => {
    switch (currentStep) {
      case EditPeopleFormTypes.personal:
        return <PersonalDetailsForm isAddFlow={isAddFlow} />;
      case EditPeopleFormTypes.emergency:
        return <EmergencyDetailsForm isAddFlow={isAddFlow} />;
      case EditPeopleFormTypes.employment:
        return <EmploymentDetailsForm isAddFlow={isAddFlow} isUpdate />;
      case EditPeopleFormTypes.permission:
        return <SystemPermissionFormSection isAddFlow={isAddFlow} />;
      case EditPeopleFormTypes.leave:
        return (
          <IndividualEmployeeLeaveReportSection
            selectedUser={Number(employeeId)}
            employeeLastName={employee?.personal?.general?.lastName ?? ""}
            employeeFirstName={employee?.personal?.general?.firstName ?? ""}
          />
        );
      case EditPeopleFormTypes.timesheet:
        return (
          <IndividualEmployeeTimeReportSection
            selectedUser={Number(employeeId)}
          />
        );
      default:
        return null;
    }
  };

  return <>{isAddFlow ? getAddFlowSection() : getEditFlowSection()}</>;
};

export default PeopleFormSections;
