import { Grid2 as Grid } from "@mui/material";
import { forwardRef, useImperativeHandle } from "react";

import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import InputField from "~community/common/components/molecules/InputField/InputField";
import InputPhoneNumber from "~community/common/components/molecules/InputPhoneNumber/InputPhoneNumber";
import { useTranslator } from "~community/common/hooks/useTranslator";
import useSecondaryContactDetailsFormHandlers from "~community/people/hooks/useSecondaryContactDetailsFormHandlers";
import { FormMethods } from "~community/people/types/PeopleEditTypes";
import { EmergencyContactRelationshipList } from "~community/people/utils/data/employeeSetupStaticData";

import PeopleFormSectionWrapper from "../../PeopleFormSectionWrapper/PeopleFormSectionWrapper";

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
    } = useSecondaryContactDetailsFormHandlers();

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
      <PeopleFormSectionWrapper
        title={translateText(["secondaryTitle"])}
        containerStyles={{
          padding: "0",
          margin: "0 auto",
          display: "block",
          overflowY: "unset",
          fontFamily: "Poppins, sans-serif"
        }}
        dividerStyles={{
          mt: "0.5rem"
        }}
        pageHead={translateText(["head"])}
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={2}
            sx={{
              mb: "2.5rem"
            }}
          >
            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
              <InputField
                label={translateText(["name"])}
                inputType="text"
                value={values?.name ?? ""}
                placeHolder={translateText(["enterName"])}
                onInput={handleInput}
                inputName="name"
                error={errors.name ?? ""}
                maxLength={50}
                componentStyle={{
                  flex: 1,
                  mt: "0rem"
                }}
                readOnly={isReadOnly || isInputsDisabled}
                isDisabled={isInputsDisabled}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
              <DropdownList
                inputName="relationship"
                label={translateText(["relationship"])}
                value={values?.relationship ?? ""}
                placeholder={translateText(["selectRelationship"])}
                onChange={handleChange}
                onInput={handleInput}
                error={errors.relationship ?? ""}
                componentStyle={{
                  mt: "0rem"
                }}
                errorFocusOutlineNeeded={false}
                checkSelected={true}
                itemList={EmergencyContactRelationshipList}
                readOnly={isReadOnly || isInputsDisabled}
                isDisabled={isInputsDisabled}
                ariaLabel={translateAria(["selectRelationship"])}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
              <InputPhoneNumber
                label={translateText(["contactNo"])}
                value={values?.contactNo ?? ""}
                countryCodeValue={values.countryCode as string}
                placeHolder={translateText(["enterContactNo"])}
                onChangeCountry={onChangeCountry}
                onChange={handlePhoneNumber}
                error={errors.contactNo ?? ""}
                inputName="phone"
                fullComponentStyle={{
                  mt: "0rem"
                }}
                readOnly={isReadOnly || isInputsDisabled}
                isDisabled={isReadOnly || isInputsDisabled}
              />
            </Grid>
          </Grid>
        </form>
      </PeopleFormSectionWrapper>
    );
  }
);

SecondaryContactDetailsSection.displayName = "SecondaryContactDetailsSection";

export default SecondaryContactDetailsSection;
