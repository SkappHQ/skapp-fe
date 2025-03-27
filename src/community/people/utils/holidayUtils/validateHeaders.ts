import { createCSV } from "~community/common/utils/bulkUploadUtils";
import { LeaveEntitlementType } from "~community/leave/types/LeaveEntitlementTypes";

export const exportHolidayBulkList = (
  leaveEntitlementList: LeaveEntitlementType[]
) => {
  const predefinedHeaders = ["Date", "Name", "Holiday Duration"];
  const leaveTypeHeaders = leaveEntitlementList?.[0]?.entitlements?.map(
    (entitlement) => entitlement?.name
  );
  const headers = [...predefinedHeaders, ...leaveTypeHeaders];

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(headers.join(",") + "\n");
      for (const leaveEntitlement of leaveEntitlementList) {
        const rowData = [
          leaveEntitlement?.employeeId,
          leaveEntitlement?.firstName + " " + leaveEntitlement?.lastName,
          leaveEntitlement?.email,
          ...leaveTypeHeaders.map((leaveType) => {
            const value = leaveEntitlement?.entitlements?.find(
              (entitlement) => entitlement?.name === leaveType
            )?.totalDaysAllocated;
            return value !== undefined ? String(value) : "";
          })
        ];
        controller.enqueue(rowData.join(",") + "\n");
      }
      controller.close();
    }
  });
  createCSV(stream, "holidayBulk");
};
