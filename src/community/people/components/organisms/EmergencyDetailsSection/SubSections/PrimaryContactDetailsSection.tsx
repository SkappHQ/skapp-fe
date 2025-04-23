import { forwardRef, useImperativeHandle } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import usePrimaryContactDetailsFormHandlers from "~community/people/hooks/usePrimaryContactDetailsFormHandlers";
import { FormMethods } from "~community/people/types/PeopleEditTypes";

import ContactDetailsFormSection from "./ContactDetailsFormSection";

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
    const translateAria = useTranslator(
      "peopleAria",
      "addResource",
      "emergencyDetails"
    );

    const {
      values,
      errors,
      handleChange,
      handleInput,
      onChangeCountry,
      handlePhoneNumber,
      formik
    } = usePrimaryContactDetailsFormHandlers();

    useImperativeHandle(ref, () => ({
      validateForm: async () => {
        const validationErrors = await formik.validateForm();
        return validationErrors;
      },
      submitForm: async () => {
        await formik.submitForm();
      },
      resetForm: () => {
        formik.resetForm();
      }
    }));

    return (
      <ContactDetailsFormSection
        title={translateText(["primaryTitle"])}
        pageHead={translateText(["head"])}
        translateText={translateText}
        translateAria={translateAria}
        values={values}
        errors={errors}
        handleChange={handleChange}
        handleInput={handleInput}
        onChangeCountry={onChangeCountry}
        handlePhoneNumber={handlePhoneNumber}
        formik={formik}
        isReadOnly={isReadOnly}
        isInputsDisabled={isInputsDisabled}
      />
    );
  }
);

PrimaryContactDetailsSection.displayName = "PrimaryContactDetailsSection";

export default PrimaryContactDetailsSection;
