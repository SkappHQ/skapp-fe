import {
  Avatar,
  Box,
  Grid2 as Grid,
  Stack,
  type Theme,
  useTheme
} from "@mui/material";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import DropdownAutocomplete from "~community/common/components/molecules/DropdownAutocomplete/DropdownAutocomplete";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import InputDate from "~community/common/components/molecules/InputDate/InputDate";
import InputField from "~community/common/components/molecules/InputField/InputField";
import { generalDetailsSectionTestId } from "~community/common/constants/testIds";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import {
  NAME_MAX_CHARACTER_LENGTH,
  PASSPORT_AND_NIN_MAX_CHARACTER_LENGTH
} from "~community/people/constants/configs";
import {
  GenderList,
  MaritalStatusList,
  NationalityList
} from "~community/people/utils/data/employeeSetupStaticData";
import { employeeGeneralDetailsValidation } from "~community/people/utils/peopleValidations";

import PeopleFormSectionWrapper from "../../PeopleFormSectionWrapper/PeopleFormSectionWrapper";

interface Props {
  isManager?: boolean;
  isAdmin?: boolean;
  isInputsDisabled?: boolean;
}

interface FormMethods {
  validateForm: () => Promise<Record<string, string>>;
  submitForm: () => void;
  resetForm: () => void;
}

const GeneralDetailsSection = forwardRef<FormMethods, Props>(
  (
    { isManager = false, isAdmin = false, isInputsDisabled = false }: Props,
    ref
  ) => {
    const theme: Theme = useTheme();
    const translateText = useTranslator(
      "peopleModule",
      "addResource",
      "generalDetails"
    );
    const [age, setAge] = useState<number | string>(0);
    const [selectedDob, setSelectedDob] = useState<DateTime | undefined>(
      undefined
    );

    const initialValues = useMemo(
      () => ({
        authPic: "",
        thumbnail: "",
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        birthDate: null,
        nationality: "",
        nin: "",
        passportNumber: "",
        maritalStatus: "",
        country: ""
      }),

      []
    );

    const formik = useFormik({
      initialValues,
      validationSchema: employeeGeneralDetailsValidation(translateText),
      onSubmit: () => {},
      validateOnChange: false,
      validateOnBlur: true,
      enableReinitialize: true
    });

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

    const { values, errors, setFieldValue, setFieldError } = formik;

    return (
      <PeopleFormSectionWrapper
        title={translateText(["title"])}
        containerStyles={{
          padding: "0",
          margin: "0 auto",
          height: "auto",
          fontFamily: "Poppins, sans-serif"
        }}
        dividerStyles={{
          mt: "0.5rem"
        }}
        pageHead={translateText(["head"])}
      >
        <form onSubmit={() => {}}>
          <>
            <Stack
              direction="column"
              sx={{ display: isManager || isAdmin ? "none" : "block" }}
            >
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  mb: "1.5rem",
                  position: "relative"
                }}
              >
                <Avatar
                  id="avatar"
                  alt={""}
                  src={""}
                  sx={{
                    width: "6.125rem",
                    height: "6.125rem",
                    backgroundColor: theme.palette.grey[200]
                  }}
                >
                  <Icon name={IconName.USER_UPLOAD_ICON} />
                </Avatar>
                <Box>
                  {/* <input id="imageInput" {...getInputProps()} /> */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: "4.375rem",
                      top: "5rem",
                      transform: "translateY(-50%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      backgroundColor: theme.palette.secondary.main,
                      cursor: "pointer",
                      zIndex: ZIndexEnums.DEFAULT
                    }}
                    onClick={() => {}}
                  >
                    {/* {employeeGeneralDetails?.authPic?.length ? (
                    <RequestCancelCrossIcon fill={theme.palette.primary.dark} />
                  ) : (
                    <PlusIcon fill={theme.palette.primary.dark} />
                  )} */}
                  </Box>
                </Box>
              </Stack>
            </Stack>

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
                  required={!isManager}
                  readOnly={isManager}
                  isDisabled={isInputsDisabled}
                  maxLength={NAME_MAX_CHARACTER_LENGTH}
                  data-testid={
                    generalDetailsSectionTestId.InputFields.firstName
                  }
                  validation-testid={
                    generalDetailsSectionTestId.InputFields.firstNameValidation
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                <InputField
                  label={translateText(["middleName"])}
                  inputType="text"
                  value={""}
                  placeHolder={
                    !isManager ? translateText(["enterMiddleName"]) : ""
                  }
                  onChange={() => {}}
                  inputName="middleName"
                  error={""}
                  componentStyle={{
                    flex: 1,
                    mt: "0rem"
                  }}
                  readOnly={isManager}
                  isDisabled={isInputsDisabled}
                  maxLength={NAME_MAX_CHARACTER_LENGTH}
                  data-testid={
                    generalDetailsSectionTestId.InputFields.middleName
                  }
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
                  required={!isManager}
                  readOnly={isManager}
                  isDisabled={isInputsDisabled}
                  maxLength={NAME_MAX_CHARACTER_LENGTH}
                  data-testid={generalDetailsSectionTestId.InputFields.lastName}
                  validation-testid={
                    generalDetailsSectionTestId.InputFields.lastNameValidation
                  }
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
                  errorFocusOutlineNeeded={false}
                  itemList={GenderList}
                  checkSelected
                  readOnly={isManager}
                  isDisabled={isInputsDisabled}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem"
                  }}
                >
                  <InputDate
                    label={translateText(["birthDate"])}
                    value={DateTime.fromISO("")}
                    onchange={() => {}}
                    placeholder={translateText(["selectBirthDate"])}
                    error={""}
                    maxDate={DateTime.fromISO(
                      new Date()?.toISOString()?.split("T")[0]
                    )}
                    componentStyle={{
                      flex: 1,
                      mt: "0rem"
                    }}
                    inputFormat="dd/MM/yyyy"
                    disabled={isInputsDisabled}
                    readOnly={isManager}
                    selectedDate={selectedDob}
                    setSelectedDate={setSelectedDob}
                  />
                  <InputField
                    label={translateText(["age"])}
                    inputType="text"
                    value={age}
                    isDisabled={true}
                    inputName="age"
                    componentStyle={{
                      flex: 0.25,
                      mt: "0rem"
                    }}
                    labelStyles={{
                      color: theme.palette.grey.A100
                    }}
                  />
                </div>
              </Grid>

              <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                <DropdownAutocomplete
                  itemList={NationalityList}
                  inputName="nationalty"
                  label={translateText(["nationality"])}
                  value={{ label: "", value: "" }}
                  placeholder={translateText(["selectNationality"])}
                  onChange={() => {}}
                  error={""}
                  componentStyle={{
                    mt: "0rem"
                  }}
                  isDisabled={isInputsDisabled}
                  readOnly={isManager}
                />
              </Grid>

              <Grid
                size={{ xs: 12, md: 6, xl: 4 }}
                sx={{ display: isManager ? "none" : "block" }}
              >
                <InputField
                  label={translateText(["nin"])}
                  inputType="text"
                  value={""}
                  placeHolder={translateText(["enterNIN"])}
                  onChange={() => {}}
                  inputName="nin"
                  error={""}
                  componentStyle={{
                    flex: 1
                  }}
                  isDisabled={isInputsDisabled}
                  maxLength={PASSPORT_AND_NIN_MAX_CHARACTER_LENGTH}
                />
              </Grid>

              <Grid
                size={{ xs: 12, md: 6, xl: 4 }}
                sx={{ display: isManager ? "none" : "block" }}
              >
                <InputField
                  label={translateText(["passportNo"])}
                  inputType="text"
                  value={""}
                  placeHolder={translateText(["enterPassportNo"])}
                  onChange={() => {}}
                  inputName="passportNumber"
                  error={""}
                  componentStyle={{
                    flex: 1
                  }}
                  isDisabled={isInputsDisabled}
                  maxLength={PASSPORT_AND_NIN_MAX_CHARACTER_LENGTH}
                />
              </Grid>
              <Grid
                size={{ xs: 12, md: 6, xl: 4 }}
                sx={{ display: isManager ? "none" : "block" }}
              >
                <DropdownList
                  inputName="maritalStatus"
                  label={translateText(["maritalStatus"])}
                  value={""}
                  placeholder={translateText(["selectMaritalStatus"])}
                  onChange={() => {}}
                  error={""}
                  componentStyle={{
                    mt: "0rem"
                  }}
                  errorFocusOutlineNeeded={false}
                  itemList={MaritalStatusList}
                  checkSelected
                  isDisabled={isInputsDisabled}
                />
              </Grid>
              <Grid
                size={{ xs: 12, md: 6, xl: 4 }}
                sx={{ display: isManager ? "block" : "none" }}
              >
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
                  readOnly={isManager}
                />
              </Grid>
            </Grid>
          </>
        </form>
      </PeopleFormSectionWrapper>
    );
  }
);

GeneralDetailsSection.displayName = "GeneralDetailsSection";

export default GeneralDetailsSection;
