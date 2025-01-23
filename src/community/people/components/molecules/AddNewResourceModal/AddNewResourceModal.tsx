import { Divider, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import SwitchRow from "~community/common/components/atoms/SwitchRow/SwitchRow";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import InputField from "~community/common/components/molecules/InputField/InputField";
import ROUTES from "~community/common/constants/routes";
import { peopleDirectoryTestId } from "~community/common/constants/testIds";
import {
  ButtonSizes,
  ButtonStyle,
  ToastType
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { EmployeeTypes } from "~community/common/types/AuthTypes";
import { IconName } from "~community/common/types/IconTypes";
import { tenantID } from "~community/common/utils/axiosInterceptor";
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
import { useGetEmployeeRoleLimit } from "~enterprise/common/api/peopleApi";
import { useGetEnvironment } from "~enterprise/common/hooks/useGetEnvironment";
import { useGetGlobalLoginMethod } from "~enterprise/people/api/GlobalLoginMethodApi";
import { EmployeeRoleLimit } from "~enterprise/people/types/EmployeeTypes";

const AddNewResourceModal = () => {
  const { setToastMessage } = useToast();
  const { data: session } = useSession();

  const isEsignatureModuleAvailable =
    process.env.NEXT_PUBLIC_ESIGN_FEATURE_TOGGLE === "true";

  const [roleLimits, setRoleLimits] = useState<EmployeeRoleLimit>({
    leaveAdminLimitExceeded: false,
    attendanceAdminLimitExceeded: false,
    peopleAdminLimitExceeded: false,
    leaveManagerLimitExceeded: false,
    attendanceManagerLimitExceeded: false,
    peopleManagerLimitExceeded: false,
    superAdminLimitExceeded: false,
    esignAdminLimitExceeded: false,
    esignSenderLimitExceeded: false
  });

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

  const roleLimitationTexts = useTranslator("peopleModule", "roleLimitation");

  const router = useRouter();
  const initialValues = {
    firstName: "",
    lastName: "",
    workEmail: "",
    isSuperAdmin: false,
    peopleRole: Role.PEOPLE_EMPLOYEE,
    leaveRole: Role.LEAVE_EMPLOYEE,
    attendanceRole: Role.ATTENDANCE_EMPLOYEE,
    esignRole: Role.ESIGN_EMPLOYEE
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
        leaveRole: values.leaveRole,
        esignRole: values.esignRole
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

  const env = useGetEnvironment();

  const isEnterpriseMode = env === "enterprise";

  const { data: globalLogin } = useGetGlobalLoginMethod(
    isEnterpriseMode,
    tenantID as string
  );

  const validateWorkEmail = () => {
    const updatedData = checkEmailAndIdentificationNo;
    if (updatedData?.isWorkEmailExists) {
      formik.setFieldError("workEmail", translateText(["uniqueEmailError"]));
      return false;
    }

    if (isEnterpriseMode) {
      if (globalLogin == "GOOGLE" && !updatedData?.isGoogleDomain) {
        formik.setFieldError("workEmail", translateText(["workEmailGoogle"]));
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (
      checkEmailAndIdentificationNo &&
      checkEmailAndIdentificationNo.isWorkEmailExists !== null &&
      isSuccess
    ) {
      if (validateWorkEmail()) {
        handleSubmit();
      }
    }
  }, [isEnterpriseMode, checkEmailAndIdentificationNo, isSuccess]);

  const { mutate: checkRoleLimits } = useGetEmployeeRoleLimit(
    (response) => setRoleLimits(response),
    () => {
      router.push("/_error");
    }
  );

  useEffect(() => {
    if (env === "enterprise") {
      checkRoleLimits();
    }
  }, [env]);

  const handleSuperAdminChangeEnterprise = (isChecked: boolean) => {
    if (isChecked && roleLimits.superAdminLimitExceeded) {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: roleLimitationTexts(["superAdminLimitationTitle"]),
        description: roleLimitationTexts(["superAdminLimitationDescription"]),
        isIcon: true
      });
      return;
    }

    handleIsSuperAdminPermission(isChecked);
  };

  const handleSuperAdminChangeDefault = (isChecked: boolean) =>
    handleIsSuperAdminPermission(isChecked);

  const handleIsSuperAdminPermission = (isChecked: boolean) => {
    setFieldValue("isSuperAdmin", isChecked);
    const updatedRole = isChecked ? Role.PEOPLE_ADMIN : Role.PEOPLE_EMPLOYEE;
    const updatedLeaveRole = isChecked ? Role.LEAVE_ADMIN : Role.LEAVE_EMPLOYEE;
    const updatedAttendanceRole = isChecked
      ? Role.ATTENDANCE_ADMIN
      : Role.ATTENDANCE_EMPLOYEE;
    const updateESignRole = isChecked ? Role.ESIGN_ADMIN : Role.ESIGN_EMPLOYEE;

    setFieldValue("peopleRole", updatedRole);
    setFieldValue("leaveRole", updatedLeaveRole);
    setFieldValue("attendanceRole", updatedAttendanceRole);
    setFieldValue("esignRole", updateESignRole);
  };

  const handleRoleChangeEnterprise = (name: string, value: any) => {
    if (
      name === "peopleRole" &&
      value === Role.PEOPLE_ADMIN &&
      roleLimits.peopleAdminLimitExceeded
    ) {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: roleLimitationTexts(["peopleAdminLimitationTitle"]),
        description: roleLimitationTexts(["peopleAdminLimitationDescription"]),
        isIcon: true
      });
      return;
    }

    if (
      name === "leaveRole" &&
      value === Role.LEAVE_ADMIN &&
      roleLimits.leaveAdminLimitExceeded
    ) {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: roleLimitationTexts(["leaveAdminLimitationTitle"]),
        description: roleLimitationTexts(["leaveAdminLimitationDescription"]),
        isIcon: true
      });
      return;
    }

    if (
      name === "attendanceRole" &&
      value === Role.ATTENDANCE_ADMIN &&
      roleLimits.attendanceAdminLimitExceeded
    ) {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: roleLimitationTexts(["attendanceAdminLimitationTitle"]),
        description: roleLimitationTexts([
          "attendanceAdminLimitationDescription"
        ]),
        isIcon: true
      });
      return;
    }

    if (
      name === "peopleRole" &&
      value === Role.PEOPLE_MANAGER &&
      roleLimits.peopleManagerLimitExceeded
    ) {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: roleLimitationTexts(["peopleManagerLimitationTitle"]),
        description: roleLimitationTexts([
          "peopleManagerLimitationDescription"
        ]),
        isIcon: true
      });
      return;
    }

    if (
      name === "leaveRole" &&
      value === Role.LEAVE_MANAGER &&
      roleLimits.leaveManagerLimitExceeded
    ) {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: roleLimitationTexts(["leaveManagerLimitationTitle"]),
        description: roleLimitationTexts(["leaveManagerLimitationDescription"]),
        isIcon: true
      });
      return;
    }

    if (
      name === "attendanceRole" &&
      value === Role.ATTENDANCE_MANAGER &&
      roleLimits.attendanceManagerLimitExceeded
    ) {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: roleLimitationTexts(["attendanceManagerLimitationTitle"]),
        description: roleLimitationTexts([
          "attendanceManagerLimitationDescription"
        ]),
        isIcon: true
      });
      return;
    }

    if (
      name === "esignRole" &&
      value === Role.ESIGN_ADMIN &&
      roleLimits.esignAdminLimitExceeded
    ) {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: roleLimitationTexts(["eSignAdminLimitationTitle"]),
        description: roleLimitationTexts(["eSignAdminLimitationDescription"]),
        isIcon: true
      });
      return;
    }

    if (
      name === "esignRole" &&
      value === Role.ESIGN_SENDER &&
      roleLimits.esignSenderLimitExceeded
    ) {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: roleLimitationTexts(["eSignSenderLimitationTitle"]),
        description: roleLimitationTexts(["eSignSenderLimitationDescription"]),
        isIcon: true
      });
      return;
    }

    setFieldValue(name, value);
  };

  const handleRoleChangeDefault = (name: string, value: any) => {
    setFieldValue(name, value);
  };

  const handleSuperAdminChange =
    env === "enterprise"
      ? handleSuperAdminChangeEnterprise
      : handleSuperAdminChangeDefault;
  const handleRoleChange =
    env === "enterprise" ? handleRoleChangeEnterprise : handleRoleChangeDefault;

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
              <Typography variant="label">
                {permissionTexts(["superAdmin"])}
              </Typography>
              <Icon name={IconName.SUPER_ADMIN_ICON} />
            </Stack>

            <Stack>
              <SwitchRow
                checked={values.isSuperAdmin}
                onChange={(e) => handleSuperAdminChange(e.target.checked)}
              />
            </Stack>
          </Stack>

          <Stack direction={"column"} gap={1} marginTop={2}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="label">
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
                onChange={(e) =>
                  handleRoleChange(e.target.name, e.target.value)
                }
                isDisabled={values.isSuperAdmin}
              />
            </Stack>

            {session?.user?.roles?.includes(EmployeeTypes.LEAVE_EMPLOYEE) && (
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography variant="label">
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
                  onChange={(e) =>
                    handleRoleChange(e.target.name, e.target.value)
                  }
                  isDisabled={values.isSuperAdmin}
                />
              </Stack>
            )}

            {session?.user?.roles?.includes(
              EmployeeTypes.ATTENDANCE_EMPLOYEE
            ) && (
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography variant="label">
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
                  onChange={(e) =>
                    handleRoleChange(e.target.name, e.target.value)
                  }
                  isDisabled={values.isSuperAdmin}
                />
              </Stack>
            )}

            {isEsignatureModuleAvailable && (
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography variant="label">
                  {permissionTexts(["eSignature"])}
                </Typography>
                <DropdownList
                  inputName={"esignRole"}
                  itemList={grantablePermission?.esign || []}
                  value={values.esignRole}
                  componentStyle={{
                    width: "200px",
                    borderRadius: "100px",
                    height: "50px"
                  }}
                  paperStyles={{
                    width: "200px",
                    borderRadius: "100px"
                  }}
                  onChange={(e) =>
                    handleRoleChange(e.target.name, e.target.value)
                  }
                  isDisabled={values.isSuperAdmin}
                />
              </Stack>
            )}
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
