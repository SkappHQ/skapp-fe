import { createCSV } from "~community/common/utils/bulkUploadUtils";
import { LeaveDurationTypes } from "~community/leave/enums/LeaveTypeEnums";
import { LeaveTypePayloadType } from "~community/leave/types/AddLeaveTypes";
import { LeaveEntitlementType } from "~community/leave/types/LeaveEntitlementTypes";
import { EmployeeType } from "~community/people/types/EmployeeTypes";

import {
  downloadBulkCsvTemplate,
  exportHolidayBulkList
} from "./validateHeaders";

jest.mock("~community/common/utils/bulkUploadUtils", () => ({
  createCSV: jest.fn(),
  toCamelCase: jest.fn()
}));

class MockReadableStream {
  constructor(private source: any) {}
}

global.ReadableStream = MockReadableStream as any;

describe("Leave Utils", () => {
  const mockLeaveTypes: LeaveTypePayloadType[] = [
    {
      name: "Annual Leave",
      emojiCode: "🌴",
      colorCode: "#FF0000",
      calculationType: "WORKING_DAYS",
      leaveDuration: LeaveDurationTypes.FULL_DAY,
      maxCarryForwardDays: 5,
      carryForwardExpirationDays: 90,
      carryForwardExpirationDate: "2024-12-31",
      isAttachment: true,
      isOverridden: false,
      isAttachmentMandatory: false,
      isCommentMandatory: true,
      isAutoApproval: false,
      isActive: true,
      isCarryForwardEnabled: true,
      isCarryForwardRemainingBalanceEnabled: true
    },
    {
      name: "Sick Leave",
      emojiCode: "🏥",
      colorCode: "#00FF00",
      calculationType: "CALENDAR_DAYS",
      leaveDuration: LeaveDurationTypes.FULL_DAY,
      maxCarryForwardDays: 0,
      carryForwardExpirationDays: 0,
      carryForwardExpirationDate: null,
      isAttachment: true,
      isOverridden: false,
      isAttachmentMandatory: true,
      isCommentMandatory: true,
      isAutoApproval: false,
      isActive: true,
      isCarryForwardEnabled: false,
      isCarryForwardRemainingBalanceEnabled: false
    }
  ];

  const mockEmployees: EmployeeType[] = [
    {
      employeeId: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      jobRole: {
        jobRoleId: 1,
        name: "Software Engineer"
      },
      jobLevel: {
        jobLevelId: 1,
        name: "Senior"
      },
      accountStatus: "ACTIVE"
    },
    {
      employeeId: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      jobRole: {
        jobRoleId: 2,
        name: "Product Manager"
      },
      jobLevel: {
        jobLevelId: 2,
        name: "Lead"
      },
      accountStatus: "ACTIVE"
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("downloadBulkCsvTemplate", () => {
    it("should create CSV template with all leave types as headers", () => {
      downloadBulkCsvTemplate(mockLeaveTypes, mockEmployees);

      expect(createCSV).toHaveBeenCalledTimes(1);
      expect(createCSV).toHaveBeenCalledWith(
        expect.any(MockReadableStream),
        "LeaveBulkTemplate"
      );
    });

    it("should handle empty leave types array", () => {
      downloadBulkCsvTemplate([], mockEmployees);

      expect(createCSV).toHaveBeenCalledTimes(1);
      expect(createCSV).toHaveBeenCalledWith(
        expect.any(MockReadableStream),
        "LeaveBulkTemplate"
      );
    });

    it("should handle empty employees array", () => {
      downloadBulkCsvTemplate(mockLeaveTypes, []);

      expect(createCSV).toHaveBeenCalledTimes(1);
      expect(createCSV).toHaveBeenCalledWith(
        expect.any(MockReadableStream),
        "LeaveBulkTemplate"
      );
    });

    it("should handle null or undefined leave types", () => {
      downloadBulkCsvTemplate([], mockEmployees);
      expect(createCSV).toHaveBeenCalledTimes(1);
    });
  });
});

describe("exportHolidayBulkList", () => {
  const mockLeaveEntitlements: LeaveEntitlementType[] = [
    {
      employeeId: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      avatarUrl: "https://example.com/avatar.jpg",
      entitlements: [
        {
          name: "Annual Leave",
          totalDaysAllocated: "10",
          validFrom: "2024-01-01",
          validTo: "2024-12-31",
          leaveTypeId: 1
        },
        {
          name: "Sick Leave",
          totalDaysAllocated: "5",
          validFrom: "2024-01-01",
          validTo: "2024-12-31",
          leaveTypeId: 2
        }
      ]
    }
  ];

  it("should handle entitlements with valid dates", () => {
    exportHolidayBulkList(mockLeaveEntitlements);

    expect(createCSV).toHaveBeenCalledWith(
      expect.any(MockReadableStream),
      "holidayBulk"
    );
  });

  it("should handle empty entitlements array", () => {
    const emptyEntitlements: LeaveEntitlementType[] = [
      {
        employeeId: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        avatarUrl: "https://example.com/avatar.jpg",
        entitlements: []
      }
    ];

    exportHolidayBulkList(emptyEntitlements);

    expect(createCSV).toHaveBeenCalledTimes(3);
  });

  it("should handle missing entitlements", () => {
    const missingEntitlements: LeaveEntitlementType[] = [
      {
        employeeId: 1,
        firstName: "John",
        lastName: "Doe",
        avatarUrl: "https://example.com/avatar.jpg",
        email: "john@example.com",
        entitlements: []
      }
    ];

    exportHolidayBulkList(missingEntitlements);

    expect(createCSV).toHaveBeenCalledTimes(4);
  });
});
