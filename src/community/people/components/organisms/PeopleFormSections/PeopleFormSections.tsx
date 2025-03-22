import { usePeopleStore } from "~community/people/store/store";
import { EditPeopleFormTypes } from "~community/people/types/PeopleEditTypes";

import EmergencyDetailsForm from "../EmergencyDetailsSection/EmergencyDetailsForm";
import EmploymentDetailsForm from "../EmploymentFormSection/EmploymentDetailsForm";
import PersonalDetailsForm from "../PersonDetailsSection/PersonalDetailsForm";
import SystemPermissionFormSection from "../SystemPermissionFormSection/SystemPermissionFormSection";

const PeopleFormSections = () => {
  const { currentStep } = usePeopleStore((state) => state);

  const getSections = () => {
    switch (currentStep) {
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
