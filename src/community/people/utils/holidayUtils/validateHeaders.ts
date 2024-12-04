import { createCSV } from "~community/common/utils/bulkUploadUtils";
import { toCamelCase } from "~community/common/utils/commonUtil";
import { LeaveTypePayloadType } from "~community/leave/types/AddLeaveTypes";
import { LeaveEntitlementType } from "~community/leave/types/LeaveEntitlementTypes";
import { EmployeeType } from "~community/people/types/EmployeeTypes";

export const downloadBulkCsvTemplate = (
  leaveTypes: LeaveTypePayloadType[],
  employeeData: EmployeeType[]
) => {
  const headers = [
    "Date",
    "HolidayName",
    "HolidayDuration",
    ...(leaveTypes?.map((type) => type?.name) ?? [])
  ];

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(headers.join(",") + "\n");
      for (const employeeDetails of employeeData) {
        const rowData = [
          employeeDetails?.employeeId,
          employeeDetails?.firstName,
          employeeDetails?.email
        ];
        controller.enqueue(rowData.join(",") + "\n");
      }

      controller.close();
    }
  });

  createCSV(stream, "LeaveBulkTemplate");
};

export const validateHeaders = async (file: File): Promise<boolean> => {
  const readCSVHeaders = (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event?.target?.result as string;

        const headers = text
          .split("\n")[0]
          .split(",")
          .map((header) => header.trim());
        resolve(headers);
      };
      reader.onerror = () => reject(new Error("File reading error"));
      reader.readAsText(file);
    });
  };

  const checkInvalidHeaders = (headers: string[]): boolean => {
    const predefinedHeaders = ["date", "name", "HolidayDuration"];
    return headers?.some((header) => !predefinedHeaders?.includes(header));
  };

  const headers = await readCSVHeaders(file);
  const isValid = !checkInvalidHeaders(headers);

  return isValid;
};

export const transformCSVHeaders = (header: string) => {
  return toCamelCase(header);
};

export const exportHolidayBulkList = (
  leaveEntitlementList: LeaveEntitlementType[]
) => {
  const predefinedHeaders = ["date", "name", "HolidayDuration"];
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
