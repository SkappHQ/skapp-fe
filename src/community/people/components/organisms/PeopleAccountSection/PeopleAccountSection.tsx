import { usePeopleStore } from "~community/people/store/store";
import { EditPeopleFormTypes } from "~community/people/types/PeopleEditTypes";

import EmergencyDetailsForm from "../EmergencyDetailsSection/EmergencyDetailsForm";
import EmploymentDetailsForm from "../EmploymentFormSection/EmploymentDetailsForm";
import PersonalDetailsForm from "../PersonDetailsSection/PersonalDetailsForm";

const PeopleAccountSection = () => {
  const { currentStep } = usePeopleStore((state) => state);

  const getSections = () => {
    switch (currentStep) {
      case EditPeopleFormTypes.personal:
        return <PersonalDetailsForm isUpdate />;
      case EditPeopleFormTypes.emergency:
        return <EmergencyDetailsForm />;
      case EditPeopleFormTypes.employment:
        return <EmploymentDetailsForm isUpdate isProfileView />;
      default:
        return;
    }
  };

  return <>{getSections()}</>;
};

export default PeopleAccountSection;
