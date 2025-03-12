import ContactDetailsSection from "./SubSections/ContactDetailsSection";
import EducationalDetailsSection from "./SubSections/EducationalDetailsSection";
import FamilyDetailsSection from "./SubSections/FamilyDetailsSection";
import GeneralDetailsSections from "./SubSections/GeneralDetailsSections";
import HealthAndOtherDetailsSection from "./SubSections/HealthAndOtherDetailsSection";
import SocialMediaDetailsSection from "./SubSections/SocialMediaDetailsSection";

const PersonalDetailsForm = () => {
  return (
    <>
      <GeneralDetailsSections />
      <ContactDetailsSection />
      <FamilyDetailsSection />
      <EducationalDetailsSection />
      <SocialMediaDetailsSection />
      <HealthAndOtherDetailsSection />
    </>
  );
};

export default PersonalDetailsForm;
