import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import SwitchRow from "~community/common/components/atoms/SwitchRow/SwitchRow";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { appModes } from "~community/common/constants/configs";
import { ButtonStyle, ToastType } from "~community/common/enums/ComponentEnums";
import useSessionData from "~community/common/hooks/useSessionData";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { useGetSuperAdminCount } from "~community/configurations/api/userRolesApi";
import { useGetSupervisedByMe } from "~community/people/api/PeopleApi";
import { MAX_SUPERVISOR_LIMIT } from "~community/people/constants/configs";
import { Role } from "~community/people/enums/PeopleEnums";
import useFormChangeDetector from "~community/people/hooks/useFormChangeDetector";
import useSystemPermissionFormHandlers from "~community/people/hooks/useSystemPermissionFormHandlers";
import { usePeopleStore } from "~community/people/store/store";
import { useGetEnvironment } from "~enterprise/common/hooks/useGetEnvironment";

import EditSectionButtonWrapper from "../../molecules/EditSectionButtonWrapper/EditSectionButtonWrapper";
import PeopleFormSectionWrapper from "../PeopleFormSectionWrapper/PeopleFormSectionWrapper";
import SystemCredentials from "../SystemCredentials/SystemCredentials";
import styles from "./styles";

interface Props {
  isProfileView?: boolean;
  isInputsDisabled?: boolean;
  isUpdate?: boolean;
}

const SystemPermissionFormSection = ({
  isProfileView,
  isInputsDisabled,
  isUpdate
}: Props) => {
  const classes = styles();
  const environment = useGetEnvironment();

  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "systemPermissions"
  );
  const commonText = useTranslator("peopleModule", "addResource", "commonText");

  const [openModal, setOpenModal] = useState(false);
  const [modalDescription, setModalDescription] = useState("");
  const { employee, initialEmployee, isSaveButtonClicked, setEmployee } =
    usePeopleStore((state) => state);
  const { data: supervisedData } = useGetSupervisedByMe(
    Number(employee.common?.employeeId)
  );
  const { data: superAdminCount } = useGetSuperAdminCount();
  const { setToastMessage } = useToast();
  const hasChanged = useFormChangeDetector();

  const {
    permissions,
    grantablePermission,
    handleRoleDropdown,
    handleSuperAdminToggle
  } = useSystemPermissionFormHandlers();

  const {
    isAttendanceModuleEnabled,
    isLeaveModuleEnabled,
    isEsignatureModuleEnabled
  } = useSessionData();

  const onSave = () => {
    if (
      employee?.systemPermissions?.peopleRole === Role.PEOPLE_EMPLOYEE &&
      (initialEmployee?.systemPermissions?.peopleRole === Role.PEOPLE_ADMIN ||
        initialEmployee?.systemPermissions?.peopleRole === Role.PEOPLE_MANAGER)
    ) {
      if (supervisedData.isPrimaryManager)
        setModalDescription(translateText(["demoteUserSupervisingEmployee"]));
      else if (supervisedData.isTeamSuperviso)
        setModalDescription(translateText(["demoteUserSupervisingTeams"]));

      setOpenModal(true);
    } else if (
      employee.systemPermissions?.isSuperAdmin &&
      initialEmployee.systemPermissions?.isSuperAdmin &&
      superAdminCount >= MAX_SUPERVISOR_LIMIT
    ) {
      setToastMessage({
        toastType: ToastType.ERROR,
        title: translateText(["maxSupervisorCountReached"]),
        description: translateText(["maxSupervisorCountReachedDescription"]),
        open: true
      });
    } else {
      setEmployee(employee);
    }
  };

  useEffect(() => {
    if (isSaveButtonClicked) {
      onSave();
    }
  }, [isSaveButtonClicked]);

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
          checked={permissions.isSuperAdmin as boolean}
          onChange={handleSuperAdminToggle}
          wrapperStyles={classes.switchRowWrapper}
          icon={!isInputsDisabled ? IconName.SUPER_ADMIN_ICON : undefined}
        />

        <Stack sx={classes.dropdownContainer}>
          <DropdownList
            inputName={"peopleRole"}
            label={translateText(["people"])}
            itemList={grantablePermission?.people || []}
            value={permissions.peopleRole}
            componentStyle={classes.dropdownListComponentStyles}
            checkSelected
            onChange={(event) =>
              handleRoleDropdown("peopleRole", event.target.value as Role)
            }
            isDisabled={
              isProfileView || permissions.isSuperAdmin || isInputsDisabled
            }
          />

          {isLeaveModuleEnabled && (
            <DropdownList
              inputName={"leaveRole"}
              label={translateText(["leave"])}
              itemList={grantablePermission?.leave || []}
              value={permissions.leaveRole}
              checkSelected
              componentStyle={classes.dropdownListComponentStyles}
              onChange={(event) =>
                handleRoleDropdown("leaveRole", event.target.value as Role)
              }
              isDisabled={
                isProfileView || permissions.isSuperAdmin || isInputsDisabled
              }
            />
          )}

          {isAttendanceModuleEnabled && (
            <DropdownList
              inputName={"attendanceRole"}
              label={translateText(["attendance"])}
              itemList={grantablePermission?.attendance || []}
              value={permissions.attendanceRole}
              componentStyle={classes.dropdownListComponentStyles}
              checkSelected
              onChange={(event) =>
                handleRoleDropdown("attendanceRole", event.target.value as Role)
              }
              isDisabled={
                isProfileView || permissions.isSuperAdmin || isInputsDisabled
              }
            />
          )}

          {isEsignatureModuleEnabled && (
            <DropdownList
              inputName={"eSignRole"}
              label={translateText(["eSignature"])}
              itemList={grantablePermission?.esign || []}
              value={permissions.eSignRole}
              componentStyle={classes.dropdownListComponentStyles}
              checkSelected
              onChange={(event) =>
                handleRoleDropdown("eSignRole", event.target.value as Role)
              }
              isDisabled={
                isProfileView || permissions.isSuperAdmin || isInputsDisabled
              }
            />
          )}
        </Stack>

        {isUpdate &&
          !isInputsDisabled &&
          environment === appModes.COMMUNITY && <SystemCredentials />}

        <EditSectionButtonWrapper
          onCancelClick={() => {}}
          onSaveClick={onSave}
          isSaveDisabled={!hasChanged}
        />

        <Modal
          isModalOpen={openModal}
          title={translateText(["alert"])}
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
            />
          </Stack>
        </Modal>
      </>
    </PeopleFormSectionWrapper>
  );
};

export default SystemPermissionFormSection;
