import { Stack, Typography } from "@mui/material";
import { useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import SwitchRow from "~community/common/components/atoms/SwitchRow/SwitchRow";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { appModes } from "~community/common/constants/configs";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import useSessionData from "~community/common/hooks/useSessionData";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { Role } from "~community/people/enums/PeopleEnums";
import useSystemPermissionFormHandlers from "~community/people/hooks/useSystemPermissionFormHandlers";
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
            label="People"
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
              label="Leave"
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
              label="Attendance"
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
              label="e-signature"
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
          onSaveClick={() => {}}
          isSaveDisabled={false}
        />

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
            />
          </Stack>
        </Modal>
      </>
    </PeopleFormSectionWrapper>
  );
};

export default SystemPermissionFormSection;
