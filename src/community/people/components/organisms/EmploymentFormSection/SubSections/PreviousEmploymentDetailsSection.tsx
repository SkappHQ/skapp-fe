import { Grid2 as Grid, useTheme } from "@mui/material";
import { DateTime } from "luxon";
import { useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import InputDate from "~community/common/components/molecules/InputDate/InputDate";
import InputField from "~community/common/components/molecules/InputField/InputField";
import { REVERSE_DATE_FORMAT } from "~community/common/constants/timeConstants";
import {
  ButtonSizes,
  ButtonStyle,
  ButtonTypes
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";

import PeopleFormSectionWrapper from "../../PeopleFormSectionWrapper/PeopleFormSectionWrapper";

interface Props {
  isInputsDisabled?: boolean;
}
const PreviousEmploymentDetailsSection = ({ isInputsDisabled }: Props) => {
  const theme = useTheme();

  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "previousEmploymentDetails"
  );
  const translateButtonText = useTranslator(
    "peopleModule",
    "addResource",
    "entitlementDetails"
  );

  const [selectedStartDate, setSelectedStartDate] = useState<
    DateTime | undefined
  >(undefined);
  const [selectedEndDate, setSelectedEndDate] = useState<DateTime | undefined>(
    undefined
  );

  const [rowEdited, setRowEdited] = useState(-1);

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
      <Grid
        container
        spacing={2}
        sx={{
          mb: "2rem"
        }}
      >
        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <InputField
            label={translateText(["companyName"])}
            inputType="text"
            value={""}
            placeHolder={translateText(["companyName"])}
            onChange={() => {}}
            inputName="companyName"
            error={""}
            componentStyle={{
              flex: 1,
              mt: "0rem"
            }}
            isDisabled={isInputsDisabled}
            maxLength={50}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <InputField
            label={translateText(["jobTitle"])}
            inputType="text"
            value={""}
            placeHolder={translateText(["jobTitle"])}
            onChange={() => {}}
            inputName="jobTitle"
            error={""}
            componentStyle={{
              flex: 1,
              mt: "0rem"
            }}
            isDisabled={isInputsDisabled}
            maxLength={50}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <InputDate
            label={translateText(["startDate"])}
            value={DateTime.fromISO("")}
            inputFormat={REVERSE_DATE_FORMAT}
            onchange={() => {}}
            placeholder={translateText(["selectStartDate"])}
            error={""}
            // maxDate={DateTime.fromISO(
            //   employeeEmploymentDetails?.joinedDate
            //     ? employeeEmploymentDetails?.joinedDate
            //     : new Date().toISOString()
            // )}
            componentStyle={{
              mt: "0rem"
            }}
            disableMaskedInput
            disabled={isInputsDisabled}
            selectedDate={selectedStartDate}
            setSelectedDate={setSelectedStartDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <InputDate
            label={translateText(["endDate"])}
            value={DateTime.fromISO("")}
            inputFormat="dd/MM/yyyy"
            onchange={() => {}}
            placeholder={translateText(["selectEndDate"])}
            error={""}
            // maxDate={DateTime.fromISO(
            //   employeeEmploymentDetails?.joinedDate
            //     ? employeeEmploymentDetails?.joinedDate
            //     : new Date().toISOString()
            // )}
            minDate={DateTime.fromISO("")}
            componentStyle={{
              mt: "0rem"
            }}
            disableMaskedInput
            disabled={isInputsDisabled}
            setSelectedDate={setSelectedEndDate}
            selectedDate={selectedEndDate}
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
              endIcon={rowEdited > -1 ? IconName.TICK_ICON : IconName.ADD_ICON}
              isFullWidth={false}
              buttonStyle={ButtonStyle.SECONDARY}
              size={ButtonSizes.MEDIUM}
              styles={{
                mt: "2rem"
              }}
              type={ButtonTypes.SUBMIT}
              disabled={isInputsDisabled}
            />
          )}
        </Grid>
        {/* {employeePreviousEmploymentDetails?.previousEmploymentDetails
          ?.length === 0 ? null : (
          <PeopleFormTable
            data={formatData(
              employeePreviousEmploymentDetails?.previousEmploymentDetails
            )}
            actionsNeeded={true && !isInputsDisabled}
            onEdit={handleEdit}
            onDelete={handleDelete}
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

export default PreviousEmploymentDetailsSection;
