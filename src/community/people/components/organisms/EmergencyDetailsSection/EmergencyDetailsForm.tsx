import { useRef } from "react";

import { theme } from "~community/common/theme/theme";
import { scrollToFirstError } from "~community/common/utils/commonUtil";
import { FormMethods } from "~community/people/types/PeopleEditTypes";

import EditSectionButtonWrapper from "../../molecules/EditSectionButtonWrapper/EditSectionButtonWrapper";
import PrimaryContactDetailsSection from "./SubSections/PrimaryContactDetailsSection";
import SecondaryContactDetailsSection from "./SubSections/SecondaryContactDetailsSection";

const EmergencyDetailsForm = () => {
  const primaryContactDetailsRef = useRef<FormMethods | null>(null);
  const secondaryContactDetailsRef = useRef<FormMethods | null>(null);

  const onSave = async () => {
    const primaryContactDetailsErrors = await primaryContactDetailsRef?.current?.validateForm();
    const secondaryContactDetailsErrors = await secondaryContactDetailsRef?.current?.validateForm();
   
    const primaryContactDetailsIsValid =
    primaryContactDetailsErrors && Object.keys(primaryContactDetailsErrors).length === 0;

    const secondaryContactDetailsIsValid =
    secondaryContactDetailsErrors && Object.keys(secondaryContactDetailsErrors).length === 0;

    if (
      primaryContactDetailsIsValid &&
      secondaryContactDetailsIsValid
    ) {
      primaryContactDetailsRef?.current?.submitForm();
      secondaryContactDetailsRef?.current?.submitForm();
      // Mutate the data
    } else {
      scrollToFirstError(theme);
    }
  };

  return (
    <>
      <PrimaryContactDetailsSection ref={primaryContactDetailsRef} />
      <SecondaryContactDetailsSection ref={secondaryContactDetailsRef} />
      <EditSectionButtonWrapper onCancelClick={() => {}} onSaveClick={onSave} />
    </>
  );
};

export default EmergencyDetailsForm;
