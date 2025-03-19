import { Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import SwitchRow from "~community/common/components/atoms/SwitchRow/SwitchRow";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { appModes } from "~community/common/constants/configs";
import {
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import useSessionData from "~community/common/hooks/useSessionData";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import {
  useGetAllowedGrantablePermissions,
  useGetSuperAdminCount
} from "~community/configurations/api/userRolesApi";
import { usePeopleStore } from "~community/people/store/store";
import { L2SystemPermissionsType } from "~community/people/types/PeopleTypes";
import { useGetEmployeeRoleLimit } from "~enterprise/common/api/peopleApi";
import { useGetEnvironment } from "~enterprise/common/hooks/useGetEnvironment";
import { EmployeeRoleLimit } from "~enterprise/people/types/EmployeeTypes";

import EditSectionButtonWrapper from "../../molecules/EditSectionButtonWrapper/EditSectionButtonWrapper";
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

  const initialValues = useMemo<L2SystemPermissionsType>(
    () => employee?.systemPermissions as L2SystemPermissionsType,
    [employee]
  );

  const { values, setFieldValue } = useFormik({
    initialValues,
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

  const handlePrimaryBtnClick = () => {};

  const handleCustomChange = ({
    name,
    value
  }: {
    name: keyof L2SystemPermissionsType;
    value: any;
  }) => {};

  const handleSuperAdminChange = (event: ChangeEvent<HTMLInputElement>) => {};

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
          checked={values.isSuperAdmin as boolean}
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
