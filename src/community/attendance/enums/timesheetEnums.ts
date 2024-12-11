export enum TimesheetAnalyticsTabTypes {
  RANGE = "range",
  WEEK = "week",
  MONTH = "month"
}

export enum TimeSheetRequestStates {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  CANCELLED = "CANCELLED",
  DENIED = "DENIED"
}

export enum DailyLogChipTypes {
  WORK = "WORK",
  BREAK = "BREAK",
  MANUAL = "MANUAL"
}

export enum EmployeeTimesheetModalTypes {
  ADD_TIME_ENTRY = "ADD_TIME_ENTRY",
  CONFIRM_TIME_ENTRY = "CONFIRM_TIME_ENTRY",
  TIME_ENTRY_EXISTS = "TIME_ENTRY_EXISTS",
  ADD_LEAVE_TIME_ENTRY = "ADD_LEAVE_TIME_ENTRY",
  EDIT_LEAVE_TIME_ENTRY = "EDIT_LEAVE_TIME_ENTRY",
  EDIT_AVAILABLE_TIME_ENTRY = "EDIT_AVAILABLE_TIME_ENTRY",
  ADD_TIME_ENTRY_BY_TABLE = "ADD_TIME_ENTRY_BY_TABLE",
  TIME_REQUEST_EXISTS = "TIME_REQUEST_EXISTS",
  CONFIRM_HOLIDAY_TIME_ENTRY = "CONFIRM_HOLIDAY_TIME_ENTRY",
  ONGOING_TIME_ENTRY = "ONGOING_TIME_ENTRY",
  TIME_REQUEST_EXISTS_BY_EDIT = "TIME_REQUEST_EXISTS_BY_EDIT",
  ONGOING_TIME_ENTRY_BY_EDIT = "ONGOING_TIME_ENTRY_BY_EDIT"
}

export enum DailyLogFilterTabTypes {
  CUSTOM_RANGE = "Custom Range",
  WEEK = "Week",
  MONTH = "Month"
}

export enum TimeSheetRequestTypes {
  MANUAL_ENTRY_REQUEST = "MANUAL_ENTRY_REQUEST",
  EDIT_RECORD_REQUEST = "EDIT_RECORD_REQUEST"
}