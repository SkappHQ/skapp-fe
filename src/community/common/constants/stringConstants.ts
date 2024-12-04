export enum characterLengths {
  JOB_FAMILY_LENGTH = 50,
  JOB_TITLE_LENGTH = 50,
  NAME_LENGTH = 50,
  CHARACTER_LENGTH = 50,
  COMPANY_NAME_LENGTH = 30,
  ORGANIZATION_NAME_LENGTH = 100,
  EMPLOYEE_ID_LENGTH = 20,
  LEAVE_TYPE_LENGTH = 20,
  NIN_LENGTH = 14,
  STATE_LENGTH = 50,
  PHONE_NUMBER_LENGTH_MAX = 14,
  PHONE_NUMBER_LENGTH_MIN = 4
}

export const MAX_PASSWORD_STRENGTH = 5;

export enum AccountSignIn {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE"
}

export enum BulkSummaryFlows {
  ENTITLEMENT_BULK_UPLOAD = "entitlement_bulk",
  USER_BULK_UPLOAD = "user_bulk"
}

export const INITIAL_COLOR_DISPLAY_COUNT = 6;

export enum daysTypes {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY"
}

export enum PasswordStrength {
  Great = "Great",
  Good = "Good",
  Decent = "Decent",
  Weak = "Weak"
}

export enum AuthStatus {
  Authenticated = "authenticated"
}

export const PASSWORD_STRENGTH_MULTIPLIER = 20;

export enum HolidayCSVHeader {
  NAME = "name",
  DATE = "date",
  HOLIDAY_DURATION = "holidayDuration"
}

export enum HolidayTableHeader {
  NAME = "name",
  DATE = "date",
  HOLIDAY_DURATION = "HolidayDuration"
}

export enum EmailProvider {
  GMAIL = "Gmail",
  OUTLOOK = "Outlook",
  YAHOO = "Yahoo"
}
export const DEFAULT_PORT = "587";
export const DISABLED_PORT = "-";
