import { EditAllInformationType } from "~community/people/types/EditEmployeeInfoTypes";

import EmergencyDetailsForm from "../EmergencyDetailsSection/EmergencyDetailsForm";
import PersonalDetailsForm from "../PersonDetailsSection/PersonalDetailsForm";

interface Props {
  formType: EditAllInformationType;
}
const PeopleFormSections = ({ formType }: Props) => {
  const getSections = () => {
    switch (formType) {
      case EditAllInformationType.personal:
        return <PersonalDetailsForm />;
      case EditAllInformationType.emergency:
        return <EmergencyDetailsForm />;
      default:
        return <PersonalDetailsForm />;
    }
  };

  return <>{getSections()}</>;
};

export default PeopleFormSections;
