import { useSession } from "next-auth/react";
import { useMemo } from "react";

import { EmployeeTypes } from "~community/common/types/AuthTypes";

const useModuleChecker = () => {
  const { data: session } = useSession();

  const isLeaveModuleEnabled = useMemo(
    () => session?.user?.roles?.includes(EmployeeTypes.LEAVE_EMPLOYEE),
    [session?.user?.roles]
  );

  const isAttendanceModuleEnabled = useMemo(
    () => session?.user?.roles?.includes(EmployeeTypes.ATTENDANCE_EMPLOYEE),
    [session?.user?.roles]
  );

  return { isAttendanceModuleEnabled, isLeaveModuleEnabled };
};

export default useModuleChecker;
