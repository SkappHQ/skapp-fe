import { SelectChangeEvent } from "@mui/material";
import { useFormik } from "formik";
import { ChangeEvent, useCallback, useMemo } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import { isValidNamePattern } from "~community/common/utils/validation";
import { RelationshipTypes } from "~community/people/enums/PeopleEnums";
import useGetDefaultConuntryCode from "~community/people/hooks/useGetDefaultConuntryCode";
import { usePeopleStore } from "~community/people/store/store";
import { L3EmergencyContactType } from "~community/people/types/PeopleTypes";
import { employeeSecondaryEmergencyContactDetailsValidation } from "~community/people/utils/peopleValidations";

const useSecondaryContactDetailsFormHandlers = () => {
  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "emergencyDetails"
  );

  const countryCode = useGetDefaultConuntryCode();

  const { employee, setEmergencyDetails } = usePeopleStore((state) => state);

  const initialValues = useMemo<L3EmergencyContactType>(
    () => employee?.emergency?.secondaryEmergencyContact || {},
    [employee]
  );

  const formik = useFormik({
    initialValues,
    validationSchema:
      employeeSecondaryEmergencyContactDetailsValidation(translateText),
    onSubmit: () => {},
    validateOnChange: false,
    validateOnBlur: true,
    enableReinitialize: true
  });

  const { values, errors, handleChange, setFieldValue, setFieldError } = formik;

  const handleInput = useCallback(
    async (e: SelectChangeEvent) => {
      const { name, value } = e.target;

      if (name === "name" && isValidNamePattern(value)) {
        await setFieldValue(name, value);
        setFieldError(name, "");
        setEmergencyDetails({
          secondaryEmergencyContact: {
            ...employee?.emergency?.secondaryEmergencyContact,
            name: value
          }
        });
      } else if (name === "relationship") {
        await setFieldValue(name, value);
        setFieldError(name, "");
        setEmergencyDetails({
          secondaryEmergencyContact: {
            ...employee?.emergency?.secondaryEmergencyContact,
            relationship: value as RelationshipTypes
          }
        });
      }
    },
    [employee, setEmergencyDetails, setFieldError, setFieldValue]
  );

  const onChangeCountry = useCallback(
    async (countryCode: string): Promise<void> => {
      await setFieldValue("countryCode", countryCode);
      setFieldError("countryCode", "");
      setEmergencyDetails({
        secondaryEmergencyContact: {
          ...employee?.emergency?.secondaryEmergencyContact,
          countryCode
        }
      });
    },
    [employee, setEmergencyDetails, setFieldError, setFieldValue]
  );

  const handlePhoneNumber = useCallback(
    async (contactNo: ChangeEvent<HTMLInputElement>): Promise<void> => {
      await setFieldValue("contactNo", contactNo.target.value);
      setFieldError("contactNo", "");
      setEmergencyDetails({
        secondaryEmergencyContact: {
          ...employee?.emergency?.secondaryEmergencyContact,
          contactNo: contactNo.target.value
        }
      });

      if (!employee?.emergency?.secondaryEmergencyContact?.countryCode) {
        setFieldValue("countryCode", countryCode);
        setEmergencyDetails({
          secondaryEmergencyContact: {
            ...employee?.emergency?.secondaryEmergencyContact,
            countryCode
          }
        });
      }
    },
    [employee, countryCode, setEmergencyDetails, setFieldError, setFieldValue]
  );

  return {
    values,
    errors,
    handleChange,
    handleInput,
    onChangeCountry,
    handlePhoneNumber,
    formik
  };
};

export default useSecondaryContactDetailsFormHandlers;
