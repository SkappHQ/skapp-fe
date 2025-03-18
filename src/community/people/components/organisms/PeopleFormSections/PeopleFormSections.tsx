import {
  EditPeopleFormStatus,
  EditPeopleFormTypes
} from "~community/people/types/PeopleEditTypes";

import EmergencyDetailsForm from "../EmergencyDetailsSection/EmergencyDetailsForm";
import EmploymentDetailsForm from "../EmploymentFormSection/EmploymentDetailsForm";
import PersonalDetailsForm from "../PersonDetailsSection/PersonalDetailsForm";
import SystemPermissionFormSection from "../SystemPermissionFormSection/SystemPermissionFormSection";

interface Props {
  formType: EditPeopleFormTypes;
  editFormStatus?: EditPeopleFormStatus;
}
const PeopleFormSections = ({ formType }: Props) => {
  const getSections = () => {
    switch (formType) {
      case EditPeopleFormTypes.personal:
        return <PersonalDetailsForm />;
      case EditPeopleFormTypes.emergency:
        return <EmergencyDetailsForm />;
      case EditPeopleFormTypes.employment:
        return <EmploymentDetailsForm />;
      case EditPeopleFormTypes.permission:
        return <SystemPermissionFormSection />;
      default:
        return;
    }
  };

  return <>{getSections()}</>;
};

export default PeopleFormSections;
