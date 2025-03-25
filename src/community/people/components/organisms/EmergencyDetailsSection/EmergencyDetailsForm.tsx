import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import { theme } from "~community/common/theme/theme";
import { scrollToFirstError } from "~community/common/utils/commonUtil";
import { useEditEmployee } from "~community/people/api/PeopleApi";
import useFormChangeDetector from "~community/people/hooks/useFormChangeDetector";
import useStepper from "~community/people/hooks/useStepper";
import { usePeopleStore } from "~community/people/store/store";
import { FormMethods } from "~community/people/types/PeopleEditTypes";

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
  const { hasChanged, apiPayload } = useFormChangeDetector();

  const {
    nextStep,
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

  const router = useRouter();

  const { id } = router.query;

  const { mutate } = useEditEmployee(id as string);

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
        mutate(apiPayload);
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
    if (hasChanged && isUnsavedModalDiscardButtonClicked) {
      primaryContactDetailsRef?.current?.resetForm();
      secondaryContactDetailsRef?.current?.resetForm();

      setIsUnsavedChangesModalOpen(false);
      setIsUnsavedModalDiscardButtonClicked(false);
    }
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
          isSaveDisabled={!hasChanged}
        />
      )}
    </>
  );
};

export default EmergencyDetailsForm;
