import {
  EditPeopleFormStatus,
  EditPeopleFormTypes
} from "~community/people/types/PeopleEditTypes";

import EmergencyDetailsForm from "../EmergencyDetailsSection/EmergencyDetailsForm";
import PersonalDetailsForm from "../PersonDetailsSection/PersonalDetailsForm";

interface Props {
  formType: EditPeopleFormTypes;
  editFormStatus?: EditPeopleFormStatus;
}
const PeopleFormSections = ({ formType }: Props) => {
  const getSections = () => {
    switch (formType) {
      case EditPeopleFormTypes.personal:
        return <PersonalDetailsForm onNext={() => {}} />;
      case EditPeopleFormTypes.emergency:
        return <EmergencyDetailsForm />;
      default:
        return;
    }
  };

  return <>{getSections()}</>;
};

export default PeopleFormSections;
