import { Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import SwitchRow from "~community/common/components/atoms/SwitchRow/SwitchRow";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { appModes } from "~community/common/constants/configs";
import { systemPermissionFormTestId } from "~community/common/constants/testIds";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import useSessionData from "~community/common/hooks/useSessionData";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import {
  useGetAllowedGrantablePermissions,
  useGetSuperAdminCount
} from "~community/configurations/api/userRolesApi";
import { Role } from "~community/people/enums/PeopleEnums";
import { usePeopleStore } from "~community/people/store/store";
import { EditPeopleFormStatus } from "~community/people/types/PeopleEditTypes";
import { L2SystemPermissionsType } from "~community/people/types/PeopleTypes";
import { useGetEmployeeRoleLimit } from "~enterprise/common/api/peopleApi";
import { useGetEnvironment } from "~enterprise/common/hooks/useGetEnvironment";
import { EmployeeRoleLimit } from "~enterprise/people/types/EmployeeTypes";

import PeopleFormSectionWrapper from "../PeopleFormSectionWrapper/PeopleFormSectionWrapper";
import SystemCredentials from "../SystemCredentials/SystemCredentials";
import styles from "./styles";

interface Props {
  onBack?: () => void;
  isProfileView?: boolean;
  isInputsDisabled?: boolean;
  isUpdate?: boolean;
  isSubmitDisabled?: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
}
const SystemPermissionFormSection = ({
  onBack,
  isProfileView,
  isInputsDisabled,
  isUpdate,
  isSubmitDisabled,
  isLoading,
  isSuccess
}: Props) => {
  const classes = styles();

  const router = useRouter();

  const environment = useGetEnvironment();

  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "systemPermissions"
  );
  const commonText = useTranslator("peopleModule", "addResource", "commonText");
  const roleLimitationText = useTranslator("peopleModule", "roleLimitation");

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

  const { employee } = usePeopleStore((state) => ({
    employee: state.employee
  }));

  const { data: superAdminCount } = useGetSuperAdminCount();
  const { data: grantablePermission } = useGetAllowedGrantablePermissions();

  const {
    isAttendanceModuleEnabled,
    isLeaveModuleEnabled,
    isEsignatureModuleEnabled
  } = useSessionData();

  const initialValues: L2SystemPermissionsType = {
    isSuperAdmin: employee?.systemPermissions?.isSuperAdmin || false,
    peopleRole: employee?.systemPermissions?.peopleRole || Role.PEOPLE_EMPLOYEE,
    leaveRole: employee?.systemPermissions?.leaveRole || Role.LEAVE_EMPLOYEE,
    attendanceRole:
      employee?.systemPermissions?.attendanceRole || Role.ATTENDANCE_EMPLOYEE,
    eSignRole: employee?.systemPermissions?.eSignRole || Role.ESIGN_EMPLOYEE
  };

  const { values, setFieldValue } = useFormik({
    initialValues,
    // onSubmit:
    // (values: L2SystemPermissionsType) =>
    //   handleSystemPermissionFormSubmit({ values, setUserRoles }),
    onSubmit: () => {},
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

  // useEffect(() => {
  //   if (updateEmployeeStatus === EditPeopleFormStatus.TRIGGERED) {
  //     void handleNextBtnClick({
  //       isUpdate,
  //       systemPermissionsText,
  //       employee,
  //       setToastMessage,
  //       superAdminCount,
  //       setModalDescription,
  //       setOpenModal,
  //       values,
  //       setUpdateEmployeeStatus,
  //       onNext
  //     });
  //   }
  // }, [updateEmployeeStatus]);

  // useEffect(() => {
  //   if (isSuccess) {
  //     handleAddNewResourceSuccess({
  //       setToastMessage,
  //       resetEmployeeData,
  //       router,
  //       translateText: commonText
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isSuccess]);

  const handlePrimaryBtnClick = () => {
    // if (isLeaveModuleEnabled) {
    //   handleNextBtnClick({
    //     isUpdate,
    //     systemPermissionsText,
    //     employee,
    //     setToastMessage,
    //     superAdminCount,
    //     setModalDescription,
    //     setOpenModal,
    //     values,
    //     setUpdateEmployeeStatus,
    //     onNext
    //   });
    // } else {
    //   onSave();
    // }
  };

  const handleCustomChange = ({
    name,
    value
  }: {
    name: keyof L2SystemPermissionsType;
    value: any;
  }) => {
    // environment === appModes.ENTERPRISE
    //   ? handleCustomChangeEnterprise({
    //       name,
    //       value,
    //       setToastMessage,
    //       roleLimitationText,
    //       roleLimits,
    //       setFieldValue,
    //       setUserRoles
    //     })
    //   : handleCustomChangeDefault({
    //       name,
    //       value,
    //       setFieldValue,
    //       setUserRoles
    //     });
  };

  const handleSuperAdminChange = (event: ChangeEvent<HTMLInputElement>) => {
    // if (environment === appModes.ENTERPRISE) {
    //   handleSuperAdminChangeEnterprise({
    //     event,
    //     setFieldValue,
    //     setUserRoles,
    //     setToastMessage,
    //     roleLimitationText,
    //     roleLimits,
    //     superAdminCount
    //   });
    // } else {
    //   handleSuperAdminChangeDefault({
    //     event,
    //     setFieldValue,
    //     setUserRoles,
    //     setToastMessage,
    //     roleLimitationText,
    //     superAdminCount
    //   });
    // }
  };

  return (
    <PeopleFormSectionWrapper
      title={translateText(["title"])}
      pageHead={translateText(["head"])}
      containerStyles={classes.layoutContainerStyles}
      dividerStyles={classes.layoutDividerStyles}
    >
      <>
        <SwitchRow
          label={translateText(["superAdmin"])}
          disabled={isProfileView || isInputsDisabled}
          checked={values.isSuperAdmin}
          onChange={handleSuperAdminChange}
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
              inputName={"eSignRole"}
              label="e-signature"
              itemList={grantablePermission?.esign || []}
              value={values.eSignRole}
              componentStyle={classes.dropdownListComponentStyles}
              checkSelected
              onChange={(event) =>
                handleCustomChange({
                  name: "eSignRole",
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
              // onClick={() =>
              //   handleModalClose({
              //     employee,
              //     setUserRoles,
              //     setFieldValue,
              //     setModalDescription,
              //     setOpenModal
              //   })
              // }
            />
          </Stack>
        </Modal>
      </>
    </PeopleFormSectionWrapper>
  );
};

export default SystemPermissionFormSection;
