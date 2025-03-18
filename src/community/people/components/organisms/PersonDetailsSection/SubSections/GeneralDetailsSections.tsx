import {
  Grid2 as Grid,
  Stack,
  type Theme,
  useTheme
} from "@mui/material";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import {
  forwardRef,
  useImperativeHandle,
  useMemo
} from "react";

import DropdownAutocomplete from "~community/common/components/molecules/DropdownAutocomplete/DropdownAutocomplete";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import InputDate from "~community/common/components/molecules/InputDate/InputDate";
import InputField from "~community/common/components/molecules/InputField/InputField";
import { generalDetailsSectionTestId } from "~community/common/constants/testIds";
import { useTranslator } from "~community/common/hooks/useTranslator";
import {
  NAME_MAX_CHARACTER_LENGTH,
  PASSPORT_AND_NIN_MAX_CHARACTER_LENGTH
} from "~community/people/constants/configs";
import { usePeopleStore } from "~community/people/store/store";
import { FormMethods } from "~community/people/types/PeopleEditTypes";
import { L3GeneralDetailsType } from "~community/people/types/PeopleTypes";
import {
  GenderList,
  MaritalStatusList,
  NationalityList
} from "~community/people/utils/data/employeeSetupStaticData";
import { employeeGeneralDetailsValidation } from "~community/people/utils/peopleValidations";

import PeopleFormSectionWrapper from "../../PeopleFormSectionWrapper/PeopleFormSectionWrapper";
import useGeneralDetailsFormHandlers from "~community/people/hooks/useGeneralDetailsFormHandlers";

interface Props {
  isManager?: boolean;
  isAdmin?: boolean;
  isInputsDisabled?: boolean;
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

    const { employee } = usePeopleStore((state) => state);

    const initialValues = useMemo<L3GeneralDetailsType>(
      () => employee?.personal?.general,
      [employee]
    );

    const formik = useFormik({
      initialValues,
      validationSchema: employeeGeneralDetailsValidation(translateText),
      onSubmit: () => {},
      validateOnChange: false,
      validateOnBlur: true,
      enableReinitialize: true
    });

    const {
      handleChange,
      handleNationalitySelect,
      handleDateChange,
      age,
      selectedDob,
      setSelectedDob
    } = useGeneralDetailsFormHandlers({ formik });

    const { values, errors } = formik;

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
        <form onSubmit={formik.handleSubmit}>
          <>
            <Stack
              direction="column"
              sx={{ display: isManager || isAdmin ? "none" : "block" }}
            >
              {/* <Stack
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
                  <input id="imageInput" {...getInputProps()} />
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
                    {employeeGeneralDetails?.authPic?.length ? (
                    <RequestCancelCrossIcon fill={theme.palette.primary.dark} />
                  ) : (
                    <PlusIcon fill={theme.palette.primary.dark} />
                  )}
                  </Box>
                </Box>
              </Stack> */}
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
                  value={values.firstName}
                  placeHolder={translateText(["enterFirstName"])}
                  onChange={handleChange}
                  inputName="firstName"
                  error={errors.firstName ?? ""}
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
                  value={values.middleName}
                  placeHolder={
                    !isManager ? translateText(["enterMiddleName"]) : ""
                  }
                  onChange={handleChange}
                  inputName="middleName"
                  error={errors.middleName ?? ""}
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
                  value={values.lastName}
                  placeHolder={translateText(["enterLastName"])}
                  onChange={handleChange}
                  inputName="lastName"
                  error={errors.lastName ?? ""}
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
                  value={values.gender}
                  placeholder={translateText(["selectGender"])}
                  onChange={handleChange}
                  error={errors.gender ?? ""}
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
                    value={
                      values?.dateOfBirth
                        ? DateTime.fromJSDate(values.dateOfBirth)
                        : undefined
                    }
                    onchange={handleDateChange}
                    placeholder={translateText(["selectBirthDate"])}
                    error={errors?.dateOfBirth ?? ""}
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
                  inputName="nationality"
                  label={translateText(["nationality"])}
                  value={{
                    label: values.nationality as string,
                    value: values.nationality as string
                  }}
                  placeholder={translateText(["selectNationality"])}
                  onChange={handleNationalitySelect}
                  error={errors.nationality ?? ""}
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
                  value={values.nin}
                  placeHolder={translateText(["enterNIN"])}
                  onChange={handleChange}
                  inputName="nin"
                  error={errors.nin ?? ""}
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
                  value={values.passportNumber}
                  placeHolder={translateText(["enterPassportNo"])}
                  onChange={handleChange}
                  inputName="passportNumber"
                  error={errors.passportNumber ?? ""}
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
                  value={values.maritalStatus}
                  placeholder={translateText(["selectMaritalStatus"])}
                  onChange={handleChange}
                  error={errors.maritalStatus ?? ""}
                  componentStyle={{
                    mt: "0rem"
                  }}
                  errorFocusOutlineNeeded={false}
                  itemList={MaritalStatusList}
                  checkSelected
                  isDisabled={isInputsDisabled}
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
