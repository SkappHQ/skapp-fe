import { useRef } from "react";

import { theme } from "~community/common/theme/theme";
import { scrollToFirstError } from "~community/common/utils/commonUtil";
import { FormMethods } from "~community/people/types/PeopleEditTypes";

import EditSectionButtonWrapper from "../../molecules/EditSectionButtonWrapper/EditSectionButtonWrapper";
import ContactDetailsSection from "./SubSections/ContactDetailsSection";
import EducationalDetailsSection from "./SubSections/EducationalDetailsSection";
import FamilyDetailsSection from "./SubSections/FamilyDetailsSection";
import GeneralDetailsSection from "./SubSections/GeneralDetailsSections";
import HealthAndOtherDetailsSection from "./SubSections/HealthAndOtherDetailsSection";
import SocialMediaDetailsSection from "./SubSections/SocialMediaDetailsSection";

const PersonalDetailsForm = () => {
  const generalDetailsRef = useRef<FormMethods | null>(null);
  const contactDetailsRef = useRef<FormMethods | null>(null);
  const socialMediaDetailsRef = useRef<FormMethods | null>(null);
  const healthAndOtherDetailsRef = useRef<FormMethods | null>(null);

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
      // Mutate the data
    } else {
      scrollToFirstError(theme);
    }
  };

  return (
    <>
      <GeneralDetailsSection ref={generalDetailsRef} />
      <ContactDetailsSection ref={contactDetailsRef} />
      <FamilyDetailsSection />
      <EducationalDetailsSection />
      <SocialMediaDetailsSection ref={socialMediaDetailsRef} />
      <HealthAndOtherDetailsSection ref={healthAndOtherDetailsRef} />
      <EditSectionButtonWrapper onCancelClick={() => {}} onSaveClick={onSave} />
    </>
  );
};

export default PersonalDetailsForm;
