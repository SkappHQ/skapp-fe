/**
 * Placeholder needed for enterprise setups where the path is dynamically
 * switched at build time based on the NEXT_PUBLIC_MODE environment variable.
 * Ensures compatibility during the build process.
 */

export interface EmployeeRoleLimit {
  leaveAdminLimitExceeded: boolean;
  attendanceAdminLimitExceeded: boolean;
  peopleAdminLimitExceeded: boolean;
  leaveManagerLimitExceeded: boolean;
  attendanceManagerLimitExceeded: boolean;
  peopleManagerLimitExceeded: boolean;
  superAdminLimitExceeded: boolean;
}
