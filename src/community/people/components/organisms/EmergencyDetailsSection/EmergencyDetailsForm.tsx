import { useEffect, useRef, useState } from "react";

import { theme } from "~community/common/theme/theme";
import { scrollToFirstError } from "~community/common/utils/commonUtil";
import useFormChangeDetector from "~community/people/hooks/useFormChangeDetector";
import { usePeopleStore } from "~community/people/store/store";
import {
  EditPeopleFormTypes,
  FormMethods
} from "~community/people/types/PeopleEditTypes";

import EditSectionButtonWrapper from "../../molecules/EditSectionButtonWrapper/EditSectionButtonWrapper";
import UnsavedChangesModal from "../../molecules/UnsavedChangesModal/UnsavedChangesModal";
import PrimaryContactDetailsSection from "./SubSections/PrimaryContactDetailsSection";
import SecondaryContactDetailsSection from "./SubSections/SecondaryContactDetailsSection";

interface Props {
  formType: EditPeopleFormTypes;
  setFormType: (formType: EditPeopleFormTypes) => void;
}

const EmergencyDetailsForm = ({ formType, setFormType }: Props) => {
  const primaryContactDetailsRef = useRef<FormMethods | null>(null);
  const secondaryContactDetailsRef = useRef<FormMethods | null>(null);
  const hasChanged = useFormChangeDetector();

  const { stepperValue, setEmployee, employee, setStepperValue } =
    usePeopleStore((state) => state);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSave = async () => {
    const primaryContactDetailsErrors =
      await primaryContactDetailsRef?.current?.validateForm();
    const secondaryContactDetailsErrors =
      await secondaryContactDetailsRef?.current?.validateForm();

    const primaryContactDetailsIsValid =
      primaryContactDetailsErrors &&
      Object.keys(primaryContactDetailsErrors).length === 0;

    const secondaryContactDetailsIsValid =
      secondaryContactDetailsErrors &&
      Object.keys(secondaryContactDetailsErrors).length === 0;

    if (primaryContactDetailsIsValid && secondaryContactDetailsIsValid) {
      primaryContactDetailsRef?.current?.submitForm();
      secondaryContactDetailsRef?.current?.submitForm();
      setFormType(stepperValue);
      setIsModalOpen(false);
      setEmployee(employee);
      // Mutate the data
    } else {
      setStepperValue(formType);
      setIsModalOpen(false);
      scrollToFirstError(theme);
    }
  };

  useEffect(() => {
    if (stepperValue !== formType && hasChanged) {
      setIsModalOpen(true);
    } else {
      setFormType(stepperValue);
    }
  }, [stepperValue, hasChanged, formType, setFormType]);

  return (
    <>
      <PrimaryContactDetailsSection ref={primaryContactDetailsRef} />
      <SecondaryContactDetailsSection ref={secondaryContactDetailsRef} />
      <EditSectionButtonWrapper
        onCancelClick={() => {}}
        onSaveClick={onSave}
        isSaveDisabled={!hasChanged}
      />{" "}
      <UnsavedChangesModal
        isOpen={isModalOpen}
        onDiscard={() => {}}
        onSave={onSave}
      />
    </>
  );
};

export default EmergencyDetailsForm;
