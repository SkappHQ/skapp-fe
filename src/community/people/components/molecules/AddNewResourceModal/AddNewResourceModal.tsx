import { Divider, Stack, Theme, Typography, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import SwitchRow from "~community/common/components/atoms/SwitchRow/SwitchRow";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import InputField from "~community/common/components/molecules/InputField/InputField";
import ROUTES from "~community/common/constants/routes";
import { peopleDirectoryTestId } from "~community/common/constants/testIds";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { useGetAllowedGrantablePermissions } from "~community/configurations/api/userRolesApi";
import {
  useCheckEmailAndIdentificationNoForQuickAdd,
  useQuickAddEmployeeMutation
} from "~community/people/api/PeopleApi";
import { usePeopleStore } from "~community/people/store/store";
import {
  QuickAddEmployeePayload,
  Role
} from "~community/people/types/EmployeeTypes";
import { DirectoryModalTypes } from "~community/people/types/ModalTypes";
import { quickAddEmployeeValidations } from "~community/people/utils/peopleValidations";

const AddNewResourceModal = () => {
  const theme: Theme = useTheme();

  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "generalDetails"
  );

  const employmentDetailsTexts = useTranslator(
    "peopleModule",
    "addResource",
    "employmentDetails"
  );

  const generalTexts = useTranslator(
    "peopleModule",
    "addResource",
    "commonText"
  );

  const permissionTexts = useTranslator(
    "peopleModule",
    "addResource",
    "systemPermissions"
  );

  const router = useRouter();
  const initialValues = {
    firstName: "",
    lastName: "",
    workEmail: "",
    isSuperAdmin: false,
    peopleRole: Role.PEOPLE_EMPLOYEE,
    leaveRole: Role.LEAVE_EMPLOYEE,
    attendanceRole: Role.ATTENDANCE_EMPLOYEE
  };

  const { mutate } = useQuickAddEmployeeMutation();
  const onSubmit = async (values: any) => {
    const payload: QuickAddEmployeePayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      workEmail: values.workEmail,
      userRoles: {
        isSuperAdmin: values.isSuperAdmin,
        attendanceRole: values.attendanceRole,
        peopleRole: values.peopleRole,
        leaveRole: values.leaveRole
      }
    };

    mutate(payload);
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema: quickAddEmployeeValidations(translateText),
    validateOnChange: false,
    validateOnBlur: true
  });

  const { values, errors, handleChange, setFieldValue, handleSubmit } = formik;
  const { setDirectoryModalType, setIsDirectoryModalOpen } = usePeopleStore(
    (state) => state
  );

  const {
    data: checkEmailAndIdentificationNo,
    refetch,
    isSuccess
  } = useCheckEmailAndIdentificationNoForQuickAdd(values.workEmail, "");

  const closeModal = () => {
    setDirectoryModalType(DirectoryModalTypes.NONE);
    setIsDirectoryModalOpen(false);
  };

  const { data: grantablePermission } = useGetAllowedGrantablePermissions();

  useEffect(() => {
    const updatedData = checkEmailAndIdentificationNo;

    if (updatedData && updatedData.isWorkEmailExists !== null && isSuccess) {
      if (updatedData.isWorkEmailExists) {
        formik.setFieldError("workEmail", translateText(["uniqueEmailError"]));
      } else if (!updatedData.isWorkEmailExists) {
        handleSubmit();
      }
    }
  }, [checkEmailAndIdentificationNo, isSuccess]);

  return (
    <Stack>
      <Stack
        sx={{
          flexDirection: "row",
          gap: 2,
          marginTop: 4
        }}
      >
        <InputField
          inputName="firstName"
          value={values.firstName}
          error={errors.firstName}
          label="First Name"
          required
          onChange={handleChange}
          placeHolder={translateText(["enterFirstName"])}
        />
        <InputField
          inputName="lastName"
          value={values.lastName}
          error={errors.firstName}
          label="Last Name"
          required
          placeHolder={translateText(["enterLastName"])}
          onChange={handleChange}
        />
      </Stack>
      <InputField
        inputName="workEmail"
        value={values.workEmail}
        error={errors.workEmail}
        label="Work email"
        placeHolder={employmentDetailsTexts(["enterWorkEmail"])}
        required
        onChange={handleChange}
        componentStyle={{
          marginTop: 2
        }}
      />

      <Button
        isFullWidth={false}
        size={ButtonSizes.MEDIUM}
        buttonStyle={ButtonStyle.TERTIARY}
        label={"Add full profile"}
        styles={{
          marginTop: 2
        }}
        endIcon={
          <Icon
            name={IconName.FORWARD_ARROW}
            width="0.75rem"
            height="0.625rem"
          />
        }
        onClick={() => {
          setDirectoryModalType(DirectoryModalTypes.NONE);
          setIsDirectoryModalOpen(false);
          router.push(ROUTES.PEOPLE.ADD_NEW_RESOURCE);
        }}
        data-testid={peopleDirectoryTestId.buttons.addFullProfileBtn}
      />

      <Stack
        style={{
          marginTop: 24
        }}
      >
        <Typography
          style={{
            fontWeight: "700"
          }}
        >
          {generalTexts(["systemPermissions"])}
        </Typography>
        <Divider
          sx={{
            marginY: 2
          }}
        />

        <Stack>
          <Stack
            direction={"row"}
            gap={6}
            marginTop={2}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} gap={3}>
              <Typography
                sx={{
                  fontWeight: "500"
                }}
              >
                {permissionTexts(["superAdmin"])}
              </Typography>
              <Icon name={IconName.SUPER_ADMIN_ICON} />
            </Stack>

            <Stack>
              <SwitchRow
                checked={values.isSuperAdmin}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setFieldValue("isSuperAdmin", isChecked);

                  const updatedRole = isChecked
                    ? Role.PEOPLE_ADMIN
                    : Role.PEOPLE_EMPLOYEE;
                  const updatedLeaveRole = isChecked
                    ? Role.LEAVE_ADMIN
                    : Role.LEAVE_EMPLOYEE;
                  const updatedAttendanceRole = isChecked
                    ? Role.ATTENDANCE_ADMIN
                    : Role.ATTENDANCE_EMPLOYEE;

                  setFieldValue("peopleRole", updatedRole);
                  setFieldValue("leaveRole", updatedLeaveRole);
                  setFieldValue("attendanceRole", updatedAttendanceRole);
                }}
              />
            </Stack>
          </Stack>

          <Stack direction={"column"} gap={1} marginTop={2}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography
                sx={{
                  fontWeight: "500"
                }}
              >
                {permissionTexts(["people"])}
              </Typography>
              <DropdownList
                inputName={"peopleRole"}
                itemList={grantablePermission?.people || []}
                value={values.peopleRole}
                componentStyle={{
                  width: "200px",
                  borderRadius: "100px",
                  height: "50px"
                }}
                paperStyles={{
                  width: "200px",
                  borderRadius: "100px"
                }}
                onChange={handleChange}
                isDisabled={values.isSuperAdmin}
              />
            </Stack>

            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography
                sx={{
                  fontWeight: "500"
                }}
              >
                {permissionTexts(["leave"])}
              </Typography>
              <DropdownList
                inputName={"leaveRole"}
                itemList={grantablePermission?.leave || []}
                value={values.leaveRole}
                componentStyle={{
                  width: "200px",
                  borderRadius: "100px",
                  height: "50px"
                }}
                paperStyles={{
                  width: "200px",
                  borderRadius: "100px"
                }}
                onChange={handleChange}
                isDisabled={values.isSuperAdmin}
              />
            </Stack>

            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography
                sx={{
                  fontWeight: "500"
                }}
              >
                {permissionTexts(["attendance"])}
              </Typography>
              <DropdownList
                inputName={"attendanceRole"}
                itemList={grantablePermission?.attendance || []}
                value={values.attendanceRole}
                componentStyle={{
                  width: "200px",
                  borderRadius: "100px",
                  height: "50px"
                }}
                paperStyles={{
                  width: "200px",
                  borderRadius: "100px"
                }}
                onChange={handleChange}
                isDisabled={values.isSuperAdmin}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Button
        buttonStyle={ButtonStyle.PRIMARY}
        label={"Save"}
        endIcon={IconName.FORWARD_ARROW}
        styles={{
          marginTop: 2
        }}
        onClick={() => refetch()}
        disabled={
          values.workEmail === "" ||
          values.firstName === "" ||
          values.lastName === ""
        }
        data-testid={peopleDirectoryTestId.buttons.quickAddSaveBtn}
      />
      <Button
        buttonStyle={ButtonStyle.TERTIARY}
        label={"Cancel"}
        endIcon={IconName.CLOSE_ICON}
        styles={{
          marginTop: 2
        }}
        onClick={closeModal}
        data-testid={peopleDirectoryTestId.buttons.quickAddCancelBtn}
      />
    </Stack>
  );
};

export default AddNewResourceModal;
