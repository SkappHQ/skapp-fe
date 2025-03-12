import { Grid2 as Grid } from "@mui/material";

import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import InputField from "~community/common/components/molecules/InputField/InputField";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { ADDRESS_MAX_CHARACTER_LENGTH } from "~community/people/constants/configs";
import { BloodGroupList } from "~community/people/utils/data/employeeSetupStaticData";

import PeopleFormSectionWrapper from "../../PeopleFormSectionWrapper/PeopleFormSectionWrapper";

interface Props {
  isInputsDisabled?: boolean;
}
const HealthAndOtherDetailsSection = ({ isInputsDisabled }: Props) => {
  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "health&OtherDetails"
  );

  return (
    <PeopleFormSectionWrapper
      title={translateText(["title"])}
      containerStyles={{
        padding: "0",
        margin: "0 auto",
        height: "auto"
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
            <DropdownList
              inputName="bloodGroup"
              label={translateText(["bloodGroup"])}
              value={""}
              placeholder={translateText(["selectBloodGroup"])}
              onChange={() => {}}
              onInput={() => {}}
              error={""}
              componentStyle={{
                mt: "0rem"
              }}
              errorFocusOutlineNeeded={false}
              itemList={BloodGroupList}
              isDisabled={isInputsDisabled}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputField
              label={translateText(["allergies"])}
              inputType="text"
              value={""}
              placeHolder={translateText(["enterAllergies"])}
              onChange={() => {}}
              inputName="allergies"
              error={""}
              componentStyle={{
                flex: 1
              }}
              maxLength={ADDRESS_MAX_CHARACTER_LENGTH}
              isDisabled={isInputsDisabled}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputField
              label={translateText(["dietaryRestrictions"])}
              inputType="text"
              value={""}
              placeHolder={translateText(["enterDietaryRestrictions"])}
              onChange={() => {}}
              inputName="dietaryRestrictions"
              error={""}
              componentStyle={{
                flex: 1
              }}
              maxLength={ADDRESS_MAX_CHARACTER_LENGTH}
              isDisabled={isInputsDisabled}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputField
              label={translateText(["tShirtSize"])}
              inputType="text"
              value={""}
              placeHolder={translateText(["enterTShirtSize"])}
              onChange={() => {}}
              inputName="tshirtSize"
              error={""}
              componentStyle={{
                flex: 1
              }}
              tooltip={translateText(["tShirtSizeTooltip"])}
              isDisabled={isInputsDisabled}
              maxLength={ADDRESS_MAX_CHARACTER_LENGTH}
            />
          </Grid>
        </Grid>
      </form>
    </PeopleFormSectionWrapper>
  );
};

export default HealthAndOtherDetailsSection;
