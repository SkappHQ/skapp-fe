import { usePeopleStore } from "~community/people/store/store";
import { EditPeopleFormTypes } from "~community/people/types/PeopleEditTypes";

import EntitlementsDetailsForm from "../AddNewResourceFlow/EntitlementsDetailsSection/EntitlementsDetailsForm";
import EmergencyDetailsForm from "../EmergencyDetailsSection/EmergencyDetailsForm";
import EmploymentDetailsForm from "../EmploymentFormSection/EmploymentDetailsForm";
import PersonalDetailsForm from "../PersonDetailsSection/PersonalDetailsForm";
import SystemPermissionFormSection from "../SystemPermissionFormSection/SystemPermissionFormSection";

interface Props {
  isAddFlow?: boolean;
}

const PeopleFormSections = ({ isAddFlow = false }: Props) => {
  const { currentStep, activeStep } = usePeopleStore((state) => state);

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
        return <EmploymentDetailsForm isAddFlow={isAddFlow} />;
      case EditPeopleFormTypes.permission:
        return <SystemPermissionFormSection isAddFlow={isAddFlow} />;
      default:
        return null;
    }
  };

  return <>{isAddFlow ? getAddFlowSection() : getEditFlowSection()}</>;
};

export default PeopleFormSections;
