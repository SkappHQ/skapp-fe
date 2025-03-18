import { Grid2 as Grid } from "@mui/material";
import { DateTime } from "luxon";
import { useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import DropdownAutocomplete from "~community/common/components/molecules/DropdownAutocomplete/DropdownAutocomplete";
import InputDate from "~community/common/components/molecules/InputDate/InputDate";
import InputField from "~community/common/components/molecules/InputField/InputField";
import { LONG_DATE_TIME_FORMAT } from "~community/common/constants/timeConstants";
import {
  ButtonSizes,
  ButtonStyle,
  ButtonTypes
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { convertDateToFormat } from "~community/common/utils/dateTimeUtils";
import useGetCountryList from "~community/people/hooks/useGetCountryList";

import PeopleFormSectionWrapper from "../../PeopleFormSectionWrapper/PeopleFormSectionWrapper";

interface Props {
  isInputsDisabled?: boolean;
}

const VisaDetailsSection = ({ isInputsDisabled }: Props) => {
  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "visaDetails"
  );
  const translateButtonText = useTranslator(
    "peopleModule",
    "addResource",
    "entitlementDetails"
  );

  const [rowEdited, setRowEdited] = useState(-1);
  const [selectedExpirationDate, setSelectedExpirationDate] = useState<
    DateTime | undefined
  >(undefined);
  const [selectedIssuedDate, setSelectedIssuedDate] = useState<
    DateTime | undefined
  >(undefined);

  const countryList = useGetCountryList();

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
            label={translateText(["visaType"])}
            value={""}
            placeHolder={translateText(["selectVisaType"])}
            onChange={() => {}}
            inputName="visaType"
            error={""}
            componentStyle={{
              mt: "0rem"
            }}
            maxLength={50}
            isDisabled={isInputsDisabled}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <DropdownAutocomplete
            itemList={countryList}
            inputName="issuingCountry"
            label={translateText(["issuingCountry"])}
            value={{
              label: "",
              value: ""
            }}
            placeholder={translateText(["selectIssuingCountry"])}
            onChange={() => {}}
            error={""}
            componentStyle={{
              mt: "0rem"
            }}
            isDisabled={isInputsDisabled}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <InputDate
            label={translateText(["issuedDate"])}
            value={DateTime.fromISO("")}
            onchange={() => {}}
            placeholder={translateText(["selectIssuedDate"])}
            error={""}
            maxDate={DateTime.fromISO(
              convertDateToFormat(new Date(), LONG_DATE_TIME_FORMAT)
            )}
            componentStyle={{
              mt: "0rem"
            }}
            inputFormat="dd/MM/yyyy"
            disableMaskedInput
            disabled={isInputsDisabled}
            setSelectedDate={setSelectedIssuedDate}
            selectedDate={selectedIssuedDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <InputDate
            label={translateText(["expirationDate"])}
            value={DateTime.fromISO("")}
            inputFormat="dd/MM/yyyy"
            onchange={() => {}}
            minDate={DateTime.fromISO("")}
            placeholder={translateText(["selectExpirationDate"])}
            error={""}
            componentStyle={{
              mt: "0rem"
            }}
            disableMaskedInput
            disabled={isInputsDisabled}
            setSelectedDate={setSelectedExpirationDate}
            selectedDate={selectedExpirationDate}
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
        {/* {employeeVisaDetails?.visaDetails?.length === 0 ? null : (
          <PeopleFormTable
            data={formatData(employeeVisaDetails?.visaDetails)}
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

export default VisaDetailsSection;
