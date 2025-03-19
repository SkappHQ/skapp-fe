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
import ContactDetailsSection from "./SubSections/ContactDetailsSection";
import EducationalDetailsSection from "./SubSections/EducationalDetailsSection";
import FamilyDetailsSection from "./SubSections/FamilyDetailsSection";
import GeneralDetailsSection from "./SubSections/GeneralDetailsSections";
import HealthAndOtherDetailsSection from "./SubSections/HealthAndOtherDetailsSection";
import SocialMediaDetailsSection from "./SubSections/SocialMediaDetailsSection";

interface Props {
  formType: EditPeopleFormTypes;
  setFormType: (formType: EditPeopleFormTypes) => void;
}

const PersonalDetailsForm = ({ formType, setFormType }: Props) => {
  const generalDetailsRef = useRef<FormMethods | null>(null);
  const contactDetailsRef = useRef<FormMethods | null>(null);
  const socialMediaDetailsRef = useRef<FormMethods | null>(null);
  const healthAndOtherDetailsRef = useRef<FormMethods | null>(null);

  const { stepperValue, setStepperValue, setEmployee, employee } =
    usePeopleStore((state) => state);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasChanged = useFormChangeDetector();

  const onSave = async () => {
    const generalFormErrors = await generalDetailsRef?.current?.validateForm();
    const contactFormErrors = await contactDetailsRef?.current?.validateForm();
    const socialMediaFormErrors =
      await socialMediaDetailsRef?.current?.validateForm();
    const healthAndOtherFormErrors =
      await healthAndOtherDetailsRef?.current?.validateForm();

    const generalFormIsValid =
      generalFormErrors && Object.keys(generalFormErrors).length === 0;
    const contactFormIsValid =
      contactFormErrors && Object.keys(contactFormErrors).length === 0;
    const socialMediaFormIsValid =
      socialMediaFormErrors && Object.keys(socialMediaFormErrors).length === 0;
    const healthAndOtherFormIsValid =
      healthAndOtherFormErrors &&
      Object.keys(healthAndOtherFormErrors).length === 0;

    if (
      generalFormIsValid &&
      contactFormIsValid &&
      socialMediaFormIsValid &&
      healthAndOtherFormIsValid
    ) {
      generalDetailsRef?.current?.submitForm();
      contactDetailsRef?.current?.submitForm();
      socialMediaDetailsRef?.current?.submitForm();
      healthAndOtherDetailsRef?.current?.submitForm();
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
      <GeneralDetailsSection ref={generalDetailsRef} />
      <ContactDetailsSection ref={contactDetailsRef} />
      <FamilyDetailsSection />
      <EducationalDetailsSection />
      <SocialMediaDetailsSection ref={socialMediaDetailsRef} />
      <HealthAndOtherDetailsSection ref={healthAndOtherDetailsRef} />

      <EditSectionButtonWrapper
        onCancelClick={() => {}}
        onSaveClick={onSave}
        isSaveDisabled={!hasChanged}
      />
      <UnsavedChangesModal
        isOpen={isModalOpen}
        onDiscard={() => {}}
        onSave={onSave}
      />
    </>
  );
};

export default PersonalDetailsForm;
