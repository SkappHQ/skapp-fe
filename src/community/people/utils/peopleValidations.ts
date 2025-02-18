import * as Yup from "yup";

import { characterLengths } from "~community/common/constants/stringConstants";
import {
  allowsAlphaNumericWithHyphenAndUnderscore,
  allowsLettersAndSpecialCharactersForNames,
  allowsOnlyNumbersAndOptionalDecimal,
  datePatternReverse,
  isValidAlphaNumericString,
  isValidNameWithAccentsAndApostrophes,
  isValidUrlPattern
} from "~community/common/regex/regexPatterns";
import {
  convertDateToDateTime,
  getDateFromTimeStamp
} from "~community/common/utils/dateTimeUtils";
import { LeaveDurationTypes } from "~community/leave/enums/LeaveTypeEnums";
import { LeaveEntitlementDropdownListType } from "~community/leave/types/LeaveTypes";
import { EmployeeEmploymentContextType } from "~community/people/types/EmployeeTypes";

import { ADDRESS_MAX_CHARACTER_LENGTH } from "../constants/configs";

type TranslatorFunctionType = (
  suffixes: string[],
  interpolationValues?: Record<string, string>
) => string;

export const employeePrimaryEmergencyContactDetailsValidation = (
  translator: TranslatorFunctionType
) =>
  Yup.object({
    name: Yup.string().matches(
      allowsLettersAndSpecialCharactersForNames(),
      translator(["validNameError"])
    ),
    relationship: Yup.string(),
    phone: Yup.string()
      .max(
        characterLengths.PHONE_NUMBER_LENGTH_MAX,
        translator(["validPhoneError"])
      )
      .min(
        characterLengths.PHONE_NUMBER_LENGTH_MIN,
        translator(["validPhoneError"])
      )
  });

export const employeeSecondaryEmergencyContactDetailsValidation = (
  translator: TranslatorFunctionType
) =>
  Yup.object().shape({
    name: Yup.string().matches(
      allowsLettersAndSpecialCharactersForNames(),
      translator(["validNameError"])
    ),
    relationship: Yup.string(),
    phone: Yup.string()
      .max(
        characterLengths.PHONE_NUMBER_LENGTH_MAX,
        translator(["validPhoneError"])
      )
      .min(
        characterLengths.PHONE_NUMBER_LENGTH_MIN,
        translator(["validPhoneError"])
      )
  });

export const employeeGeneralDetailsValidation = (
  translator: TranslatorFunctionType
) =>
  Yup.object({
    firstName: Yup.string()
      .required(translator(["requireFirstNameError"]))
      .max(characterLengths.NAME_LENGTH, translator(["maxCharacterLimitError"]))
      .matches(
        allowsLettersAndSpecialCharactersForNames(),
        translator(["validNameError"])
      ),
    middleName: Yup.string()
      .max(characterLengths.NAME_LENGTH, translator(["maxCharacterLimitError"]))
      .matches(
        allowsLettersAndSpecialCharactersForNames(),
        translator(["validNameError"])
      ),
    lastName: Yup.string()
      .required(translator(["requireLastNameError"]))
      .max(characterLengths.NAME_LENGTH, translator(["maxCharacterLimitError"]))
      .matches(
        allowsLettersAndSpecialCharactersForNames(),
        translator(["validNameError"])
      ),
    gender: Yup.string(),
    birthDate: Yup.date().nullable(),
    nationality: Yup.string(),
    nin: Yup.string()
      .max(
        characterLengths.NIN_LENGTH,
        translator(["maxNINCharacterLimitError"])
      )
      .matches(
        isValidAlphaNumericString(),
        translator(["validNinAndPassportError"])
      ),
    passportNumber: Yup.string()
      .max(
        characterLengths.NAME_LENGTH,
        translator(["maxPassportCharacterLimitError"])
      )
      .matches(
        isValidAlphaNumericString(),
        translator(["validNinAndPassportError"])
      ),
    maritalStatus: Yup.string()
  });

export const employeeFamilyDetailsValidation = (
  translator: TranslatorFunctionType
) =>
  Yup.object({
    firstName: Yup.string()
      .required(translator(["requireFirstNameError"]))
      .max(characterLengths.NAME_LENGTH, translator(["maxCharacterLimitError"]))
      .matches(
        allowsLettersAndSpecialCharactersForNames(),
        translator(["validNameError"])
      ),
    lastName: Yup.string()
      .required(translator(["requireLastNameError"]))
      .max(characterLengths.NAME_LENGTH, translator(["maxCharacterLimitError"]))
      .matches(
        allowsLettersAndSpecialCharactersForNames(),
        translator(["validNameError"])
      ),
    gender: Yup.string().required(translator(["requireGenderError"])),
    relationship: Yup.string().required(
      translator(["requireRelationshipError"])
    ),
    birthDate: Yup.date(),
    parentName: Yup.string()

      .max(characterLengths.NAME_LENGTH, translator(["maxCharacterLimitError"]))
      .matches(
        allowsLettersAndSpecialCharactersForNames(),
        translator(["validNameError"])
      )
  });

export const employeeEducationalDetailsValidation = (
  translator: TranslatorFunctionType
) =>
  Yup.object({
    institutionName: Yup.string().required(
      translator(["requireInstitutionError"])
    ),
    degree: Yup.string(),
    major: Yup.string(),
    startDate: Yup.date(),
    endDate: Yup.date()
  });

export const employeeSocialMediaDetailsValidation = (
  translator: TranslatorFunctionType
) =>
  Yup.object({
    linkedIn: Yup.string().matches(
      isValidUrlPattern(),
      translator(["validUrlError"])
    ),
    x: Yup.string().matches(isValidUrlPattern(), translator(["validUrlError"])),
    facebook: Yup.string().matches(
      isValidUrlPattern(),
      translator(["validUrlError"])
    ),
    instagram: Yup.string().matches(
      isValidUrlPattern(),
      translator(["validUrlError"])
    )
  });

export const employeeHealthAndOtherDetailsValidation = Yup.object({
  bloodGroup: Yup.string(),
  allergies: Yup.string(),
  dietaryRestrictions: Yup.string(),
  tshirtSize: Yup.string()
});

export const employeeEmploymentDetailsValidation = (
  context: EmployeeEmploymentContextType,
  translator: TranslatorFunctionType
) => {
  return Yup.object({
    employeeNumber: Yup.string()
      .trim()
      .max(
        characterLengths.EMPLOYEE_ID_LENGTH,
        translator(["maxCharacterLimitError"])
      )
      .matches(
        allowsAlphaNumericWithHyphenAndUnderscore(),
        translator(["validEmployeeNoError"])
      )
      .test(
        "is-unique-emp-no",
        translator(["uniqueEmployeeNoError"]),
        function () {
          return context?.isUniqueEmployeeNo;
        }
      ),
    workEmail: Yup.string()
      .trim()
      .email(translator(["validEmailError"]))
      .required(translator(["requireEmailError"]))
      .test("is-unique-email", translator(["uniqueEmailError"]), function () {
        return context?.isUniqueEmail || context?.isUpdate;
      }),
    employmentAllocation: Yup.string(),
    teams: Yup.array(),
    joinedDate: Yup.date(),
    probationStartDate: Yup.date()
      .test(
        "is-valid",
        translator(["requireProbationStartDateError"]),
        function (value) {
          const endDate = this.parent.probationEndDate;
          if (endDate && !value) {
            return false;
          }
          return true;
        }
      )
      .test(
        "is-before-end",
        translator(["probationStartDateBeforeEndDateError"]),
        function (value) {
          const endDate = this.parent.probationEndDate;
          if (value && endDate) {
            return new Date(value) < new Date(endDate);
          }
          return true;
        }
      ),
    probationEndDate: Yup.date()
      .test(
        "is-valid",
        translator(["requireProbationEndDateError"]),
        function (value) {
          const startDate = this.parent.probationStartDate;
          if (startDate && !value) {
            return false;
          }
          return true;
        }
      )
      .test(
        "is-not-same",
        translator(["probationEndDateSameAsStartDateError"]),
        function (value) {
          const startDate = new Date(this.parent.probationStartDate);
          return !(
            startDate &&
            value &&
            startDate.getTime() === value.getTime()
          );
        }
      )
      .test(
        "is-after-start",
        translator(["probationEndDateAfterStartDateError"]),
        function (value) {
          const startDate = this.parent.probationStartDate;
          if (startDate && value) {
            return new Date(value) > new Date(startDate);
          }
          return true;
        }
      ),
    workTimeZone: Yup.string()
  });
};

export const employeeCareerDetailsValidation = (
  translator: TranslatorFunctionType
) =>
  Yup.object({
    employeeType: Yup.string().required(
      translator(["requireEmploymentTypeError"])
    ),
    jobFamily: Yup.string().required(translator(["requireJobFamilyError"])),
    jobTitle: Yup.string().required(translator(["requireJobTitleError"])),
    startDate: Yup.date().required(translator(["requireStartDateError"])),
    endDate: Yup.date()
      .nullable()
      .test("endDate", translator(["requireEndDateError"]), function (value) {
        const currentPosition = this.parent.currentPosition;
        return !currentPosition ? !!value : true;
      })
      .test(
        "is-valid",
        translator(["endDateSameAsStartDateError"]),
        function (value) {
          const startDate = new Date(this.parent.startDate);
          return !(
            startDate &&
            value &&
            startDate.getTime() === value.getTime()
          );
        }
      )
      .test(
        "is-greater",
        translator(["endDateBeforeStartDateError"]),
        function (value) {
          const startDate = new Date(this.parent.startDate);
          return !(startDate && value && startDate.getTime() > value.getTime());
        }
      ),
    currentPosition: Yup.boolean()
  });

export const employeeIdentificationDetailsValidation = (
  translator: TranslatorFunctionType
) =>
  Yup.object({
    ssn: Yup.string().max(20, translator(["maxSSNCharacterLimitError"])),
    ethnicity: Yup.string(),
    eeoJobCategory: Yup.string()
  });

export const employeePreviousEmploymentDetailsValidation = (
  translator: TranslatorFunctionType
) =>
  Yup.object({
    companyName: Yup.string().required(translator(["requireCompanyNameError"])),
    jobTitle: Yup.string().required(translator(["requireJobTitleError"])),
    startDate: Yup.date().required(translator(["requireStartDateError"])),
    endDate: Yup.date()
      .required(translator(["requireEndDateError"]))
      .test(
        "is-valid",
        translator(["endDateSameAsStartDateError"]),
        function (value) {
          const startDate = new Date(this.parent.startDate);
          return !(
            startDate &&
            value &&
            startDate.getTime() === value.getTime()
          );
        }
      )
  });

export const employeeVisaDetailsValidation = (
  translator: TranslatorFunctionType
) =>
  Yup.object({
    visaType: Yup.string().required(translator(["requireVisaTypeError"])),
    issuingCountry: Yup.string().required(translator(["requireCountryError"])),
    issuedDate: Yup.date().required(translator(["requireIssuedDateError"])),
    expirationDate: Yup.date()
      .required(translator(["requireExpirationDateError"]))
      .test(
        "is-valid",
        translator(["endDateSameAsStartDateError"]),
        function (value) {
          const startDate = new Date(this.parent.issuedDate);
          return !(
            startDate &&
            value &&
            startDate.getTime() === value.getTime()
          );
        }
      )
  });

export const employeeEntitlementsDetailsValidation = (
  leaveTypesList: LeaveEntitlementDropdownListType[],
  translator: TranslatorFunctionType
) =>
  Yup.object({
    year: Yup.string().required(translator(["validationErrors.yearRequired"])),
    leaveType: Yup.string().required(
      translator(["validationErrors.leaveTypeRequired"])
    ),
    numDays: Yup.number()
      .required(translator(["validationErrors.numberOfDaysRequired"]))
      .max(365, translator(["validationErrors.maxNumOfDaysExceeded"]))
      .min(0.5, translator(["validationErrors.validNumberOfDays"]))
      .test(
        "isValidDuration",
        translator(["validationErrors.invalidDuration"]),
        (value, context) => {
          const { leaveType } = context?.parent ?? "";
          const leaveTypeData = leaveTypesList?.find((item) => {
            return parseInt(item?.value as string) === parseInt(leaveType);
          });

          return leaveTypeData?.leaveDuration === LeaveDurationTypes.FULL_DAY
            ? value % 1 === 0
            : true;
        }
      )
      .test(
        "isValidFraction",
        translator(["validationErrors.invalidFractionPoint"]),
        (value) => {
          return allowsOnlyNumbersAndOptionalDecimal().test(String(value));
        }
      ),
    effectiveFrom: Yup.string()
      .required(translator(["validationErrors.effectiveFromRequired"]))
      .test(
        "is-valid",
        translator(["validationErrors.invalidDate"]),
        function (value) {
          return validateDate(value);
        }
      ),
    expirationDate: Yup.string()
      .test(
        "is-valid",
        translator(["validationErrors.invalidDate"]),
        function (value) {
          if (!value) return true;
          return validateDate(value);
        }
      )
      .test(
        "is-effective-date-less-than-expiration-date",
        translator(["validationErrors.invalidDateRange"]),
        function (value) {
          return !(
            this.parent.effectiveFrom &&
            value &&
            convertDateToDateTime(new Date(this.parent.effectiveFrom)) >=
              convertDateToDateTime(new Date(value))
          );
        }
      )
  });

const validateDate = (date: string): boolean => {
  if (date.includes("Invalid DateTime")) {
    return false;
  } else {
    return datePatternReverse().test(getDateFromTimeStamp(date));
  }
};

export const employeeContactDetailsValidation = (
  translator: TranslatorFunctionType
) =>
  Yup.object({
    personalEmail: Yup.string()
      .trim()
      .email(translator(["validEmailError"])),
    phone: Yup.string()
      .max(
        characterLengths.PHONE_NUMBER_LENGTH_MAX,
        translator(["validContactNumberError"])
      )
      .min(
        characterLengths.PHONE_NUMBER_LENGTH_MIN,
        translator(["validContactNumberError"])
      ),
    addressLine1: Yup.string(),
    addressLine2: Yup.string(),
    city: Yup.string().max(
      ADDRESS_MAX_CHARACTER_LENGTH,
      translator(["maxCharacterCityLimitError"])
    ),
    country: Yup.string(),
    state: Yup.string().max(
      ADDRESS_MAX_CHARACTER_LENGTH,
      translator(["maxCharacterLimitStateError"])
    ),
    postalCode: Yup.string().matches(
      isValidAlphaNumericString(),
      translator(["validPostalCodeError"])
    )
  });

export const quickAddEmployeeValidations = (
  translator: TranslatorFunctionType
) =>
  Yup.object({
    firstName: Yup.string()
      .required(translator(["requireFirstNameError"]))
      .max(characterLengths.NAME_LENGTH, translator(["maxCharacterLimitError"]))
      .matches(
        isValidNameWithAccentsAndApostrophes(),
        translator(["validNameError"])
      ),
    lastName: Yup.string()
      .required(translator(["requireLastNameError"]))
      .max(characterLengths.NAME_LENGTH, translator(["maxCharacterLimitError"]))
      .matches(
        isValidNameWithAccentsAndApostrophes(),
        translator(["validNameError"])
      ),
    workEmail: Yup.string()
      .trim()
      .email(translator(["validEmailError"]))
      .required(translator(["requireEmailError"]))
  });
