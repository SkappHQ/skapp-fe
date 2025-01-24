import { Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, {
  Dispatch,
  JSX,
  SetStateAction,
  useEffect,
  useState
} from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import SwitchRow from "~community/common/components/atoms/SwitchRow/SwitchRow";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import Modal from "~community/common/components/organisms/Modal/Modal";
import PeopleLayout from "~community/common/components/templates/PeopleLayout/PeopleLayout";
import { appModes } from "~community/common/constants/configs";
import { systemPermissionFormTestId } from "~community/common/constants/testIds";
import { ButtonStyle, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { theme } from "~community/common/theme/theme";
import { EmployeeTypes } from "~community/common/types/AuthTypes";
import { IconName } from "~community/common/types/IconTypes";
import {
  useGetAllowedGrantablePermissions,
  useGetSuperAdminCount
} from "~community/configurations/api/userRolesApi";
import { MAX_SUPERVISOR_LIMIT } from "~community/people/constants/configs";
import { usePeopleStore } from "~community/people/store/store";
import { SystemPermissionInitalStateType } from "~community/people/types/AddNewResourceTypes";
import { EditAllInformationFormStatus } from "~community/people/types/EditEmployeeInfoTypes";
import {
  EmployeeDetails,
  EmployeeRoleType,
  Role,
  TeamResultsType
} from "~community/people/types/EmployeeTypes";
import { isDemoteUser } from "~community/people/utils/PeopleDirectoryUtils";
import { useGetEmployeeRoleLimit } from "~enterprise/common/api/peopleApi";
import { useGetEnvironment } from "~enterprise/common/hooks/useGetEnvironment";
import { EmployeeRoleLimit } from "~enterprise/people/types/EmployeeTypes";

import SystemCredentials from "../../SystemCredentials/SystemCrendetials";
import styles from "./styles";

interface Props {
  onNext: () => void;
  onSave: () => void;
  onBack: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  isUpdate?: boolean;
  isSubmitDisabled?: boolean;
  isProfileView?: boolean;
  updateEmployeeStatus?: EditAllInformationFormStatus;
  setUpdateEmployeeStatus?: Dispatch<
    SetStateAction<EditAllInformationFormStatus>
  >;
  isSuperAdminEditFlow?: boolean;
  employee?: EmployeeDetails;
  isInputsDisabled?: boolean;
}

const SystemPermissionForm = ({
  onBack,
  onNext,
  isUpdate = false,
  isSubmitDisabled = false,
  isProfileView = false,
  updateEmployeeStatus,
  setUpdateEmployeeStatus,
  isLoading,
  employee,
  isInputsDisabled = false
}: Props): JSX.Element => {
  const classes = styles();
  const [openModal, setOpenModal] = useState(false);
  const [modalDescription, setModalDescription] = useState("");
  const environment = useGetEnvironment();

  const isEsignatureModuleAvailable =
    process.env.NEXT_PUBLIC_ESIGN_FEATURE_TOGGLE === "true";

  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "systemPermissions"
  );

  const translateTexts = useTranslator(
    "peopleModule",
    "addResource",
    "commonText"
  );

  const roleLimitationTexts = useTranslator("peopleModule", "roleLimitation");
  const router = useRouter();

  const { data } = useGetSuperAdminCount();
  const { setUserRoles, userRoles } = usePeopleStore((state) => state);

  const { data: session } = useSession();

  const { setToastMessage } = useToast();
  const initialValues: SystemPermissionInitalStateType = {
    isSuperAdmin: userRoles.isSuperAdmin || false,
    peopleRole: userRoles.peopleRole || Role.PEOPLE_EMPLOYEE,
    leaveRole: userRoles.leaveRole || Role.LEAVE_EMPLOYEE,
    attendanceRole: userRoles.attendanceRole || Role.ATTENDANCE_EMPLOYEE,
    esignRole: userRoles.esignRole || Role.ESIGN_EMPLOYEE
  };

  const { data: grantablePermission } = useGetAllowedGrantablePermissions();

  const onSubmit = (values: EmployeeRoleType) => {
    setUserRoles("isSuperAdmin", values.isSuperAdmin);
    setUserRoles("attendanceRole", values.attendanceRole);
    setUserRoles("peopleRole", values.peopleRole);
    setUserRoles("leaveRole", values.leaveRole);
    setUserRoles("esignRole", values.esignRole);
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    validateOnChange: false
  });

  const { values, setFieldValue } = formik;

  const env = useGetEnvironment();

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

  useEffect(() => {
    if (updateEmployeeStatus === EditAllInformationFormStatus.TRIGGERED) {
      void handleNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateEmployeeStatus]);

  const isSupervisingTeams = (): boolean => {
    const teams = employee?.teams as TeamResultsType[];
    return (
      teams.some((team: TeamResultsType) => team?.team?.isSupervisor) ?? false
    );
  };

  const isSupervisingEmployees = (): boolean => {
    if (employee?.managers) return employee?.managers?.length > 0;
    else return false;
  };

  const handleNext = async () => {
    if (isUpdate) {
      if (
        isDemoteUser(employee, values) &&
        (isSupervisingTeams() || isSupervisingEmployees())
      ) {
        if (isSupervisingEmployees())
          setModalDescription(translateText(["demoteUserSupervisingEmployee"]));
        else setModalDescription(translateText(["demoteUserSupervisingTeams"]));

        setOpenModal(true);
      } else {
        if (
          employee &&
          !employee?.userRoles?.isSuperAdmin &&
          values.isSuperAdmin &&
          data &&
          data >= MAX_SUPERVISOR_LIMIT
        ) {
          setToastMessage({
            toastType: ToastType.ERROR,
            title: translateText(["maxSupervisorCountReached"]),
            description: translateText([
              "maxSupervisorCountReachedDescription"
            ]),
            open: true
          });
        } else {
          setUpdateEmployeeStatus?.(EditAllInformationFormStatus.VALIDATED);
          onNext();
        }
      }
    } else {
      if (values.isSuperAdmin && data && data >= MAX_SUPERVISOR_LIMIT) {
        setToastMessage({
          toastType: ToastType.ERROR,
          title: translateText(["maxSupervisorCountReached"]),
          open: true
        });
      } else {
        setUpdateEmployeeStatus?.(EditAllInformationFormStatus.VALIDATED);
        onNext();
      }
    }
  };

  const handleCustomChangeEnterprise = (
    name: keyof EmployeeRoleType,
    value: any
  ) => {
    if (
      name === "peopleRole" &&
      value === Role.PEOPLE_ADMIN &&
      roleLimits.peopleAdminLimitExceeded
    ) {
      setToastMessage({
        open: true,
        toastType: "error",
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
        toastType: "error",
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
        toastType: "error",
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
        toastType: "error",
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
        toastType: "error",
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
        toastType: "error",
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
    setUserRoles(name, value);
  };

  const handleCustomChangeDefault = (name: string, value: any) => {
    setFieldValue(name, value);

    if (name === "isSuperAdmin") {
      setUserRoles("isSuperAdmin", value);
    } else if (name === "peopleRole") {
      setUserRoles("peopleRole", value);
    } else if (name === "leaveRole") {
      setUserRoles("leaveRole", value);
    } else if (name === "attendanceRole") {
      setUserRoles("attendanceRole", value);
    } else if (name === "esignRole") {
      setUserRoles("esignRole", value);
    }
  };

  const handleSuperAdminChangeEnterprise = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = e.target.checked;

    if (!isChecked && data === 1) {
      setToastMessage({
        open: true,
        toastType: "error",
        title: roleLimitationTexts(["superAdminRequiredTitle"]),
        description: roleLimitationTexts(["superAdminRequiredDescription"]),
        isIcon: true
      });
      return;
    }

    if (isChecked && roleLimits.superAdminLimitExceeded) {
      setToastMessage({
        open: true,
        toastType: "error",
        title: roleLimitationTexts(["superAdminLimitationTitle"]),
        description: roleLimitationTexts(["superAdminLimitationDescription"]),
        isIcon: true
      });
      return;
    }

    void setFieldValue("isSuperAdmin", isChecked);
    setUserRoles("isSuperAdmin", isChecked);

    const peopleRole = Role.PEOPLE_ADMIN;
    const leaveRole = Role.LEAVE_ADMIN;
    const attendanceRole = Role.ATTENDANCE_ADMIN;
    const esignRole = Role.ESIGN_ADMIN;

    void setFieldValue("peopleRole", peopleRole);
    void setFieldValue("leaveRole", leaveRole);
    void setFieldValue("attendanceRole", attendanceRole);
    void setFieldValue("esignRole", esignRole);

    setUserRoles("attendanceRole", attendanceRole);
    setUserRoles("peopleRole", peopleRole);
    setUserRoles("leaveRole", leaveRole);
    setUserRoles("esignRole", esignRole);
  };

  const handleSuperAdminChangeDefault = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = e.target.checked;

    if (!isChecked && data === 1) {
      setToastMessage({
        open: true,
        toastType: "error",
        title: roleLimitationTexts(["superAdminRequiredTitle"]),
        description: roleLimitationTexts(["superAdminRequiredDescription"]),
        isIcon: true
      });
      return;
    }

    void setFieldValue("isSuperAdmin", isChecked);
    setUserRoles("isSuperAdmin", isChecked);

    const peopleRole = Role.PEOPLE_ADMIN;
    const leaveRole = Role.LEAVE_ADMIN;
    const attendanceRole = Role.ATTENDANCE_ADMIN;

    void setFieldValue("peopleRole", peopleRole);
    void setFieldValue("leaveRole", leaveRole);
    void setFieldValue("attendanceRole", attendanceRole);

    setUserRoles("attendanceRole", attendanceRole);
    setUserRoles("peopleRole", peopleRole);
    setUserRoles("leaveRole", leaveRole);
  };

  const handleCustomChange =
    env === "enterprise"
      ? handleCustomChangeEnterprise
      : handleCustomChangeDefault;
  const handleSuperAdminChange =
    env === "enterprise"
      ? handleSuperAdminChangeEnterprise
      : handleSuperAdminChangeDefault;

  const handleModalClose = () => {
    if (employee) {
      const roles = [
        "isSuperAdmin",
        "peopleRole",
        "leaveRole",
        "attendanceRole"
      ] as const;

      roles.forEach((role) => {
        setUserRoles(role, employee.userRoles[role]);
        void setFieldValue(role, employee.userRoles[role]);
      });
    }

    setModalDescription("");
    setOpenModal(false);
  };
  return (
    <PeopleLayout
      title={translateText(["title"])}
      containerStyles={classes.layoutContainerStyles}
      dividerStyles={classes.layoutDividerStyles}
      pageHead={translateText(["head"])}
    >
      <>
        <Stack direction={"row"} gap={6} marginTop={2}>
          <Stack direction={"row"} gap={6} width={"auto"}>
            <Typography
              sx={{
                color: isInputsDisabled
                  ? theme.palette.text.disabled
                  : "inherit"
              }}
            >
              {translateText(["superAdmin"])}
            </Typography>
            {!isInputsDisabled && <Icon name={IconName.SUPER_ADMIN_ICON} />}
          </Stack>
          <Stack>
            <SwitchRow
              disabled={isProfileView || isInputsDisabled}
              checked={values.isSuperAdmin}
              onChange={handleSuperAdminChange}
            />
          </Stack>
        </Stack>

        <Stack direction={"row"} gap={4} marginTop={5}>
          <DropdownList
            inputName={"peopleRole"}
            label="People"
            itemList={grantablePermission?.people || []}
            value={values.peopleRole}
            componentStyle={{
              flex: 1
            }}
            checkSelected
            onChange={(e) => handleCustomChange("peopleRole", e.target.value)}
            isDisabled={
              isProfileView || values.isSuperAdmin || isInputsDisabled
            }
          />
          {session?.user?.roles?.includes(EmployeeTypes.LEAVE_EMPLOYEE) && (
            <DropdownList
              inputName={"leaveRole"}
              label="Leave"
              itemList={grantablePermission?.leave || []}
              value={values.leaveRole}
              checkSelected
              componentStyle={{
                flex: 1
              }}
              onChange={(e) => handleCustomChange("leaveRole", e.target.value)}
              isDisabled={
                isProfileView || values.isSuperAdmin || isInputsDisabled
              }
            />
          )}

          {session?.user?.roles?.includes(
            EmployeeTypes.ATTENDANCE_EMPLOYEE
          ) && (
            <DropdownList
              inputName={"attendanceRole"}
              label="Attendance"
              itemList={grantablePermission?.attendance || []}
              value={values.attendanceRole}
              componentStyle={{
                flex: 1
              }}
              checkSelected
              onChange={(e) =>
                handleCustomChange("attendanceRole", e.target.value)
              }
              isDisabled={
                isProfileView || values.isSuperAdmin || isInputsDisabled
              }
            />
          )}

          {isEsignatureModuleAvailable && (
            <DropdownList
              inputName={"eSignRole"}
              label="E-signature"
              itemList={grantablePermission?.esign || []}
              value={values.esignRole}
              componentStyle={{
                flex: 1
              }}
              checkSelected
              onChange={(e) => handleCustomChange("esignRole", e.target.value)}
              isDisabled={
                isProfileView || values.isSuperAdmin || isInputsDisabled
              }
            />
          )}
        </Stack>
        {isUpdate &&
          !isInputsDisabled &&
          environment === appModes.COMMUNITY && <SystemCredentials />}

        {!isInputsDisabled && (
          <Stack
            direction="row"
            justifyContent="flex-start"
            spacing={2}
            marginTop={10}
            sx={{ padding: "1rem 0" }}
          >
            <Button
              label={
                isUpdate ? translateTexts(["cancel"]) : translateTexts(["back"])
              }
              buttonStyle={ButtonStyle.TERTIARY}
              endIcon={
                isUpdate ? IconName.CLOSE_ICON : IconName.LEFT_ARROW_ICON
              }
              isFullWidth={false}
              onClick={onBack}
              styles={{
                padding: "1.25rem 1.75rem"
              }}
              disabled={isSubmitDisabled || isLoading || isInputsDisabled}
              dataTestId={
                isUpdate
                  ? systemPermissionFormTestId.buttons.cancelBtn
                  : systemPermissionFormTestId.buttons.backBtn
              }
            />
            <Button
              label={
                isUpdate
                  ? translateTexts(["saveDetails"])
                  : translateTexts(["next"])
              }
              buttonStyle={ButtonStyle.PRIMARY}
              endIcon={
                isUpdate ? IconName.SAVE_ICON : IconName.RIGHT_ARROW_ICON
              }
              isFullWidth={false}
              onClick={handleNext}
              styles={{ padding: "1.25rem 2.5rem" }}
              disabled={isSubmitDisabled || isLoading || isInputsDisabled}
              isLoading={isLoading}
              dataTestId={
                isUpdate
                  ? systemPermissionFormTestId.buttons.saveDetailsBtn
                  : systemPermissionFormTestId.buttons.nextBtn
              }
            />
          </Stack>
        )}

        <Modal
          isModalOpen={openModal}
          title="Alert"
          onCloseModal={() => {
            setOpenModal(false);
            setModalDescription("");
          }}
        >
          <Stack
            sx={{
              gap: 2,
              marginTop: 2
            }}
          >
            <Typography>{modalDescription}</Typography>

            <Button
              buttonStyle={ButtonStyle.PRIMARY}
              label={"Okay"}
              onClick={handleModalClose}
            />
          </Stack>
        </Modal>
      </>
    </PeopleLayout>
  );
};

export default SystemPermissionForm;
