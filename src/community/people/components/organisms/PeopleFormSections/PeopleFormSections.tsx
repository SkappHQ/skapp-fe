import { EditPeopleFormTypes } from "~community/people/types/PeopleEditTypes";

import EmergencyDetailsForm from "../EmergencyDetailsSection/EmergencyDetailsForm";
import EmploymentDetailsForm from "../EmploymentFormSection/EmploymentDetailsForm";
import PersonalDetailsForm from "../PersonDetailsSection/PersonalDetailsForm";
import SystemPermissionFormSection from "../SystemPermissionFormSection/SystemPermissionFormSection";

interface Props {
  formType: EditPeopleFormTypes;
  setFormType: (formType: EditPeopleFormTypes) => void;
}
const PeopleFormSections = ({ formType, setFormType }: Props) => {
  const getSections = () => {
    switch (formType) {
      case EditPeopleFormTypes.personal:
        return (
          <PersonalDetailsForm formType={formType} setFormType={setFormType} />
        );
      case EditPeopleFormTypes.emergency:
        return (
          <EmergencyDetailsForm formType={formType} setFormType={setFormType} />
        );
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
