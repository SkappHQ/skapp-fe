import { useEffect, useRef } from "react";

import { theme } from "~community/common/theme/theme";
import { scrollToFirstError } from "~community/common/utils/commonUtil";
import useStepper from "~community/people/hooks/useStepper";
import { usePeopleStore } from "~community/people/store/store";
import { FormMethods } from "~community/people/types/PeopleEditTypes";
import { useHandlePeopleEdit } from "~community/people/utils/peopleEditFlowUtils/useHandlePeopleEdit";

import AddSectionButtonWrapper from "../../molecules/AddSectionButtonWrapper/AddSectionButtonWrapper";
import EditSectionButtonWrapper from "../../molecules/EditSectionButtonWrapper/EditSectionButtonWrapper";
import PrimaryContactDetailsSection from "./SubSections/PrimaryContactDetailsSection";
import SecondaryContactDetailsSection from "./SubSections/SecondaryContactDetailsSection";

interface Props {
  isAddFlow?: boolean;
}

const EmergencyDetailsForm = ({ isAddFlow = false }: Props) => {
  const primaryContactDetailsRef = useRef<FormMethods | null>(null);
  const secondaryContactDetailsRef = useRef<FormMethods | null>(null);
  const {
    nextStep,
    initialEmployee,
    currentStep,
    employee,
    isUnsavedModalSaveButtonClicked,
    isUnsavedModalDiscardButtonClicked,
    setCurrentStep,
    setNextStep,
    setEmployee,
    setIsUnsavedChangesModalOpen,
    setIsUnsavedModalSaveButtonClicked,
    setIsUnsavedModalDiscardButtonClicked
  } = usePeopleStore((state) => state);

  const { handleMutate } = useHandlePeopleEdit();

  const { handleNext } = useStepper();

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
      if (isAddFlow) {
        handleNext();
      } else {
        setCurrentStep(nextStep);
        setIsUnsavedChangesModalOpen(false);
        setIsUnsavedModalSaveButtonClicked(false);

        handleMutate();
      }
      setEmployee(employee);
    } else {
      setNextStep(currentStep);
      setIsUnsavedChangesModalOpen(false);
      scrollToFirstError(theme);
      setIsUnsavedModalSaveButtonClicked(false);
    }
  };

  const onCancel = () => {
    primaryContactDetailsRef?.current?.resetForm();
    secondaryContactDetailsRef?.current?.resetForm();

    setEmployee(initialEmployee);
    setIsUnsavedChangesModalOpen(false);
    setIsUnsavedModalDiscardButtonClicked(false);
  };

  useEffect(() => {
    if (isUnsavedModalSaveButtonClicked) {
      onSave();
    } else if (isUnsavedModalDiscardButtonClicked) {
      onCancel();
    }
  }, [isUnsavedModalDiscardButtonClicked, isUnsavedModalSaveButtonClicked]);

  return (
    <>
      <PrimaryContactDetailsSection ref={primaryContactDetailsRef} />
      <SecondaryContactDetailsSection ref={secondaryContactDetailsRef} />

      {isAddFlow ? (
        <AddSectionButtonWrapper onNextClick={onSave} />
      ) : (
        <EditSectionButtonWrapper
          onCancelClick={onCancel}
          onSaveClick={onSave}
        />
      )}
    </>
  );
};

export default EmergencyDetailsForm;
