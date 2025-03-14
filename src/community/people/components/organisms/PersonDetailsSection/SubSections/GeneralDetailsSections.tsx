import {
  Grid2 as Grid,
  SelectChangeEvent,
  Stack,
  type Theme,
  useTheme
} from "@mui/material";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import {
  SyntheticEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from "react";

import DropdownAutocomplete from "~community/common/components/molecules/DropdownAutocomplete/DropdownAutocomplete";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import InputDate from "~community/common/components/molecules/InputDate/InputDate";
import InputField from "~community/common/components/molecules/InputField/InputField";
import { generalDetailsSectionTestId } from "~community/common/constants/testIds";
import { LONG_DATE_TIME_FORMAT } from "~community/common/constants/timeConstants";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { isValidAlphaNumericName } from "~community/common/regex/regexPatterns";
import { DropdownListType } from "~community/common/types/CommonTypes";
import { convertDateToFormat } from "~community/common/utils/dateTimeUtils";
import { isValidNamePattern } from "~community/common/utils/validation";
import {
  NAME_MAX_CHARACTER_LENGTH,
  PASSPORT_AND_NIN_MAX_CHARACTER_LENGTH
} from "~community/people/constants/configs";
import { FormMethods } from "~community/people/types/PeopleEditTypes";
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

    // Need get data from the store

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
        maritalStatus: ""
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
    const { values, errors, setFieldValue, setFieldError } = formik;

    const [age, setAge] = useState<number | string>(0);
    const [selectedDob, setSelectedDob] = useState<DateTime | undefined>(
      undefined
    );

    useEffect(() => {
      if (values.birthDate) {
        const birthDateTime = DateTime.fromISO(values.birthDate);
        setSelectedDob(birthDateTime);

        const birthDate = new Date(values.birthDate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        setAge(age);
      } else {
        setAge("-");
        setSelectedDob(undefined);
      }
    }, [values.birthDate]);

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

    const handleChange = async (e: SelectChangeEvent) => {
      const { name, value } = e.target;
      if (
        (name === "firstName" ||
          name === "middleName" ||
          name === "lastName") &&
        isValidNamePattern(value)
      ) {
        await setFieldValue(name, value);
        setFieldError(name, "");
        setEmployeeGeneralDetails(name, value);
      } else if (
        (name === "passportNumber" || name === "nin") &&
        (value === "" || isValidAlphaNumericName().test(value))
      ) {
        await setFieldValue(name, value);
        setFieldError(name, "");
        setEmployeeGeneralDetails(name, value);
      } else {
        await setFieldValue(e.target.name, e.target.value);
        setFieldError(e.target.name, "");
        setEmployeeGeneralDetails(e.target.name, e.target.value);
      }
    };

    const dateOnChange = async (
      fieldName: string,
      newValue: string
    ): Promise<void> => {
      if (fieldName && newValue) {
        const dateValue = newValue?.split("T")?.[0] ?? "";
        if (dateValue !== undefined) {
          await setFieldValue(fieldName, dateValue);
          setEmployeeGeneralDetails(fieldName, dateValue);
        }

        setFieldError(fieldName, "");
      }
    };

    const handleNationalitySelect = async (
      _e: SyntheticEvent<Element, Event>,
      value: DropdownListType
    ): Promise<void> => {
      setFieldError("nationality", "");
      await setFieldValue("nationality", value.value);
      setEmployeeGeneralDetails("nationality", value.value as string);
    };
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
                    value={DateTime.fromISO(values?.birthDate || "")}
                    onchange={(newValue: string | null) => {
                      if (newValue) {
                        dateOnChange(
                          "birthDate",
                          (convertDateToFormat(
                            new Date(newValue as string),
                            LONG_DATE_TIME_FORMAT
                          ) as string) ?? ""
                        );
                      }
                    }}
                    placeholder={translateText(["selectBirthDate"])}
                    error={errors?.birthDate ?? ""}
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
                    label: values.nationality,
                    value: values.nationality
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

function setEmployeeGeneralDetails(name: string, value: string) {
  throw new Error("Function not implemented.");
}
