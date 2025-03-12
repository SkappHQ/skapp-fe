import { Grid2 as Grid } from "@mui/material";

import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import InputField from "~community/common/components/molecules/InputField/InputField";
import InputPhoneNumber from "~community/common/components/molecules/InputPhoneNumber/InputPhoneNumber";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { EmergencyContactRelationshipList } from "~community/people/utils/data/employeeSetupStaticData";

import PeopleFormSectionWrapper from "../../PeopleFormSectionWrapper/PeopleFormSectionWrapper";

interface Props {
  isManager?: boolean;
  isInputsDisabled?: boolean;
}
const PrimaryContactDetailsSection = ({
  isManager,
  isInputsDisabled
}: Props) => {
  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "emergencyDetails"
  );

  return (
    <PeopleFormSectionWrapper
      title={translateText(["primaryTitle"])}
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
      <form onSubmit={() => {}}>
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
              value={""}
              placeHolder={translateText(["enterName"])}
              onInput={() => {}}
              inputName="name"
              error={""}
              maxLength={50}
              componentStyle={{
                flex: 1,
                mt: "0rem"
              }}
              readOnly={isManager || isInputsDisabled}
              isDisabled={isInputsDisabled}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <DropdownList
              inputName="relationship"
              label={translateText(["relationship"])}
              value={""}
              placeholder={translateText(["selectRelationship"])}
              onChange={() => {}}
              onInput={() => {}}
              error={""}
              componentStyle={{
                mt: "0rem"
              }}
              errorFocusOutlineNeeded={false}
              checkSelected={true}
              itemList={EmergencyContactRelationshipList}
              readOnly={isManager || isInputsDisabled}
              isDisabled={isInputsDisabled}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputPhoneNumber
              label={translateText(["contactNo"])}
              value={""}
              countryCodeValue={""}
              placeHolder={translateText(["enterContactNo"])}
              onChangeCountry={async (countryCode: string) => {}}
              onChange={async (phone) => {}}
              error={""}
              inputName="phone"
              fullComponentStyle={{
                mt: "0rem"
              }}
              readOnly={isManager || isInputsDisabled}
              isDisabled={isManager || isInputsDisabled}
            />
          </Grid>
        </Grid>
      </form>
    </PeopleFormSectionWrapper>
  );
};

export default PrimaryContactDetailsSection;
