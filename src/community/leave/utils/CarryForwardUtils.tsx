import { createCSV } from "~community/common/utils/bulkUploadUtils";
import {
  LeaveType,
  carryForwardLeaveEntitlementsType
} from "~community/leave/types/LeaveCarryForwardTypes";

export const downloadCarryForwardDataCSV = (
  data: carryForwardLeaveEntitlementsType[],
  leaveTypes: LeaveType[]
) => {
  const nameArray = leaveTypes.map((leaveType) => leaveType.name);
  const leaveTypeString = nameArray.join(",");
  const formattedData = data.map((item) => {
    const entitlementsByLeaveType = nameArray.map((leaveType) => {
      const entitlementIndex = leaveTypes.findIndex(
        (type) => type.name === leaveType
      );

      const entitlementAmount = item.entitlements[entitlementIndex] || 0;
      return entitlementAmount;
    });

    return {
      employee: item.employeeData,
      entitlements: entitlementsByLeaveType
    };
  });

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(`EMPLOYEE ID,NAME,${leaveTypeString}\n`);
      for (const item of formattedData) {
        const { entitlements, employee } = item;
        const row = `${employee?.id || "N/A"},${employee?.name || "N/A"},${entitlements.join(",")}\n`;
        controller.enqueue(row);
      }

      controller.close();
    }
  });

  createCSV(stream, "leave-carried-forward-data");
};

export const sortLeaveTypesInAlphabeticalOrder = (
  leaveTypes: LeaveType[]
): LeaveType[] => {
  const sortedArray = leaveTypes.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    return 1;
  });

  return sortedArray;
};
