import { useSession } from "next-auth/react";
import { useMemo } from "react";

import { EmployeeTypes } from "~community/common/types/AuthTypes";

// import { TierEnum } from "~enterprise/common/enums/CommonEum";

const useSessionData = () => {
  const { data: sessionData } = useSession();

  const isFreeTier = true;

  // const isFreeTier = useMemo(
  //   () => sessionData?.tier === TierEnum.FREE,
  //   [sessionData?.tier]
  // );

  // const isProTier = useMemo(
  //   () => sessionData?.tier === TierEnum.PRO,
  //   [sessionData?.tier]
  // );

  const isLeaveModuleEnabled = useMemo(
    () => sessionData?.user?.roles?.includes(EmployeeTypes.LEAVE_EMPLOYEE),
    [sessionData?.user?.roles]
  );

  const isAttendanceModuleEnabled = useMemo(
    () => sessionData?.user?.roles?.includes(EmployeeTypes.ATTENDANCE_EMPLOYEE),
    [sessionData?.user?.roles]
  );

  return {
    isFreeTier,
    // isProTier,
    isAttendanceModuleEnabled,
    isLeaveModuleEnabled
  };
};

export default useSessionData;
