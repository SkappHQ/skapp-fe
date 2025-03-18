import CareerProgressDetailsSection from "./SubSections/CareerProgressDetailsSection";
import EmploymentDetailsSection from "./SubSections/EmploymentDetailsSection";
import IdentificationDetailsSection from "./SubSections/IdentificationDetailsSection";
import PreviousEmploymentDetailsSection from "./SubSections/PreviousEmploymentDetailsSection";
import VisaDetailsSection from "./SubSections/VisaDetailsSection";

const EmploymentDetailsForm = () => {
  return (
    <>
      <EmploymentDetailsSection />
      <CareerProgressDetailsSection />
      <IdentificationDetailsSection />
      <PreviousEmploymentDetailsSection />
      <VisaDetailsSection />
    </>
  );
};

export default EmploymentDetailsForm;
