import { Grid2 as Grid } from "@mui/material";
import { DateTime } from "luxon";
import { useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import InputDate from "~community/common/components/molecules/InputDate/InputDate";
import InputField from "~community/common/components/molecules/InputField/InputField";
import {
  ButtonSizes,
  ButtonStyle,
  ButtonTypes
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { ADDRESS_MAX_CHARACTER_LENGTH } from "~community/people/constants/configs";

import PeopleFormSectionWrapper from "../../PeopleFormSectionWrapper/PeopleFormSectionWrapper";

interface Props {
  isInputsDisabled?: boolean;
}

const EducationalDetailsSection = ({ isInputsDisabled }: Props) => {
  const [selectedStartDate, setSelectedStartDate] = useState<
    DateTime | undefined
  >(undefined);
  const [selectedEndDate, setSelectedEndDate] = useState<DateTime | undefined>(
    undefined
  );
  const [rowEdited, setRowEdited] = useState(-1);

  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "educationDetails"
  );
  const translateButtonText = useTranslator(
    "peopleModule",
    "addResource",
    "entitlementDetails"
  );

  const tableHeaders = [
    translateText(["college"]),
    translateText(["degree"]),
    translateText(["major"]),
    translateText(["startDate"]),
    translateText(["endDate"])
  ];

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
            label={translateText(["college"])}
            inputType="text"
            value={""}
            placeHolder={translateText(["enterCollege"])}
            onChange={() => {}}
            inputName="institutionName"
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
            label={translateText(["degree"])}
            inputType="text"
            value={""}
            placeHolder={translateText(["enterDegree"])}
            onChange={() => {}}
            inputName="degree"
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
            label={translateText(["major"])}
            inputType="text"
            value={""}
            placeHolder={translateText(["enterMajor"])}
            onChange={() => {}}
            inputName="major"
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
          <InputDate
            label={translateText(["startDate"])}
            value={DateTime.fromISO("")}
            onchange={() => {}}
            placeholder={translateText(["selectStartDate"])}
            error={""}
            componentStyle={{
              mt: "0rem"
            }}
            maxDate={DateTime.fromISO(new Date().toISOString())}
            disabled={isInputsDisabled}
            inputFormat="dd/MM/yyyy"
            selectedDate={selectedStartDate}
            setSelectedDate={setSelectedStartDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <InputDate
            label={translateText(["endDate"])}
            value={DateTime.fromISO("")}
            onchange={() => {}}
            placeholder={translateText(["selectEndDate"])}
            error={""}
            minDate={DateTime.fromISO("")}
            disabled={isInputsDisabled}
            componentStyle={{
              mt: "0rem"
            }}
            inputFormat="dd/MM/yyyy"
            selectedDate={selectedEndDate}
            setSelectedDate={setSelectedEndDate}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          {!isInputsDisabled && (
            <Button
              label={
                rowEdited > -1
                  ? translateButtonText(["saveChanges"])
                  : translateButtonText(["add"])
              }
              onClick={() => {}}
              endIcon={rowEdited > -1 ? IconName.SAVE_ICON : IconName.ADD_ICON}
              isFullWidth={false}
              buttonStyle={ButtonStyle.SECONDARY}
              size={ButtonSizes.MEDIUM}
              styles={{
                mt: "2rem"
              }}
              disabled={isInputsDisabled}
              type={ButtonTypes.SUBMIT}
            />
          )}
        </Grid>
        {/* {employeeEducationalDetails?.educationalDetails?.length === 0 ? null : (
          <CustomTable
            data={[]}
            actionsNeeded={true && !isInputsDisabled}
            onEdit={() => {}}
            onDelete={() => {}}
            headings={tableHeaders}
            tableStyles={{
              mt: "2rem"
            }}
          />
        )} */}
      </Grid>
    </PeopleFormSectionWrapper>
  );
};

export default EducationalDetailsSection;
