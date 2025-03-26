import { Grid2 as Grid } from "@mui/material";
import { DateTime } from "luxon";
import { JSX } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import CustomTable from "~community/common/components/molecules/CustomTable/CustomTable";
import DropdownAutocomplete from "~community/common/components/molecules/DropdownAutocomplete/DropdownAutocomplete";
import InputDate from "~community/common/components/molecules/InputDate/InputDate";
import InputField from "~community/common/components/molecules/InputField/InputField";
import PeopleLayout from "~community/common/components/templates/PeopleLayout/PeopleLayout";
import {
  LONG_DATE_TIME_FORMAT,
  REVERSE_DATE_FORMAT
} from "~community/common/constants/timeConstants";
import {
  ButtonSizes,
  ButtonStyle,
  ButtonTypes
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { convertDateToFormat } from "~community/common/utils/dateTimeUtils";
import useVisaDetailsFormHandlers from "~community/people/hooks/useVisaDetailsFormHandlers";
import { usePeopleStore } from "~community/people/store/store";

interface Props {
  isInputsDisabled?: boolean;
}

const VisaDetailsSection = (props: Props): JSX.Element => {
  const { isInputsDisabled } = props;
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

  const { employee } = usePeopleStore((state) => state);

  const {
    values,
    errors,
    handleSubmit,
    handleInput,
    dateOnChange,
    handleCountrySelect,
    handleEdit,
    handleDelete,
    formatTableData,
    selectedExpirationDate,
    selectedIssuedDate,
    setSelectedExpirationDate,
    setSelectedIssuedDate,
    countryList,
    rowEdited
  } = useVisaDetailsFormHandlers();

  const tableHeaders = [
    translateText(["visaType"]),
    translateText(["issuingCountry"]),
    translateText(["issuedDate"]),
    translateText(["expirationDate"])
  ];

  return (
    <PeopleLayout
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
            value={values.visaType}
            placeHolder={translateText(["selectVisaType"])}
            onChange={handleInput}
            inputName="visaType"
            error={errors.visaType ?? ""}
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
            value={
              values.issuingCountry
                ? {
                    label: values.issuingCountry,
                    value: values.issuingCountry
                  }
                : undefined
            }
            placeholder={translateText(["selectIssuingCountry"])}
            onChange={handleCountrySelect}
            error={errors.issuingCountry ?? ""}
            componentStyle={{
              mt: "0rem"
            }}
            isDisabled={isInputsDisabled}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <InputDate
            label={translateText(["issuedDate"])}
            value={DateTime.fromISO(values.issuedDate ?? "")}
            onchange={async (newValue: string) =>
              await dateOnChange(
                "issuedDate",
                convertDateToFormat(new Date(newValue), LONG_DATE_TIME_FORMAT)
              )
            }
            placeholder={translateText(["selectIssuedDate"])}
            error={errors.issuedDate ?? ""}
            maxDate={DateTime.fromISO(
              convertDateToFormat(new Date(), LONG_DATE_TIME_FORMAT)
            )}
            componentStyle={{
              mt: "0rem"
            }}
            inputFormat={REVERSE_DATE_FORMAT}
            disableMaskedInput
            disabled={isInputsDisabled}
            setSelectedDate={setSelectedIssuedDate}
            selectedDate={selectedIssuedDate}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <InputDate
            label={translateText(["expirationDate"])}
            value={DateTime.fromISO(values.expiryDate ?? "")}
            inputFormat={REVERSE_DATE_FORMAT}
            onchange={async (newValue: string) =>
              await dateOnChange(
                "expiryDate",
                convertDateToFormat(new Date(newValue), LONG_DATE_TIME_FORMAT)
              )
            }
            minDate={DateTime.fromISO(values.issuedDate ?? "")}
            placeholder={translateText(["selectExpirationDate"])}
            error={errors.expiryDate ?? ""}
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
              onClick={() => handleSubmit()}
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
        {employee?.employment?.visaDetails?.length === 0 || employee?.employment?.visaDetails === null ? null : (
          <CustomTable
            data={formatTableData(employee?.employment?.visaDetails || [])}
            actionsNeeded={!isInputsDisabled}
            onEdit={handleEdit}
            onDelete={handleDelete}
            headings={tableHeaders}
            tableStyles={{
              mt: "2rem"
            }}
          />
        )}
      </Grid>
    </PeopleLayout>
  );
};

export default VisaDetailsSection;
