import { useSession } from "next-auth/react";
import { useMemo } from "react";

import { AdminTypes, EmployeeTypes } from "~community/common/types/AuthTypes";
import { TierEnum } from "~enterprise/common/enums/CommonEum";

const useSessionData = () => {
  const { data: sessionData } = useSession();

  const isFreeTier = useMemo(
    () => sessionData?.user?.tier === TierEnum.FREE,
    [sessionData?.user?.tier]
  );

  const isProTier = useMemo(
    () => sessionData?.user?.tier === TierEnum.PRO,
    [sessionData?.user?.tier]
  );

  const isLeaveModuleEnabled = useMemo(
    () => sessionData?.user?.roles?.includes(EmployeeTypes.LEAVE_EMPLOYEE),
    [sessionData?.user?.roles]
  );

  const isAttendanceModuleEnabled = useMemo(
    () => sessionData?.user?.roles?.includes(EmployeeTypes.ATTENDANCE_EMPLOYEE),
    [sessionData?.user?.roles]
  );

  const employeeDetails = useMemo(
    () => sessionData?.user?.employee,
    [sessionData?.user?.employee]
  );

  const isSuperAdmin = useMemo(
    () => sessionData?.user?.roles?.includes(AdminTypes.SUPER_ADMIN),
    [sessionData?.user?.roles]
  );

  return {
    isFreeTier,
    isProTier,
    isAttendanceModuleEnabled,
    isLeaveModuleEnabled,
    employeeDetails,
    isSuperAdmin
  };
};

export default useSessionData;
