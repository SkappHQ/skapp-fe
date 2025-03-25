import { useEffect, useRef, useState } from "react";

import { theme } from "~community/common/theme/theme";
import { scrollToFirstError } from "~community/common/utils/commonUtil";
import useFormChangeDetector from "~community/people/hooks/useFormChangeDetector";
import useStepper from "~community/people/hooks/useStepper";
import { usePeopleStore } from "~community/people/store/store";
import { FormMethods } from "~community/people/types/PeopleEditTypes";

import AddSectionButtonWrapper from "../../molecules/AddSectionButtonWrapper/AddSectionButtonWrapper";
import EditSectionButtonWrapper from "../../molecules/EditSectionButtonWrapper/EditSectionButtonWrapper";
import CareerProgressDetailsSection from "./SubSections/CareerProgressDetailsSection";
import EmploymentDetailsSection from "./SubSections/EmploymentDetailsSection";
import IdentificationDetailsSection from "./SubSections/IdentificationDetailsSection";
import PreviousEmploymentDetailsSection from "./SubSections/PreviousEmploymentDetailsSection";
import VisaDetailsSection from "./SubSections/VisaDetailsSection";

interface Props {
  isAddFlow?: boolean;
  isUpdate?: boolean;
  isProfileView?: boolean;
}

const EmploymentDetailsForm = ({
  isAddFlow = false,
  isUpdate = false,
  isProfileView = false
}: Props) => {
  const employmentDetailsRef = useRef<FormMethods | null>(null);
  const identificationDetailsRef = useRef<FormMethods | null>(null);

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

  const { hasChanged, apiPayload } = useFormChangeDetector();

  const onSave = async () => {
    const employmentFormErrors =
      (await employmentDetailsRef?.current?.validateForm()) || {};
    const identificationFormErrors =
      (await identificationDetailsRef?.current?.validateForm()) || {};

    const employmentFormIsValid =
      employmentFormErrors && Object.keys(employmentFormErrors).length === 0;
    const identificationFormIsValid =
      identificationFormErrors &&
      Object.keys(identificationFormErrors).length === 0;

    const { handleNext } = useStepper();

    if (employmentFormIsValid && identificationFormIsValid) {
      employmentDetailsRef?.current?.submitForm();
      identificationDetailsRef?.current?.submitForm();
      if (isAddFlow) {
        handleNext();
      } else {
        setCurrentStep(nextStep);
        setIsUnsavedChangesModalOpen(false);
        setIsUnsavedModalSaveButtonClicked(false);
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
      employmentDetailsRef?.current?.resetForm();
      identificationDetailsRef?.current?.resetForm();

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
      <EmploymentDetailsSection
        ref={employmentDetailsRef}
        isUpdate={isUpdate}
        isProfileView={isProfileView}
      />
      <CareerProgressDetailsSection isProfileView={isProfileView} />
      <IdentificationDetailsSection ref={identificationDetailsRef} />
      <PreviousEmploymentDetailsSection />
      <VisaDetailsSection />

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

export default EmploymentDetailsForm;
