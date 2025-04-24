import { forwardRef } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import useSecondaryContactDetailsFormHandlers from "~community/people/hooks/useSecondaryContactDetailsFormHandlers";
import { FormMethods } from "~community/people/types/PeopleEditTypes";

import EmergencyContactDetailsSection from "./EmergencyContactDetailsSection";

interface Props {
  isReadOnly?: boolean;
  isInputsDisabled?: boolean;
}
const SecondaryContactDetailsSection = forwardRef<FormMethods, Props>(
  ({ isReadOnly = false, isInputsDisabled = false }: Props, ref) => {
    const translateText = useTranslator(
      "peopleModule",
      "addResource",
      "emergencyDetails"
    );

    return (
      <EmergencyContactDetailsSection
        isReadOnly={isReadOnly}
        isInputsDisabled={isInputsDisabled}
        ref={ref}
        titleKey={translateText(["secondaryTitle"])}
        formHandlersHook={useSecondaryContactDetailsFormHandlers}
      />
    );
  }
);

SecondaryContactDetailsSection.displayName = "SecondaryContactDetailsSection";

export default SecondaryContactDetailsSection;
