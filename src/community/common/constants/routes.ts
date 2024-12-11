const ROUTES = {
  AUTH: {
    SIGNUP: "/signup",
    SIGNIN: "/signin",
    RESET_PASSWORD: "/reset-password",
    UNAUTHORIZED: "/unauthorized",
    ERROR: "/_error"
  },
  ORGANIZATION: {
    SETUP: "/setup-organization"
  },
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
  TIMESHEET: {
    BASE: "/timesheet",
    MY_TIMESHEET: "/timesheet/my-timesheet",
    ALL_TIMESHEETS: "/timesheet/all-timesheets",
    TIMESHEET_REQUESTS: "/timesheet/timesheet-requests",
    TIMESHEET_ANALYTICS: "/timesheet/analytics"
  },
  LEAVE: {
    BASE: "/leave",
    LEAVE_ANALYTICS: "/leave/leave-analytics",
    MY_REQUESTS: "/leave/my-requests",
    LEAVE_REQUESTS: "/leave/leave-requests",
    TYPES: "/leave/types",
    LEAVE_ENTITLEMENTS: "/leave/entitlements/leave-entitlements",
    LEAVE_PENDING: "/leave/pending-leave",
    CARRY_FORWARD_BALANCES: "/leave/entitlements/carry-forward-balances",
    ADD_EDIT_TYPES: "/leave/types/add-edit",
    LEAVE_TYPES: "/leave/types",
    ADD_EDIT_LEAVE_TYPES: (slug: string) => `/leave/types/${slug}`,
    TEAM_TIME_SHEET_ANALYTICS: `/leave/analytics`,
    CARRY_FORWARD: "/leave/carry-forward-balances"
  },
  PEOPLE: {
    BASE: "/people",
    DIRECTORY: "/people/directory",
    JOB_FAMILY: "/people/job-family",
    TEAMS: "/people/teams",
    HOLIDAYS: "/people/holidays",
    INDIVIDUAL: "/people/individual",
    ACCOUNT: "/account",
    ADD_NEW_RESOURCE: "/people/directory/add-new-resource",
    EDIT_ALL_INFORMATION: (id: any) =>
      `/people/directory/edit-all-information/${id}`,
    PENDING: "/people/directory/pending"
  },
  CONFIGURATIONS: {
    BASE: "/configurations",
    ATTENDANCE: "/configurations/attendance",
    TIME: "/configurations/time",
    USER_ROLES: "/configurations/user-roles",
    USER_ROLES_MODULE: (module: string) =>
      `/configurations/user-roles/${module}`
  },
  DASHBOARD: {
    BASE: "/dashboard",
    ATTENDANCE: {
      CLOCK_IN_SUMMARY: "/dashboard/attendance/clock-in-summary",
      LATE_ARRIVALS_SUMMARY: "/dashboard/attendance/late-arrivals-summary"
    },
    LEAVE: {
      RESOURCE_AVAILABILITY: "/dashboard/leave/resource-availability"
    }
  }
};

export default ROUTES;