import { DateTime } from "luxon";

import { DayOfWeek } from "~community/common/enums/CommonEnums";
import { LeaveStates } from "~community/common/types/CommonTypes";
import { LeaveStatusEnums } from "~community/leave/enums/MyRequestEnums";
import {
  MyLeaveRequestPayloadType,
  ResourceAvailabilityPayload
} from "~community/leave/types/MyRequests";
import { HolidayDurationType } from "~community/people/types/HolidayTypes";

export const workingDate: DateTime = DateTime.fromISO("2024-04-01");

export const nonWorkingDate: DateTime = DateTime.fromISO("2024-04-06");

export const startDate: DateTime = DateTime.fromISO("2024-04-08");

export const endDate: DateTime = DateTime.fromISO("2024-04-10");

export const selectedDates: DateTime[] = [startDate, endDate];

export const DateOne: DateTime = DateTime.fromISO("2024-04-01");

export const DateTwo: DateTime = DateTime.fromISO("2024-04-02");

export const selectedDatesTwo: DateTime[] = [DateOne, DateTwo];

export const workingDays = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY"
];

export const holidays = [
  {
    holidayDuration: HolidayDurationType.FULLDAY,
    id: 1,
    name: "Independence Day"
  },
  {
    holidayDuration: HolidayDurationType.HALFDAY,
    id: 2,
    name: "Spring Festival"
  }
];

export const myLeaveRequests: MyLeaveRequestPayloadType[] = [
  {
    leaveRequestId: 1,
    startDate: "2024-04-08",
    endDate: "2024-04-10",
    leaveType: {
      typeId: 1,
      name: "Annual Leave",
      emojiCode: "🏖️",
      colorCode: "#4CAF50"
    },
    leaveState: LeaveStates.FULL_DAY,
    status: LeaveStatusEnums.APPROVED,
    durationHours: 24,
    isViewed: true,
    durationDays: 3,
    requestDesc: "Summer vacation trip"
  },
  {
    leaveRequestId: 2,
    startDate: "2024-04-15",
    endDate: "2024-04-17",
    leaveType: {
      typeId: 2,
      name: "Sick Leave",
      emojiCode: "🤒",
      colorCode: "#FF5722"
    },
    leaveState: LeaveStates.MORNING,
    status: LeaveStatusEnums.PENDING,
    durationHours: 4,
    isViewed: false,
    durationDays: 0.5,
    requestDesc: "Medical consultation"
  },
  {
    leaveRequestId: 3,
    startDate: "2024-05-10",
    endDate: "2024-05-10",
    leaveType: {
      typeId: 3,
      name: "Personal Leave",
      emojiCode: "🏡",
      colorCode: "#2196F3"
    },
    leaveState: LeaveStates.EVENING,
    status: LeaveStatusEnums.DENIED,
    durationHours: 4,
    isViewed: true,
    durationDays: 0.5,
    requestDesc: "Family event"
  }
];

export const resourceAvailability: ResourceAvailabilityPayload[] = [
  {
    date: "1ST APR",
    dayOfWeek: DayOfWeek.MON,
    leaveCount: 2,
    availableCount: 8,
    leaveRequests: [
      {
        employee: {
          employeeId: 101,
          firstName: "John",
          lastName: "Doe",
          middleName: "A",
          authPic: "https://example.com/john-doe.jpg"
        },
        endDate: "2024-04-01",
        leaveRequestId: 1,
        leaveState: LeaveStates.FULL_DAY,
        leaveType: {
          typeId: 1,
          name: "Annual Leave",
          emojiCode: "🏖️",
          colorCode: "#4CAF50"
        },
        reviewer: {
          employeeId: 201,
          firstName: "Sarah",
          lastName: "Smith",
          middleName: "M",
          authPic: "https://example.com/sarah-smith.jpg"
        },
        startDate: "2024-04-02",
        status: LeaveStatusEnums.APPROVED
      },
      {
        employee: {
          employeeId: 102,
          firstName: "Emily",
          lastName: "Johnson",
          middleName: "B",
          authPic: "https://example.com/emily-johnson.jpg"
        },
        leaveRequestId: 2,
        leaveState: LeaveStates.MORNING,
        leaveType: {
          typeId: 2,
          name: "Sick Leave",
          emojiCode: "🤒",
          colorCode: "#FF5722"
        },
        reviewer: null,
        startDate: "2024-03-29",
        endDate: "2024-04-01",
        status: LeaveStatusEnums.PENDING
      }
    ],
    holidays: [
      {
        id: 1,
        name: "Independence Day",
        holidayDuration: HolidayDurationType.FULLDAY
      }
    ]
  },
  {
    date: "2ND APR",
    dayOfWeek: DayOfWeek.TUE,
    leaveCount: 3,
    availableCount: 7,
    leaveRequests: [
      {
        employee: {
          employeeId: 103,
          firstName: "Michael",
          lastName: "Brown",
          middleName: "C",
          authPic: "https://example.com/michael-brown.jpg"
        },
        endDate: "",
        leaveRequestId: 3,
        leaveState: LeaveStates.FULL_DAY,
        leaveType: {
          typeId: 3,
          name: "Personal Leave",
          emojiCode: "🏡",
          colorCode: "#2196F3"
        },
        reviewer: {
          employeeId: 202,
          firstName: "David",
          lastName: "Wilson",
          middleName: "K",
          authPic: "https://example.com/david-wilson.jpg"
        },
        startDate: "2024-04-02",
        status: LeaveStatusEnums.APPROVED
      },
      {
        employee: {
          employeeId: 104,
          firstName: "Jessica",
          lastName: "Davis",
          middleName: "L",
          authPic: "https://example.com/jessica-davis.jpg"
        },
        endDate: "",
        leaveRequestId: 4,
        leaveState: LeaveStates.EVENING,
        leaveType: {
          typeId: 4,
          name: "Comp Off",
          emojiCode: "💼",
          colorCode: "#9C27B0"
        },
        reviewer: null,
        startDate: "2024-04-02",
        status: LeaveStatusEnums.PENDING
      },
      {
        employee: {
          employeeId: 105,
          firstName: "Robert",
          lastName: "Miller",
          middleName: "E",
          authPic: "https://example.com/robert-miller.jpg"
        },
        endDate: "",
        leaveRequestId: 5,
        leaveState: LeaveStates.MORNING,
        leaveType: {
          typeId: 2,
          name: "Sick Leave",
          emojiCode: "🤒",
          colorCode: "#FF5722"
        },
        reviewer: {
          employeeId: 201,
          firstName: "Sarah",
          lastName: "Smith",
          middleName: "M",
          authPic: "https://example.com/sarah-smith.jpg"
        },
        startDate: "2024-04-02",
        status: LeaveStatusEnums.APPROVED
      }
    ],
    holidays: [
      {
        id: 2,
        name: "Spring Festival",
        holidayDuration: HolidayDurationType.HALFDAY
      }
    ]
  }
];
