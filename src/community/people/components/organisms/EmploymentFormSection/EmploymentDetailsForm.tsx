import { useEffect, useRef } from "react";

import { theme } from "~community/common/theme/theme";
import { scrollToFirstError } from "~community/common/utils/commonUtil";
import useFormChangeDetector from "~community/people/hooks/useFormChangeDetector";
import { usePeopleStore } from "~community/people/store/store";
import { FormMethods } from "~community/people/types/PeopleEditTypes";

import EditSectionButtonWrapper from "../../molecules/EditSectionButtonWrapper/EditSectionButtonWrapper";
import CareerProgressDetailsSection from "./SubSections/CareerProgressDetailsSection";
import EmploymentDetailsSection from "./SubSections/EmploymentDetailsSection";
import IdentificationDetailsSection from "./SubSections/IdentificationDetailsSection";
import PreviousEmploymentDetailsSection from "./SubSections/PreviousEmploymentDetailsSection";
import VisaDetailsSection from "./SubSections/VisaDetailsSection";

const EmploymentDetailsForm = () => {
  const employmentDetailsRef = useRef<FormMethods | null>(null);
  const identificationDetailsRef = useRef<FormMethods | null>(null);

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

  const hasChanged = useFormChangeDetector();

  const onSave = async () => {
    const employmentFormErrors =
      await employmentDetailsRef?.current?.validateForm();
    const identificationFormErrors =
      await identificationDetailsRef?.current?.validateForm();

    const employmentFormIsValid =
      employmentFormErrors && Object.keys(employmentFormErrors).length === 0;
    const identificationFormIsValid =
      identificationFormErrors &&
      Object.keys(identificationFormErrors).length === 0;

    if (employmentFormIsValid && identificationFormIsValid) {
      employmentDetailsRef?.current?.submitForm();
      identificationDetailsRef?.current?.submitForm();

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
      <EmploymentDetailsSection ref={employmentDetailsRef}/>
      <CareerProgressDetailsSection />
      <IdentificationDetailsSection ref={identificationDetailsRef}/>
      <PreviousEmploymentDetailsSection />
      <VisaDetailsSection />

      <EditSectionButtonWrapper
        onCancelClick={() => {}}
        onSaveClick={onSave}
        isSaveDisabled={!hasChanged}
      />
    </>
  );
};

export default EmploymentDetailsForm;
