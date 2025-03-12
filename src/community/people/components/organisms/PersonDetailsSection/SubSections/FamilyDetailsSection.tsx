import { Grid2 as Grid } from "@mui/material";
import { DateTime } from "luxon";
import { useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import InputDate from "~community/common/components/molecules/InputDate/InputDate";
import InputField from "~community/common/components/molecules/InputField/InputField";
import {
  ButtonSizes,
  ButtonStyle,
  ButtonTypes
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { NAME_MAX_CHARACTER_LENGTH } from "~community/people/constants/configs";
import {
  GenderList,
  RelationshipList
} from "~community/people/utils/data/employeeSetupStaticData";

import PeopleFormSectionWrapper from "../../PeopleFormSectionWrapper/PeopleFormSectionWrapper";

interface Props {
  isInputsDisabled?: boolean;
}
const FamilyDetailsSection = ({ isInputsDisabled }: Props) => {
  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "familyDetails"
  );
  const translateButtonText = useTranslator(
    "peopleModule",
    "addResource",
    "entitlementDetails"
  );

  const [rowEdited, setRowEdited] = useState(-1);
  const [relationshipList, setRelationshipList] = useState(RelationshipList);
  const [disableParentName, setDisableParentName] = useState(false);
  const [selectedDob, setSelectedDob] = useState<DateTime | undefined>(
    undefined
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
      <Grid
        container
        spacing={2}
        sx={{
          mb: "2rem"
        }}
      >
        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <InputField
            label={translateText(["firstName"])}
            inputType="text"
            value={""}
            placeHolder={translateText(["enterFirstName"])}
            onChange={() => {}}
            inputName="firstName"
            error={""}
            componentStyle={{
              flex: 1,
              mt: "0rem"
            }}
            isDisabled={isInputsDisabled}
            maxLength={NAME_MAX_CHARACTER_LENGTH}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <InputField
            label={translateText(["lastName"])}
            inputType="text"
            value={""}
            placeHolder={translateText(["enterLastName"])}
            onChange={() => {}}
            inputName="lastName"
            error={""}
            componentStyle={{
              flex: 1,
              mt: "0rem"
            }}
            isDisabled={isInputsDisabled}
            maxLength={NAME_MAX_CHARACTER_LENGTH}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <DropdownList
            inputName="gender"
            label={translateText(["gender"])}
            value={""}
            placeholder={translateText(["selectGender"])}
            onChange={() => {}}
            error={""}
            componentStyle={{
              mt: "0rem"
            }}
            isDisabled={isInputsDisabled}
            errorFocusOutlineNeeded={false}
            itemList={GenderList}
            checkSelected
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <DropdownList
            inputName="relationship"
            label={translateText(["relationship"])}
            value={""}
            placeholder={translateText(["selectRelationship"])}
            onChange={() => {}}
            error={""}
            componentStyle={{
              mt: "0rem"
            }}
            isDisabled={isInputsDisabled}
            errorFocusOutlineNeeded={false}
            itemList={relationshipList}
            checkSelected
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <InputDate
            label={translateText(["birthDate"])}
            value={DateTime.fromISO("")}
            onchange={() => {}}
            placeholder={translateText(["selectBirthDate"])}
            error={""}
            maxDate={DateTime.fromISO(new Date().toISOString())}
            componentStyle={{
              mt: "0rem"
            }}
            disabled={isInputsDisabled}
            inputFormat="dd/MM/yyyy"
            selectedDate={selectedDob}
            setSelectedDate={setSelectedDob}
          />
        </Grid>

        {disableParentName ? null : (
          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputField
              label={translateText(["parentName"])}
              inputType="text"
              value={""}
              placeHolder={translateText(["enterParentName"])}
              onChange={() => {}}
              inputName="parentName"
              error={""}
              isDisabled={isInputsDisabled}
              componentStyle={{
                flex: 1,
                mt: "0rem"
              }}
              maxLength={NAME_MAX_CHARACTER_LENGTH}
            />
          </Grid>
        )}

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          {!isInputsDisabled && (
            <Button
              isFullWidth={false}
              label={
                rowEdited > -1
                  ? translateButtonText(["saveChanges"])
                  : translateButtonText(["add"])
              }
              onClick={() => {}}
              endIcon={rowEdited > -1 ? IconName.RIGHT_MARK : IconName.ADD_ICON}
              buttonStyle={ButtonStyle.SECONDARY}
              size={ButtonSizes.MEDIUM}
              styles={{
                mt: disableParentName ? "2rem" : "1rem"
              }}
              disabled={isInputsDisabled}
              type={ButtonTypes.SUBMIT}
            />
          )}
        </Grid>
        {/* {employeeFamilyDetails?.familyMembers?.length === 0 ? null : (
          <CustomTable
            data={[]}
            actionsNeeded={true && !isInputsDisabled}
            onEdit={() => {}}
            onDelete={() => {}}
            headings={[]}
            tableStyles={{
              mt: "2rem"
            }}
          />
        )} */}
      </Grid>
    </PeopleFormSectionWrapper>
  );
};

export default FamilyDetailsSection;
