import { Grid2 as Grid } from "@mui/material";

import DropdownAutocomplete from "~community/common/components/molecules/DropdownAutocomplete/DropdownAutocomplete";
import InputField from "~community/common/components/molecules/InputField/InputField";
import InputPhoneNumber from "~community/common/components/molecules/InputPhoneNumber/InputPhoneNumber";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { ADDRESS_MAX_CHARACTER_LENGTH } from "~community/people/constants/configs";

import PeopleFormSectionWrapper from "../../PeopleFormSectionWrapper/PeopleFormSectionWrapper";

interface Props {
  isInputsDisabled?: boolean;
}

const ContactDetailsSection = ({ isInputsDisabled }: Props) => {
  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "contactDetails"
  );

  return (
    <PeopleFormSectionWrapper
      title={translateText(["title"])}
      containerStyles={{
        padding: "0",
        margin: "0 auto",
        overflowY: "unset",
        height: "auto",
        fontFamily: "Poppins, sans-serif"
      }}
      dividerStyles={{
        mt: "0.5rem"
      }}
      pageHead={translateText(["head"])}
    >
      <form onSubmit={() => {}}>
        <Grid
          container
          spacing={2}
          sx={{
            mb: "2rem"
          }}
        >
          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputField
              label={translateText(["personalEmail"])}
              inputType="email"
              value={""}
              placeHolder={translateText(["enterPersonalEmail"])}
              onInput={() => {}}
              inputName="personalEmail"
              error={""}
              componentStyle={{
                flex: 1,
                mt: "0rem"
              }}
              isDisabled={isInputsDisabled}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputPhoneNumber
              label={translateText(["contactNo"])}
              value={""}
              countryCodeValue={""}
              onChangeCountry={async (countryCode: string) => {}}
              onChange={async (phone) => {}}
              error={""}
              inputName="phone"
              fullComponentStyle={{
                mt: "0rem"
              }}
              placeHolder={translateText(["enterContactNo"])}
              isDisabled={isInputsDisabled}
              readOnly={isInputsDisabled}
            />
          </Grid>
          <Grid
            size={{ xl: 4 }}
            sx={{
              display: { xs: "none", xl: "block" }
            }}
          />

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputField
              label={translateText(["addressLine1"])}
              inputType="text"
              value={""}
              placeHolder={translateText(["enterAddressLine1"])}
              onChange={() => {}}
              inputName="addressLine1"
              error={""}
              componentStyle={{
                flex: 1,
                mt: "0rem"
              }}
              maxLength={ADDRESS_MAX_CHARACTER_LENGTH}
              isDisabled={isInputsDisabled}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputField
              label={translateText(["addressLine2"])}
              inputType="text"
              value={""}
              placeHolder={translateText(["enterAddressLine2"])}
              onChange={() => {}}
              inputName="addressLine2"
              error={""}
              componentStyle={{
                flex: 1,
                mt: "0rem"
              }}
              maxLength={ADDRESS_MAX_CHARACTER_LENGTH}
              isDisabled={isInputsDisabled}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputField
              label={translateText(["city"])}
              inputType="text"
              value={""}
              placeHolder={translateText(["enterCity"])}
              onChange={() => {}}
              inputName="city"
              error={""}
              componentStyle={{
                flex: 1,
                mt: "0rem"
              }}
              maxLength={ADDRESS_MAX_CHARACTER_LENGTH}
              isDisabled={isInputsDisabled}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <DropdownAutocomplete
              itemList={[]}
              inputName="country"
              label={translateText(["country"])}
              value={{ label: "", value: "" }}
              placeholder={translateText(["selectCountry"])}
              onChange={() => {}}
              error={""}
              componentStyle={{
                mt: "0rem"
              }}
              isDisabled={isInputsDisabled}
              readOnly={isInputsDisabled}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputField
              label={translateText(["state"])}
              inputType="text"
              value={""}
              placeHolder={translateText(["enterState"])}
              onChange={() => {}}
              inputName="state"
              error={""}
              componentStyle={{
                flex: 1,
                mt: "0rem"
              }}
              maxLength={ADDRESS_MAX_CHARACTER_LENGTH}
              isDisabled={isInputsDisabled}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputField
              label={translateText(["postalCode"])}
              inputType="text"
              value={""}
              placeHolder={translateText(["enterPostalCode"])}
              onChange={() => {}}
              inputName="postalCode"
              error={""}
              componentStyle={{
                flex: 1,
                mt: "0rem"
              }}
              maxLength={ADDRESS_MAX_CHARACTER_LENGTH}
              isDisabled={isInputsDisabled}
            />
          </Grid>
        </Grid>
      </form>
    </PeopleFormSectionWrapper>
  );
};

export default ContactDetailsSection;
