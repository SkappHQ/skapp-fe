import { Dispatch, SetStateAction, useRef } from "react";

import {
  EditPeopleFormStatus,
  FormMethods
} from "~community/people/types/PeopleEditTypes";

import EditSectionButtonWrapper from "../../molecules/EditSectionButtonWrapper/EditSectionButtonWrapper";
import ContactDetailsSection from "./SubSections/ContactDetailsSection";
import EducationalDetailsSection from "./SubSections/EducationalDetailsSection";
import FamilyDetailsSection from "./SubSections/FamilyDetailsSection";
import GeneralDetailsSection from "./SubSections/GeneralDetailsSections";
import HealthAndOtherDetailsSection from "./SubSections/HealthAndOtherDetailsSection";
import SocialMediaDetailsSection from "./SubSections/SocialMediaDetailsSection";
import { scrollToFirstError } from "~community/common/utils/commonUtil";
import { theme } from "~community/common/theme/theme";

interface Props {
  onNext: () => void;
  updateEmployeeStatus?: EditPeopleFormStatus;
  setUpdateEmployeeStatus?: Dispatch<SetStateAction<EditPeopleFormStatus>>;
}

const PersonalDetailsForm = ({
  updateEmployeeStatus,
  setUpdateEmployeeStatus,
  onNext
}: Props) => {
  const generalDetailsRef = useRef<FormMethods | null>(null);
  const contactDetailsRef = useRef<FormMethods | null>(null);
  const socialMediaDetailsRef = useRef<FormMethods | null>(null);
  const healthAndOtherDetailsRef = useRef<FormMethods | null>(null);

  const onSave = async () => {
    const generalFormErrors = await generalDetailsRef?.current?.validateForm();
    const contactFormErrors = await contactDetailsRef?.current?.validateForm();
    const socialMediaFormErrors =
      await socialMediaDetailsRef?.current?.validateForm();

    const healthAndOtherFormIsValid =
      await healthAndOtherDetailsRef?.current?.validateForm();

    setTimeout(async () => {
      const generalFormIsValid =
        generalFormErrors && Object.keys(generalFormErrors).length === 0;

      const contactFormIsValid =
        contactFormErrors && Object.keys(contactFormErrors).length === 0;

      const socialMediaFormIsValid =
        socialMediaFormErrors &&
        Object.keys(socialMediaFormErrors).length === 0;

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

        setUpdateEmployeeStatus?.(EditPeopleFormStatus.VALIDATED);
        // Mutate the data
      } else {
        setUpdateEmployeeStatus?.(EditPeopleFormStatus.VALIDATE_ERROR);
         scrollToFirstError(theme);
      }
    }, 0);
  };

  return (
    <>
      <GeneralDetailsSection ref={generalDetailsRef} />
      <ContactDetailsSection ref={generalDetailsRef} />
      <FamilyDetailsSection />
      <EducationalDetailsSection />
      <SocialMediaDetailsSection ref={socialMediaDetailsRef} />
      <HealthAndOtherDetailsSection ref={healthAndOtherDetailsRef} />
      <EditSectionButtonWrapper onCancelClick={() => {}} onSaveClick={onSave} />
    </>
  );
};

export default PersonalDetailsForm;
