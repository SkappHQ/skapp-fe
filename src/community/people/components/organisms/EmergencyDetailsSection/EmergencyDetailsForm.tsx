import { useEffect, useRef } from "react";

import { theme } from "~community/common/theme/theme";
import { scrollToFirstError } from "~community/common/utils/commonUtil";
import useFormChangeDetector from "~community/people/hooks/useFormChangeDetector";
import { usePeopleStore } from "~community/people/store/store";
import { FormMethods } from "~community/people/types/PeopleEditTypes";

import EditSectionButtonWrapper from "../../molecules/EditSectionButtonWrapper/EditSectionButtonWrapper";
import PrimaryContactDetailsSection from "./SubSections/PrimaryContactDetailsSection";
import SecondaryContactDetailsSection from "./SubSections/SecondaryContactDetailsSection";

const EmergencyDetailsForm = () => {
  const primaryContactDetailsRef = useRef<FormMethods | null>(null);
  const secondaryContactDetailsRef = useRef<FormMethods | null>(null);
  const hasChanged = useFormChangeDetector();

  const {
    nextStep,
    currentStep,
    setCurrentStep,
    setNextStep,
    setEmployee,
    employee,
    isSaveButtonClicked,
    setIsUnsavedChangesModalOpen,
    setIsSaveButtonClicked
  } = usePeopleStore((state) => state);

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
      setCurrentStep(nextStep);
      setIsUnsavedChangesModalOpen(false);
      setEmployee(employee);
      setIsSaveButtonClicked(false);
      // Mutate the data
    } else {
      setNextStep(currentStep);
      setIsUnsavedChangesModalOpen(false);
      scrollToFirstError(theme);
      setIsSaveButtonClicked(false);
    }
  };

  useEffect(() => {
    if (isSaveButtonClicked) {
      onSave();
    }
  }, [isSaveButtonClicked]);

  return (
    <>
      <PrimaryContactDetailsSection ref={primaryContactDetailsRef} />
      <SecondaryContactDetailsSection ref={secondaryContactDetailsRef} />
      <EditSectionButtonWrapper
        onCancelClick={() => {}}
        onSaveClick={onSave}
        isSaveDisabled={!hasChanged}
      />
    </>
  );
};

export default EmergencyDetailsForm;
