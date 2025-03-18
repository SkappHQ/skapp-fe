import { Grid2 as Grid } from "@mui/material";

import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import InputField from "~community/common/components/molecules/InputField/InputField";
import { useTranslator } from "~community/common/hooks/useTranslator";
import {
  EEOJobCategoryList,
  EthnicityList
} from "~community/people/utils/data/employeeSetupStaticData";

import PeopleFormSectionWrapper from "../../PeopleFormSectionWrapper/PeopleFormSectionWrapper";

interface Props {
  isInputsDisabled?: boolean;
}

const IdentificationDetailsSection = ({ isInputsDisabled }: Props) => {
  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "divesityDetails"
  );
  return (
    <PeopleFormSectionWrapper
      title={translateText(["title"])}
      containerStyles={{
        padding: "0",
        margin: "0 auto",
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
              label={translateText(["SSN"])}
              inputType="text"
              value={""}
              placeHolder={translateText(["enterSSN"])}
              onChange={() => {}}
              inputName="ssn"
              error={""}
              maxLength={11}
              componentStyle={{
                flex: 1,
                mt: "0rem"
              }}
              isDisabled={isInputsDisabled}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <DropdownList
              inputName="ethnicity"
              label={translateText(["ethnicity"])}
              value={""}
              placeholder={translateText(["selectEthnicity"])}
              onChange={() => {}}
              onInput={() => {}}
              error={""}
              componentStyle={{
                mt: "0rem"
              }}
              errorFocusOutlineNeeded={false}
              itemList={EthnicityList}
              checkSelected
              isDisabled={isInputsDisabled}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <DropdownList
              inputName="eeoJobCategory"
              label={translateText(["eeoJobCategory"])}
              value={""}
              placeholder={translateText(["selectEEOJobCategory"])}
              onChange={() => {}}
              onInput={() => {}}
              error={""}
              componentStyle={{
                mt: "0rem"
              }}
              checkSelected
              errorFocusOutlineNeeded={false}
              itemList={EEOJobCategoryList}
              tooltip={translateText(["eeoTooltip"])}
              isDisabled={isInputsDisabled}
            />
          </Grid>
        </Grid>
      </form>
    </PeopleFormSectionWrapper>
  );
};

export default IdentificationDetailsSection;
