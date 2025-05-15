import { forwardRef } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import usePrimaryContactDetailsFormHandlers from "~community/people/hooks/usePrimaryContactDetailsFormHandlers";
import { FormMethods } from "~community/people/types/PeopleEditTypes";

import EmergencyContactDetailsSection from "./EmergencyContactDetailsSection";

interface Props {
  isReadOnly?: boolean;
  isInputsDisabled?: boolean;
}

const PrimaryContactDetailsSection = forwardRef<FormMethods, Props>(
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
        titleKey={translateText(["primaryTitle"])}
        formHandlersHook={usePrimaryContactDetailsFormHandlers}
      />
    );
  }
);

PrimaryContactDetailsSection.displayName = "PrimaryContactDetailsSection";

export default PrimaryContactDetailsSection;
