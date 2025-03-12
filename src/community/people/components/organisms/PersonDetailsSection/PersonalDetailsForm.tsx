import { useRef } from "react";

import ContactDetailsSection from "./SubSections/ContactDetailsSection";
import EducationalDetailsSection from "./SubSections/EducationalDetailsSection";
import FamilyDetailsSection from "./SubSections/FamilyDetailsSection";
import GeneralDetailsSection from "./SubSections/GeneralDetailsSections";
import HealthAndOtherDetailsSection from "./SubSections/HealthAndOtherDetailsSection";
import SocialMediaDetailsSection from "./SubSections/SocialMediaDetailsSection";

interface FormMethods {
  validateForm: () => Promise<Record<string, string>>;
  submitForm: () => void;
  resetForm: () => void;
}

const PersonalDetailsForm = () => {
  const generalDetailsRef = useRef<FormMethods | null>(null);

  return (
    <>
      <GeneralDetailsSection ref={generalDetailsRef} />
      <ContactDetailsSection />
      <FamilyDetailsSection />
      <EducationalDetailsSection />
      <SocialMediaDetailsSection />
      <HealthAndOtherDetailsSection />
    </>
  );
};

export default PersonalDetailsForm;
