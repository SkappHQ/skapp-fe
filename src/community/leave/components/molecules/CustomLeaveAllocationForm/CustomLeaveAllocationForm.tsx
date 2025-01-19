import { SelectChangeEvent, Stack } from "@mui/material";
import { FormikErrors } from "formik";
import { DateTime } from "luxon";
import React, { useEffect, useMemo, useState } from "react";

import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import Form from "~community/common/components/molecules/Form/Form";
import InputDate from "~community/common/components/molecules/InputDate/InputDate";
import InputField from "~community/common/components/molecules/InputField/InputField";
import PeopleSearch from "~community/common/components/molecules/PeopleSearch/PeopleSearch";
import { matchesNumberWithAtMostOneDecimalPlace } from "~community/common/regex/regexPatterns";
import { getEmoji } from "~community/common/utils/commonUtil";
import {
  formatDateToISO,
  getMaxDateOfYear,
  getMinDateOfYear
} from "~community/common/utils/dateTimeUtils";
import { useGetLeaveTypes } from "~community/leave/api/LeaveTypesApi";
import { LeaveDurationTypes } from "~community/leave/enums/LeaveTypeEnums";
import { useLeaveStore } from "~community/leave/store/store";
import {
  CustomLeaveAllocationModalTypes,
  CustomLeaveAllocationType
} from "~community/leave/types/CustomLeaveAllocationTypes";
import { useGetSearchedEmployees } from "~community/people/api/PeopleApi";
import { EmployeeType } from "~community/people/types/EmployeeTypes";

interface Props {
  values: CustomLeaveAllocationType;
  errors: FormikErrors<CustomLeaveAllocationType>;
  setFieldValue: (
    field: string,
    value: CustomLeaveAllocationType | number | Date | EmployeeType | string
  ) => void;
  setFieldError: (field: string, message: string | undefined) => void;
  translateText: (keys: string[]) => string;
  onSubmit: () => void;
}

const CustomLeaveAllocationForm: React.FC<Props> = ({
  values,
  errors,
  setFieldValue,
  setFieldError,
  translateText,
  onSubmit
}) => {
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [selectedValidFromDate, setSelectedValidFromDate] = useState<
    DateTime | undefined
  >(undefined);
  const [selectedValidToDate, setSelectedValidToDate] = useState<
    DateTime | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { customLeaveAllocationModalType, currentEditingLeaveAllocation } =
    useLeaveStore((state) => ({
      customLeaveAllocationModalType: state.customLeaveAllocationModalType,
      currentEditingLeaveAllocation: state.currentEditingLeaveAllocation
    }));

  useEffect(() => {
    if (
      customLeaveAllocationModalType ===
        CustomLeaveAllocationModalTypes.EDIT_LEAVE_ALLOCATION &&
      currentEditingLeaveAllocation?.assignedTo
    ) {
      const employeeName =
        `${currentEditingLeaveAllocation.assignedTo.firstName ?? ""} ${
          currentEditingLeaveAllocation.assignedTo.lastName ?? ""
        }`.trim();
      setSearchTerm(employeeName);
    }
  }, [customLeaveAllocationModalType, currentEditingLeaveAllocation]);

  useEffect(() => {
    if (
      customLeaveAllocationModalType ===
      CustomLeaveAllocationModalTypes.ADD_LEAVE_ALLOCATION
    ) {
      const employeeName = `${values.name ?? ""}`.trim();
      setSearchTerm(employeeName);
    }
  }, [customLeaveAllocationModalType, values.name]);

  const { data: leaveTypesData } = useGetLeaveTypes();

  const { data: suggestions } = useGetSearchedEmployees(
    searchTerm?.length > 0 ? searchTerm : ""
  );

  const leaveTypesDropDownList = useMemo(() => {
    return leaveTypesData !== undefined
      ? leaveTypesData.map((leaveType) => {
          const emoji = getEmoji(leaveType.emojiCode);
          return {
            value: leaveType.typeId,
            label: `${emoji} ${leaveType.name}`
          };
        })
      : [];
  }, [leaveTypesData]);

  useEffect(() => {
    if (values.employeeId && suggestions) {
      const selectedUser = suggestions.find(
        (user) => user.employeeId === values.employeeId
      );
      if (selectedUser) {
        setSearchTerm(`${selectedUser.firstName} ${selectedUser.lastName}`);
      }
    }
  }, [values.employeeId, suggestions]);

  const onSelectUser = async (user: EmployeeType): Promise<void> => {
    if (user) {
      setFieldValue("employeeId", Number(user.employeeId));
      const fullName = `${user.firstName} ${user.lastName}`.trim();
      setFieldValue("name", fullName);
      setIsPopperOpen(false);
      setSearchTerm(fullName);
    }
  };
  const handleLeaveTypeChange = (e: SelectChangeEvent<string>) => {
    const selectedValue = e.target.value;

    const selectedLeaveType = Array.isArray(leaveTypesData)
      ? (leaveTypesData.find(
          (type) =>
            (type as unknown as CustomLeaveAllocationType).typeId ===
            Number(selectedValue)
        ) as CustomLeaveAllocationType | undefined)
      : undefined;

    setFieldValue("typeId", selectedLeaveType ? selectedLeaveType.typeId : 0);
    setFieldError("typeId", undefined);
  };

  const handleNumberOfDaysOffChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const numericValue = parseFloat(value);

    const selectedLeaveType = leaveTypesData?.find(
      (leaveType) => leaveType.typeId === values.typeId
    );

    if (selectedLeaveType) {
      const { leaveDuration } = selectedLeaveType;

      if (value === "") {
        setFieldValue("numberOfDaysOff", "");
        setFieldError("numberOfDaysOff", "");
        return;
      }

      if (
        leaveDuration === LeaveDurationTypes.FULL_DAY &&
        value.includes(".")
      ) {
        setFieldValue("numberOfDaysOff", value);
        setFieldError(
          "numberOfDaysOff",
          translateText(["validNoOfDaysFullDayError"])
        );
        return;
      }
    }

    if (numericValue % 0.5 !== 0) {
      setFieldError(
        "numberOfDaysOff",
        translateText(["validNoOfDaysIncrementError"])
      );
      return;
    }

    if (
      matchesNumberWithAtMostOneDecimalPlace().test(value) &&
      numericValue <= 360
    ) {
      setFieldValue("numberOfDaysOff", value);
      setFieldError("numberOfDaysOff", "");
    } else {
      e.preventDefault();
      setFieldError(
        "numberOfDaysOff",
        numericValue > 360
          ? translateText(["validNoOfDaysUpperRangeError"])
          : translateText(["validNoOfDaysLowerRangeError"])
      );
    }
  };

  useEffect(() => {
    if (values.validFromDate) {
      const formattedValidFromDate = DateTime.fromISO(values.validFromDate);
      setSelectedValidFromDate(formattedValidFromDate);
    }
    if (values.validToDate) {
      const formattedValidToDate = DateTime.fromISO(values.validToDate);
      setSelectedValidToDate(formattedValidToDate);
    }
  }, [values.validFromDate, values.validToDate]);

  const validateDateRange = (
    validFromDate: string | undefined,
    validToDate: string | undefined
  ): boolean => {
    if (!validFromDate || !validToDate) return true;
    const validFrom = DateTime.fromISO(validFromDate);
    const validTo = DateTime.fromISO(validToDate);
    return validFrom.isValid && validTo.isValid && validFrom <= validTo;
  };

  const handleFromDateChange = async (newValue: string) => {
    const datePart = formatDateToISO(newValue);
    await setFieldValue("validFromDate", datePart);

    const validFrom = DateTime.fromISO(datePart);
    if (!validFrom.isValid) {
      setFieldError("validFromDate", translateText(["invalidDateFormat"]));
      return;
    }

    if (values.validToDate) {
      if (!validateDateRange(datePart, values.validToDate)) {
        setFieldError(
          "validFromDate",
          translateText(["fromDateMustBeBeforeToDate"])
        );
        return;
      }
    }

    setFieldError("validFromDate", undefined);
    setFieldError("validToDate", undefined);
    setSelectedValidFromDate(validFrom);
  };

  const handleToDateChange = async (newValue: string) => {
    const datePart = formatDateToISO(newValue);
    await setFieldValue("validToDate", datePart);

    const to = DateTime.fromISO(datePart);
    if (!to.isValid) {
      setFieldError("validToDate", translateText(["invalidDateFormat"]));
      return;
    }

    if (values.validFromDate) {
      if (!validateDateRange(values.validFromDate, datePart)) {
        setFieldError(
          "validToDate",
          translateText(["toDateMustBeAfterFromDate"])
        );
        return;
      }
    }

    setFieldError("validFromDate", undefined);
    setFieldError("validToDate", undefined);
    setSelectedValidToDate(to);
  };

  const isLeaveTypeSelected = !values.typeId;

  return (
    <Form onSubmit={onSubmit}>
      <PeopleSearch
        id="search-team-member-input"
        label={translateText(["leaveAllocationNameInputLabel"])}
        placeHolder={translateText(["searchEmployeePlaceholder"])}
        setIsPopperOpen={setIsPopperOpen}
        isPopperOpen={isPopperOpen}
        labelStyles={{ mb: "0.25rem" }}
        componentStyles={{ my: 2 }}
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        error={
          errors.employeeId
            ? (errors.employeeId as unknown as string)
            : undefined
        }
        required={true}
        onSelectMember={onSelectUser}
        suggestions={suggestions as EmployeeType[]}
        selectedUsers={
          (suggestions?.filter(
            (user) => user.employeeId === values.employeeId
          ) as EmployeeType[]) || ([] as EmployeeType[])
        }
        isDisabled={
          customLeaveAllocationModalType ===
          CustomLeaveAllocationModalTypes.EDIT_LEAVE_ALLOCATION
        }
      />

      <Stack spacing={2} sx={{ mt: 2 }}>
        <DropdownList
          label={translateText(["CustomLeaveAllocationTypeInputLabel"])}
          placeholder={translateText(["leaveTypePlaceholder"])}
          id="leave-allocation-type-input"
          inputName="type"
          error={errors.typeId}
          value={
            leaveTypesData?.find(
              (leaveType) => Number(leaveType.typeId) === values.typeId
            )?.typeId || ""
          }
          itemList={leaveTypesDropDownList}
          onChange={handleLeaveTypeChange}
          isDisabled={
            customLeaveAllocationModalType ===
            CustomLeaveAllocationModalTypes.EDIT_LEAVE_ALLOCATION
          }
          required
        />
        <InputField
          id="leave-allocation-number-of-days-input"
          inputName="numberOfDaysOff"
          inputType="text"
          inputProps={{
            min: 0.5,
            max: 360,
            step: 0.5
          }}
          label={translateText(["leaveAllocationNumberOfDaysInputLabel"])}
          placeHolder={translateText(["noOfDaysPlaceholder"])}
          labelStyles={{ fontWeight: 500 }}
          error={errors.numberOfDaysOff}
          value={
            values.numberOfDaysOff ? values.numberOfDaysOff.toString() : ""
          }
          onChange={handleNumberOfDaysOffChange}
          isDisabled={isLeaveTypeSelected}
          required
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="flex-start"
        gap="16px"
        justifyContent={"space-between"}
      >
        <InputDate
          label={translateText(["effectiveDate"])}
          onchange={handleFromDateChange}
          isWithHolidays
          error={errors.validFromDate}
          placeholder={translateText(["validFromDate"])}
          minDate={getMinDateOfYear()}
          maxDate={
            values.validToDate
              ? DateTime.fromISO(values.validToDate)
              : getMaxDateOfYear()
          }
          inputFormat="dd/MM/yyyy"
          disableMaskedInput
          isPreviousHolidayDisabled
          selectedDate={selectedValidFromDate}
          setSelectedDate={setSelectedValidFromDate}
        />
        <InputDate
          label={translateText(["expirationDate"])}
          onchange={handleToDateChange}
          isWithHolidays
          error={errors.validToDate}
          placeholder={translateText(["validToDate"])}
          minDate={
            values.validFromDate
              ? DateTime.fromISO(values.validFromDate)
              : getMinDateOfYear()
          }
          maxDate={getMaxDateOfYear()}
          inputFormat="dd/MM/yyyy"
          disableMaskedInput
          isPreviousHolidayDisabled
          selectedDate={selectedValidToDate}
          setSelectedDate={setSelectedValidToDate}
        />
      </Stack>
    </Form>
  );
};

export default CustomLeaveAllocationForm;
