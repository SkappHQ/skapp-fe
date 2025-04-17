import { Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import SwitchRow from "~community/common/components/atoms/SwitchRow/SwitchRow";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import Modal from "~community/common/components/organisms/Modal/Modal";
import PeopleLayout from "~community/common/components/templates/PeopleLayout/PeopleLayout";
import { appModes } from "~community/common/constants/configs";
import { systemPermissionFormTestId } from "~community/common/constants/testIds";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import useSessionData from "~community/common/hooks/useSessionData";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import {
  useGetAllowedGrantablePermissions,
  useGetSuperAdminCount
} from "~community/configurations/api/userRolesApi";
import SystemCredentials from "~community/people/components/organisms/SystemCredentials/SystemCredentials";
import { usePeopleStore } from "~community/people/store/store";
import { SystemPermissionInitialStateType } from "~community/people/types/AddNewResourceTypes";
import { EditAllInformationFormStatus } from "~community/people/types/EditEmployeeInfoTypes";
import {
  EmployeeDetails,
  EmployeeRoleType,
  Role
} from "~community/people/types/EmployeeTypes";
import { handleAddNewResourceSuccess } from "~community/people/utils/directoryUtils/addNewResourceFlowUtils/addNewResourceUtils";
import {
  handleCustomChangeDefault,
  handleCustomChangeEnterprise,
  handleModalClose,
  handleNextBtnClick,
  handleSuperAdminChangeDefault,
  handleSuperAdminChangeEnterprise,
  handleSystemPermissionFormSubmit
} from "~community/people/utils/directoryUtils/addNewResourceFlowUtils/systemPermissionFormUtils";
import { useGetEmployeeRoleLimit } from "~enterprise/common/api/peopleApi";
import { useGetEnvironment } from "~enterprise/common/hooks/useGetEnvironment";
import { EmployeeRoleLimit } from "~enterprise/people/types/EmployeeTypes";

import styles from "./styles";

interface Props {
  onNext: () => void;
  onSave: () => void;
  onBack: () => void;
  isLoading: boolean;
  isSuccess?: boolean;
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
  onSave,
  isUpdate = false,
  isSubmitDisabled = false,
  isProfileView = false,
  updateEmployeeStatus,
  setUpdateEmployeeStatus,
  isLoading,
  employee,
  isInputsDisabled = false,
  isSuccess
}: Props): JSX.Element => {
  const classes = styles();

  const router = useRouter();

  const environment = useGetEnvironment();

  const { data: superAdminCount } = useGetSuperAdminCount();
  const { data: grantablePermission } = useGetAllowedGrantablePermissions();

  const {
    isAttendanceModuleEnabled,
    isLeaveModuleEnabled,
    isEsignatureModuleEnabled
  } = useSessionData();

  const { setToastMessage } = useToast();

  const systemPermissionsText = useTranslator(
    "peopleModule",
    "addResource",
    "systemPermissions"
  );
  const commonText = useTranslator("peopleModule", "addResource", "commonText");
  const roleLimitationText = useTranslator("peopleModule", "roleLimitation");

  const { setUserRoles, userRoles, resetEmployeeData } = usePeopleStore(
    (state) => ({
      setUserRoles: state.setUserRoles,
      userRoles: state.userRoles,
      resetEmployeeData: state.resetEmployeeData
    })
  );

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalDescription, setModalDescription] = useState<string>("");
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

  const initialValues: SystemPermissionInitialStateType = {
    isSuperAdmin: userRoles.isSuperAdmin || false,
    peopleRole: userRoles.peopleRole || Role.PEOPLE_EMPLOYEE,
    leaveRole: userRoles.leaveRole || Role.LEAVE_EMPLOYEE,
    attendanceRole: userRoles.attendanceRole || Role.ATTENDANCE_EMPLOYEE,
    esignRole: userRoles.esignRole || Role.ESIGN_EMPLOYEE
  };

  const { values, setFieldValue } = useFormik({
    initialValues,
    onSubmit: (values: EmployeeRoleType) =>
      handleSystemPermissionFormSubmit({ values, setUserRoles }),
    validateOnChange: false
  });

  const { mutate: checkRoleLimits } = useGetEmployeeRoleLimit(
    (response) => setRoleLimits(response),
    () => {
      router.push("/_error");
    }
  );

  useEffect(() => {
    if (environment === appModes.ENTERPRISE) {
      checkRoleLimits();
    }
  }, [environment]);

  useEffect(() => {
    if (updateEmployeeStatus === EditAllInformationFormStatus.TRIGGERED) {
      void handleNextBtnClick({
        isUpdate,
        systemPermissionsText,
        employee,
        setToastMessage,
        superAdminCount,
        setModalDescription,
        setOpenModal,
        values,
        setUpdateEmployeeStatus,
        onNext
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateEmployeeStatus]);

  useEffect(() => {
    if (isSuccess) {
      handleAddNewResourceSuccess({
        setToastMessage,
        resetEmployeeData,
        router,
        translateText: commonText
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handlePrimaryBtnClick = () => {
    if (isLeaveModuleEnabled) {
      handleNextBtnClick({
        isUpdate,
        systemPermissionsText,
        employee,
        setToastMessage,
        superAdminCount,
        setModalDescription,
        setOpenModal,
        values,
        setUpdateEmployeeStatus,
        onNext
      });
    } else {
      onSave();
    }
  };

  const handleCustomChange = ({
    name,
    value
  }: {
    name: keyof EmployeeRoleType;
    value: any;
  }) => {
    environment === appModes.ENTERPRISE
      ? handleCustomChangeEnterprise({
          name,
          value,
          setToastMessage,
          roleLimitationText,
          roleLimits,
          setFieldValue,
          setUserRoles
        })
      : handleCustomChangeDefault({
          name,
          value,
          setFieldValue,
          setUserRoles
        });
  };

  const handleSuperAdminChange = (checked: boolean) => {
    if (environment === appModes.ENTERPRISE) {
      handleSuperAdminChangeEnterprise({
        checked,
        setFieldValue,
        setUserRoles,
        setToastMessage,
        roleLimitationText,
        roleLimits,
        superAdminCount
      });
    } else {
      handleSuperAdminChangeDefault({
        checked,
        setFieldValue,
        setUserRoles,
        setToastMessage,
        roleLimitationText,
        superAdminCount
      });
    }
  };

  return (
    <PeopleLayout
      title={systemPermissionsText(["title"])}
      pageHead={systemPermissionsText(["head"])}
      containerStyles={classes.layoutContainerStyles}
      dividerStyles={classes.layoutDividerStyles}
    >
      <>
        <SwitchRow
          labelId="super-admin"
          label={systemPermissionsText(["superAdmin"])}
          disabled={isProfileView || isInputsDisabled}
          checked={values.isSuperAdmin}
          onChange={(checked: boolean) => handleSuperAdminChange(checked)}
          wrapperStyles={classes.switchRowWrapper}
          icon={!isInputsDisabled ? IconName.SUPER_ADMIN_ICON : undefined}
        />

        <Stack sx={classes.dropdownContainer}>
          <DropdownList
            inputName={"peopleRole"}
            label="People"
            itemList={grantablePermission?.people || []}
            value={values.peopleRole}
            componentStyle={classes.dropdownListComponentStyles}
            checkSelected
            onChange={(event) =>
              handleCustomChange({
                name: "peopleRole",
                value: event.target.value
              })
            }
            isDisabled={
              isProfileView || values.isSuperAdmin || isInputsDisabled
            }
          />

          {isLeaveModuleEnabled && (
            <DropdownList
              inputName={"leaveRole"}
              label="Leave"
              itemList={grantablePermission?.leave || []}
              value={values.leaveRole}
              checkSelected
              componentStyle={classes.dropdownListComponentStyles}
              onChange={(event) =>
                handleCustomChange({
                  name: "leaveRole",
                  value: event.target.value
                })
              }
              isDisabled={
                isProfileView || values.isSuperAdmin || isInputsDisabled
              }
            />
          )}

          {isAttendanceModuleEnabled && (
            <DropdownList
              inputName={"attendanceRole"}
              label="Attendance"
              itemList={grantablePermission?.attendance || []}
              value={values.attendanceRole}
              componentStyle={classes.dropdownListComponentStyles}
              checkSelected
              onChange={(event) =>
                handleCustomChange({
                  name: "attendanceRole",
                  value: event.target.value
                })
              }
              isDisabled={
                isProfileView || values.isSuperAdmin || isInputsDisabled
              }
            />
          )}

          {isEsignatureModuleEnabled && (
            <DropdownList
              inputName={"esignRole"}
              label="e-signature"
              itemList={grantablePermission?.esign || []}
              value={values.esignRole}
              componentStyle={classes.dropdownListComponentStyles}
              checkSelected
              onChange={(event) =>
                handleCustomChange({
                  name: "esignRole",
                  value: event.target.value
                })
              }
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
          <Stack sx={classes.btnWrapper}>
            <Button
              isFullWidth={false}
              disabled={isSubmitDisabled || isLoading || isInputsDisabled}
              buttonStyle={ButtonStyle.TERTIARY}
              size={ButtonSizes.LARGE}
              label={isUpdate ? commonText(["cancel"]) : commonText(["back"])}
              startIcon={isUpdate ? <></> : IconName.LEFT_ARROW_ICON}
              endIcon={isUpdate ? IconName.CLOSE_ICON : <></>}
              onClick={onBack}
              dataTestId={
                isUpdate
                  ? systemPermissionFormTestId.buttons.cancelBtn
                  : systemPermissionFormTestId.buttons.backBtn
              }
            />
            <Button
              isLoading={isLoading}
              isFullWidth={false}
              disabled={isSubmitDisabled || isLoading || isInputsDisabled}
              buttonStyle={ButtonStyle.PRIMARY}
              size={ButtonSizes.LARGE}
              label={
                !isLeaveModuleEnabled || isUpdate
                  ? commonText(["saveDetails"])
                  : commonText(["next"])
              }
              endIcon={
                !isLeaveModuleEnabled || isUpdate
                  ? IconName.SAVE_ICON
                  : IconName.RIGHT_ARROW_ICON
              }
              onClick={handlePrimaryBtnClick}
              dataTestId={
                !isLeaveModuleEnabled || isUpdate
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
          <Stack sx={classes.modalContainer}>
            <Typography>{modalDescription}</Typography>
            <Button
              buttonStyle={ButtonStyle.PRIMARY}
              label={commonText(["okay"])}
              onClick={() =>
                handleModalClose({
                  employee,
                  setUserRoles,
                  setFieldValue,
                  setModalDescription,
                  setOpenModal
                })
              }
            />
          </Stack>
        </Modal>
      </>
    </PeopleLayout>
  );
};

export default SystemPermissionForm;
