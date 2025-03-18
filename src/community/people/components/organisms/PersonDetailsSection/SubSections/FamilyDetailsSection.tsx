import { Grid2 as Grid } from "@mui/material";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import InputDate from "~community/common/components/molecules/InputDate/InputDate";
import InputField from "~community/common/components/molecules/InputField/InputField";
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
import { getLabelByValue } from "~community/common/utils/commonUtil";
import { convertDateToFormat } from "~community/common/utils/dateTimeUtils";
import { isValidNamePattern } from "~community/common/utils/validation";
import PeopleFormTable from "~community/people/components/molecules/PeopleFormTable/PeopleFormTable";
import { NAME_MAX_CHARACTER_LENGTH } from "~community/people/constants/configs";
import { MaritalStatusTypes } from "~community/people/enums/PeopleEnums";
import { usePeopleStore } from "~community/people/store/store";
import { RelationshipTypes } from "~community/people/types/AddNewResourceTypes";
import { L3FamilyDetailsType } from "~community/people/types/PeopleTypes";
import {
  GenderList,
  RelationshipList
} from "~community/people/utils/data/employeeSetupStaticData";
import { employeeFamilyDetailsValidation } from "~community/people/utils/peopleValidations";

import PeopleFormSectionWrapper from "../../PeopleFormSectionWrapper/PeopleFormSectionWrapper";

interface Props {
  isInputsDisabled?: boolean;
}
const FamilyDetailsSection = ({ isInputsDisabled }: Props) => {
  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "familyDetails"
  );
  const translateButtonText = useTranslator(
    "peopleModule",
    "addResource",
    "entitlementDetails"
  );

  const [rowEdited, setRowEdited] = useState(-1);
  const [relationshipList, setRelationshipList] = useState(RelationshipList);
  const [disableParentName, setDisableParentName] = useState(false);
  const [selectedDob, setSelectedDob] = useState<DateTime | undefined>(
    undefined
  );
  const { employee, setPersonalDetails } = usePeopleStore((state) => state);

  const initialValues = useMemo<L3FamilyDetailsType>(
    () => ({
      ...(rowEdited > -1 && employee?.personal?.family?.[rowEdited])
    }),
    [employee, rowEdited]
  );

  const tableHeaders = [
    translateText(["firstName"]),
    translateText(["lastName"]),
    translateText(["gender"]),
    translateText(["relationship"]),
    translateText(["parentName"]),
    translateText(["dateOfBirth"]),
    translateText(["age"])
  ];

  const handleEdit = (rowIndex: number) => {
    setRowEdited(rowIndex);
    const member = employee?.personal?.family?.[rowIndex];

    if (member) {
      void setFieldValue("firstName", member.firstName || "");
      void setFieldValue("lastName", member.lastName || "");
      void setFieldValue("gender", member.gender || "");
      void setFieldValue("relationship", member.relationship || "");
      void setFieldValue("parentName", member.parentName || "");
      void setFieldValue("dateOfBirth", member.dateOfBirth || "");

      if (member.dateOfBirth) {
        setSelectedDob(DateTime.fromJSDate(new Date(member.dateOfBirth)));
      } else {
        setSelectedDob(undefined);
      }
    }
  };

  const handleDelete = (rowIndex: number) => {
    const updatedMembers = [...(employee?.personal?.family || [])];
    updatedMembers.splice(rowIndex, 1);
    setPersonalDetails({
      general: employee?.personal?.general,
      family: updatedMembers
    });
    if (rowEdited === rowIndex) {
      setRowEdited(-1);
      resetForm();
      setSelectedDob(undefined);
    }
  };

  const onSubmit = (values: L3FamilyDetailsType) => {
    const familyData = {
      ...values,
      dateOfBirth: values.dateOfBirth
    };

    if (rowEdited > -1) {
      const members = [...(employee?.personal?.family || [])];
      members.splice(rowEdited, 1, {
        ...familyData,
        familyMemberId: members[rowEdited]?.familyMemberId
      });
      setPersonalDetails({
        general: employee?.personal?.general,
        family: members
      });
      setRowEdited(-1);
    } else {
      setPersonalDetails({
        general: employee?.personal?.general,
        family: [...(employee?.personal?.family || []), familyData]
      });
    }
    resetForm();
    setSelectedDob(undefined);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: employeeFamilyDetailsValidation(translateText),
    onSubmit,
    validateOnChange: false,
    enableReinitialize: true
  });

  const {
    values,
    errors,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    handleChange
  } = formik;

  const handleInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isValidNamePattern(value)) {
      await setFieldValue(name, value);
      setFieldError(name, "");
    }
  };

  const formatTableData = (data: L3FamilyDetailsType[]) => {
    if (!data) return [];

    return data.map((member) => {
      return {
        firstName: member?.firstName ?? "",
        lastName: member?.lastName ?? "",
        gender: getLabelByValue(GenderList, member?.gender as string) ?? "",
        relationship:
          getLabelByValue(RelationshipList, member?.relationship as string) ??
          "",
        parentName: member?.parentName,
        dateOfBirth: member?.dateOfBirth,
        age: member?.dateOfBirth
          ? new Date().getFullYear() -
            new Date(member.dateOfBirth).getFullYear()
          : undefined
      };
    });
  };

  const handleDateChange = async (newValue: string): Promise<void> => {
    const formattedDate = convertDateToFormat(
      new Date(newValue),
      LONG_DATE_TIME_FORMAT
    );
    await setFieldValue("dateOfBirth", formattedDate);
    setFieldError("dateOfBirth", "");
  };

  useEffect(() => {
    if (
      employee?.personal?.general?.maritalStatus == null ||
      employee?.personal?.general?.maritalStatus !== MaritalStatusTypes.MARRIED
    ) {
      setRelationshipList(
        RelationshipList.filter(
          (item) => item.value !== RelationshipTypes.SPOUSE
        )
      );
    } else {
      setRelationshipList(RelationshipList);
    }

    setDisableParentName(values.relationship === RelationshipTypes.SPOUSE);
  }, [employee?.personal?.general?.maritalStatus, values.relationship]);

  useEffect(() => {
    if (rowEdited > -1) {
      const member = employee?.personal?.family?.[rowEdited];
      if (member) {
        void setFieldValue("firstName", member.firstName || "");
        void setFieldValue("lastName", member.lastName || "");
        void setFieldValue("gender", member.gender || "");
        void setFieldValue("relationship", member.relationship || "");
        void setFieldValue("parentName", member.parentName || "");
        void setFieldValue("dateOfBirth", member.dateOfBirth || "");

        if (member.dateOfBirth) {
          setSelectedDob(DateTime.fromJSDate(new Date(member.dateOfBirth)));
        } else {
          setSelectedDob(undefined);
        }
      }
    }
  }, [rowEdited, employee?.personal?.family, setFieldValue]);

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
            label={translateText(["firstName"])}
            inputType="text"
            value={values.firstName}
            placeHolder={translateText(["enterFirstName"])}
            onChange={handleInput}
            inputName="firstName"
            error={errors.firstName ?? ""}
            componentStyle={{
              flex: 1,
              mt: "0rem"
            }}
            isDisabled={isInputsDisabled}
            maxLength={NAME_MAX_CHARACTER_LENGTH}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <InputField
            label={translateText(["lastName"])}
            inputType="text"
            value={values.lastName}
            placeHolder={translateText(["enterLastName"])}
            onChange={handleInput}
            inputName="lastName"
            error={errors.lastName ?? ""}
            componentStyle={{
              flex: 1,
              mt: "0rem"
            }}
            isDisabled={isInputsDisabled}
            maxLength={NAME_MAX_CHARACTER_LENGTH}
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
            isDisabled={isInputsDisabled}
            errorFocusOutlineNeeded={false}
            itemList={GenderList}
            checkSelected
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <DropdownList
            inputName="relationship"
            label={translateText(["relationship"])}
            value={values.relationship}
            placeholder={translateText(["selectRelationship"])}
            onChange={handleChange}
            error={errors.relationship ?? ""}
            componentStyle={{
              mt: "0rem"
            }}
            isDisabled={isInputsDisabled}
            errorFocusOutlineNeeded={false}
            itemList={relationshipList}
            checkSelected
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          <InputDate
            label={translateText(["birthDate"])}
            value={selectedDob || DateTime.fromISO("")}
            onchange={async (newValue: string) =>
              await handleDateChange(newValue)
            }
            placeholder={translateText(["selectBirthDate"])}
            error={errors.dateOfBirth ?? ""}
            maxDate={DateTime.fromISO(new Date().toISOString())}
            componentStyle={{
              mt: "0rem"
            }}
            disabled={isInputsDisabled}
            inputFormat={REVERSE_DATE_FORMAT}
            selectedDate={selectedDob}
            setSelectedDate={setSelectedDob}
          />
        </Grid>

        {disableParentName ? null : (
          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <InputField
              label={translateText(["parentName"])}
              inputType="text"
              value={values.parentName}
              placeHolder={translateText(["enterParentName"])}
              onChange={handleInput}
              inputName="parentName"
              error={errors.parentName ?? ""}
              isDisabled={isInputsDisabled}
              componentStyle={{
                flex: 1,
                mt: "0rem"
              }}
              maxLength={NAME_MAX_CHARACTER_LENGTH}
            />
          </Grid>
        )}

        <Grid size={{ xs: 12, md: 6, xl: 4 }}>
          {!isInputsDisabled && (
            <Button
              isFullWidth={false}
              label={
                rowEdited > -1
                  ? translateButtonText(["saveChanges"])
                  : translateButtonText(["add"])
              }
              onClick={() => handleSubmit()}
              endIcon={rowEdited > -1 ? IconName.RIGHT_MARK : IconName.ADD_ICON}
              buttonStyle={ButtonStyle.SECONDARY}
              size={ButtonSizes.MEDIUM}
              styles={{
                mt: disableParentName ? "2rem" : "1rem"
              }}
              disabled={isInputsDisabled}
              type={ButtonTypes.SUBMIT}
            />
          )}
        </Grid>

        {!employee.personal.family?.length ? null : (
          <PeopleFormTable
            data={formatTableData(
              employee.personal.family as L3FamilyDetailsType[]
            )}
            actionsNeeded={true && !isInputsDisabled}
            onEdit={handleEdit}
            onDelete={handleDelete}
            headings={tableHeaders}
            tableStyles={{
              mt: "2rem"
            }}
          />
        )}
      </Grid>
    </PeopleFormSectionWrapper>
  );
};

export default FamilyDetailsSection;
