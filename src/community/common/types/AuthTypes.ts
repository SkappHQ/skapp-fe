export type PasswordFieldTypes = "text" | "password";

export type PasswordFieldStates = {
  id: string;
  type: PasswordFieldTypes;
  isPasswordVisible: boolean;
};

export const ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN";

export type SuperAdminType = typeof ROLE_SUPER_ADMIN;

export enum AdminTypes {
  SUPER_ADMIN = "ROLE_SUPER_ADMIN",
  PEOPLE_ADMIN = "ROLE_PEOPLE_ADMIN",
  LEAVE_ADMIN = "ROLE_LEAVE_ADMIN",
  ATTENDANCE_ADMIN = "ROLE_ATTENDANCE_ADMIN"
}

export enum EmployeeTypes {
  PEOPLE_EMPLOYEE = "ROLE_PEOPLE_EMPLOYEE",
  LEAVE_EMPLOYEE = "ROLE_LEAVE_EMPLOYEE",
  ATTENDANCE_EMPLOYEE = "ROLE_ATTENDANCE_EMPLOYEE"
}

export enum ManagerTypes {
  PEOPLE_MANAGER = "ROLE_PEOPLE_MANAGER",
  LEAVE_MANAGER = "ROLE_LEAVE_MANAGER",
  ATTENDANCE_MANAGER = "ROLE_ATTENDANCE_MANAGER"
}

export type AuthEmployeeType = {
  employeeId: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  jobTitle?: string | null;
  authPic?: string | null;
  accountStatus?: string;
  email?: string;
};
