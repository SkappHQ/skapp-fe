import { ChangeEvent, useCallback, useEffect, useState } from "react";

import { appModes } from "~community/common/constants/configs";
import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import {
  useGetAllowedGrantablePermissions,
  useGetSuperAdminCount
} from "~community/configurations/api/userRolesApi";
import { usePeopleStore } from "~community/people/store/store";
import { L2SystemPermissionsType } from "~community/people/types/PeopleTypes";
import { useGetEnvironment } from "~enterprise/common/hooks/useGetEnvironment";
import { EmployeeRoleLimit } from "~enterprise/people/types/EmployeeTypes";

import { Role } from "../enums/PeopleEnums";
import { useGetRoleLimits } from "~enterprise/common/api/peopleApi";

type RoleLimitEntry = {
  limitExceeded: boolean;
  title: string;
  description: string;
};

type RoleLimitMapping = {
  [K in keyof L2SystemPermissionsType]?: {
    [R in Role]?: RoleLimitEntry;
  };
};

const useSystemPermissionFormHandlers = () => {
  const translateText = useTranslator("peopleModule", "roleLimitation");

  const environment = useGetEnvironment();
  const { setToastMessage } = useToast();
  const { employee, setSystemPermissions } = usePeopleStore((state) => state);

  const [permissions, setPermissions] = useState<L2SystemPermissionsType>(
    employee?.systemPermissions || {}
  );
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

  const { data: superAdminCount } = useGetSuperAdminCount();
  const { data: grantablePermission } = useGetAllowedGrantablePermissions();
  const { data: roleLimitsData } = useGetRoleLimits(
    environment === appModes.ENTERPRISE
  );

  useEffect(() => {
    if (roleLimitsData) {
      setRoleLimits(roleLimitsData);
    }
  }, [roleLimitsData]);

  const roleLimitMapping: RoleLimitMapping = {
    peopleRole: {
      [Role.PEOPLE_ADMIN]: {
        limitExceeded: roleLimits.peopleAdminLimitExceeded,
        title: "peopleAdminLimitationTitle",
        description: "peopleAdminLimitationDescription"
      },
      [Role.PEOPLE_MANAGER]: {
        limitExceeded: roleLimits.peopleManagerLimitExceeded,
        title: "peopleManagerLimitationTitle",
        description: "peopleManagerLimitationDescription"
      }
    },
    leaveRole: {
      [Role.LEAVE_ADMIN]: {
        limitExceeded: roleLimits.leaveAdminLimitExceeded,
        title: "leaveAdminLimitationTitle",
        description: "leaveAdminLimitationDescription"
      },
      [Role.LEAVE_MANAGER]: {
        limitExceeded: roleLimits.leaveManagerLimitExceeded,
        title: "leaveManagerLimitationTitle",
        description: "leaveManagerLimitationDescription"
      }
    },
    attendanceRole: {
      [Role.ATTENDANCE_ADMIN]: {
        limitExceeded: roleLimits.attendanceAdminLimitExceeded,
        title: "attendanceAdminLimitationTitle",
        description: "attendanceAdminLimitationDescription"
      },
      [Role.ATTENDANCE_MANAGER]: {
        limitExceeded: roleLimits.attendanceManagerLimitExceeded,
        title: "attendanceManagerLimitationTitle",
        description: "attendanceManagerLimitationDescription"
      }
    },
    eSignRole: {
      [Role.ESIGN_ADMIN]: {
        limitExceeded: roleLimits.esignAdminLimitExceeded,
        title: "eSignAdminLimitationTitle",
        description: "eSignAdminLimitationDescription"
      },
      [Role.ESIGN_SENDER]: {
        limitExceeded: roleLimits.esignSenderLimitExceeded,
        title: "eSignSenderLimitationTitle",
        description: "eSignSenderLimitationDescription"
      }
    }
  };

  const handleRoleDropdown = (
    name: keyof L2SystemPermissionsType,
    value: Role
  ) => {
    if (environment === appModes.ENTERPRISE) {
      const roleData = roleLimitMapping[name]?.[value];

      if (roleData?.limitExceeded) {
        setToastMessage({
          open: true,
          toastType: ToastType.ERROR,
          title: translateText([roleData.title]),
          description: translateText([roleData.description]),
          isIcon: true
        });
        return;
      }
    }
    setPermissions((prev) => ({ ...prev, [name]: value }));
    setSystemPermissions({ [name]: value });
  };

  const handleSuperAdminToggle = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;

      if (!isChecked && superAdminCount === 1) {
        setToastMessage({
          open: true,
          toastType: ToastType.ERROR,
          title: translateText(["superAdminRequiredTitle"]),
          description: translateText(["superAdminRequiredDescription"]),
          isIcon: true
        });
        return;
      }

      if (isChecked && roleLimits.superAdminLimitExceeded) {
        setToastMessage({
          open: true,
          toastType: ToastType.ERROR,
          title: translateText(["superAdminLimitationTitle"]),
          description: translateText(["superAdminLimitationDescription"]),
          isIcon: true
        });
        return;
      }

      setPermissions({
        isSuperAdmin: isChecked,
        leaveRole: Role.LEAVE_ADMIN,
        attendanceRole: Role.ATTENDANCE_ADMIN,
        peopleRole: Role.PEOPLE_ADMIN
      });
      setSystemPermissions({
        isSuperAdmin: isChecked,
        leaveRole: Role.LEAVE_ADMIN,
        attendanceRole: Role.ATTENDANCE_ADMIN,
        peopleRole: Role.PEOPLE_ADMIN
      });
    },
    [
      superAdminCount,
      roleLimits,
      setSystemPermissions,
      setToastMessage,
      translateText
    ]
  );

  return {
    permissions,
    grantablePermission,
    handleRoleDropdown,
    handleSuperAdminToggle
  };
};

export default useSystemPermissionFormHandlers;
