import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

import ROUTES from "~community/common/constants/routes";
import {
  AdminTypes,
  EmployeeTypes,
  ManagerTypes,
  ROLE_SUPER_ADMIN,
  SenderRoleTypes,
  SuperAdminType
} from "~community/common/types/AuthTypes";

// Define common routes shared by all roles
const commonRoutes = [
  ROUTES.DASHBOARD.BASE,
  ROUTES.SETTINGS.BASE,
  ROUTES.AUTH.RESET_PASSWORD,
  ROUTES.AUTH.UNAUTHORIZED,
  ROUTES.PEOPLE.ACCOUNT,
  ROUTES.NOTIFICATIONS,
  ROUTES.AUTH.VERIFY_ACCOUNT_RESET_PASSWORD
];

// Specific role-based routes
const superAdminRoutes = {
  [ROLE_SUPER_ADMIN]: [
    ROUTES.ORGANIZATION.SETUP,
    ROUTES.CONFIGURATIONS.BASE,
    ROUTES.ORGANIZATION.MODULE_SELECTION,
    ROUTES.SETTINGS.BILLING,
    ROUTES.SIGN.CONTACTS,
    ROUTES.SIGN.CREATE_DOCUMENT,
    ROUTES.SIGN.FOLDERS,
    ROUTES.SIGN.INBOX,
    ROUTES.SIGN.SENT,
    ROUTES.AUTH.VERIFY,
    ROUTES.AUTH.VERIFY_SUCCESS,
    ROUTES.SIGN.SENT,
    ROUTES.SETTINGS.MODULES
  ]
};

const adminRoutes = {
  [AdminTypes.PEOPLE_ADMIN]: [ROUTES.PEOPLE.BASE],
  [AdminTypes.LEAVE_ADMIN]: [ROUTES.LEAVE.BASE],
  [AdminTypes.ATTENDANCE_ADMIN]: [
    ROUTES.TIMESHEET.BASE,
    ROUTES.CONFIGURATIONS.ATTENDANCE
  ],
  [AdminTypes.ESIGN_ADMIN]: [
    ROUTES.SIGN.CONTACTS,
    ROUTES.SIGN.CREATE_DOCUMENT,
    ROUTES.SIGN.FOLDERS,
    ROUTES.SIGN.INBOX,
    ROUTES.SIGN.SENT
  ]
};

const managerRoutes = {
  [ManagerTypes.PEOPLE_MANAGER]: [ROUTES.PEOPLE.BASE],
  [ManagerTypes.LEAVE_MANAGER]: [
    ROUTES.LEAVE.LEAVE_REQUESTS,
    ROUTES.LEAVE.TEAM_TIME_SHEET_ANALYTICS,
    ROUTES.LEAVE.LEAVE_PENDING,
    ROUTES.PEOPLE.INDIVIDUAL
  ],
  [ManagerTypes.ATTENDANCE_MANAGER]: [
    ROUTES.TIMESHEET.ALL_TIMESHEETS,
    ROUTES.TIMESHEET.TIMESHEET_ANALYTICS,
    ROUTES.PEOPLE.INDIVIDUAL
  ],
  [SenderRoleTypes.ESIGN_SENDER]: [
    ROUTES.SIGN.CONTACTS,
    ROUTES.SIGN.CREATE_DOCUMENT,
    ROUTES.SIGN.FOLDERS,
    ROUTES.SIGN.INBOX,
    ROUTES.SIGN.SENT
  ]
};

const employeeRoutes = {
  [EmployeeTypes.PEOPLE_EMPLOYEE]: [
    ROUTES.PEOPLE.DIRECTORY,
    ROUTES.PEOPLE.INDIVIDUAL,
    ...commonRoutes
  ],
  [EmployeeTypes.LEAVE_EMPLOYEE]: [ROUTES.LEAVE.MY_REQUESTS, ...commonRoutes],
  [EmployeeTypes.ATTENDANCE_EMPLOYEE]: [
    ROUTES.TIMESHEET.MY_TIMESHEET,
    ...commonRoutes
  ],
  [EmployeeTypes.ESIGN_EMPLOYEE]: [ROUTES.SIGN.INBOX, ...commonRoutes]
};

// Merging all routes into one allowedRoutes object
const allowedRoutes: Record<
  AdminTypes | ManagerTypes | EmployeeTypes | SuperAdminType,
  string[]
> = {
  ...superAdminRoutes,
  ...adminRoutes,
  ...managerRoutes,
  ...employeeRoutes
};

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const { token } = request.nextauth;

    const roles: (
      | AdminTypes
      | ManagerTypes
      | EmployeeTypes
      | SuperAdminType
    )[] = token?.roles || [];

    let isPasswordChangedForTheFirstTime;

    if (typeof token?.isPasswordChangedForTheFirstTime === "string") {
      isPasswordChangedForTheFirstTime =
        token?.isPasswordChangedForTheFirstTime === "true" ? true : false;
    } else {
      isPasswordChangedForTheFirstTime =
        token?.isPasswordChangedForTheFirstTime;
    }

    if (
      !(
        isPasswordChangedForTheFirstTime ||
        request.nextUrl.pathname === ROUTES.AUTH.RESET_PASSWORD
      )
    ) {
      return NextResponse.redirect(
        new URL(ROUTES.AUTH.RESET_PASSWORD, request.url)
      );
    } else if (
      isPasswordChangedForTheFirstTime &&
      request.nextUrl.pathname === ROUTES.AUTH.RESET_PASSWORD
    ) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD.BASE, request.url));
    }

    if (
      roles.includes(ManagerTypes.LEAVE_MANAGER) &&
      !roles.includes(AdminTypes.LEAVE_ADMIN) &&
      request.nextUrl.pathname ===
        `${ROUTES.LEAVE.TEAM_TIME_SHEET_ANALYTICS}/reports`
    ) {
      return NextResponse.redirect(
        new URL(ROUTES.AUTH.UNAUTHORIZED, request.url)
      );
    }

    if (
      request.nextUrl.pathname.startsWith(ROUTES.DASHBOARD.BASE) &&
      !roles.includes(EmployeeTypes.LEAVE_EMPLOYEE) &&
      !roles.includes(ManagerTypes.PEOPLE_MANAGER) &&
      !roles.includes(ManagerTypes.ATTENDANCE_MANAGER)
    ) {
      if (roles.includes(EmployeeTypes.ATTENDANCE_EMPLOYEE)) {
        return NextResponse.redirect(
          new URL(ROUTES.TIMESHEET.MY_TIMESHEET, request.url)
        );
      }
    }

    const isAllowed = roles.some((role) =>
      allowedRoutes[role]?.some((url) =>
        request.nextUrl.pathname.startsWith(url)
      )
    );

    if (isAllowed) {
      const isEsignatureModuleAvailable =
        process.env.NEXT_PUBLIC_ESIGN_FEATURE_TOGGLE === "true";

      if (
        request.nextUrl.pathname.includes(ROUTES.SIGN.BASE) &&
        !isEsignatureModuleAvailable
      ) {
        return NextResponse.redirect(
          new URL(ROUTES.AUTH.UNAUTHORIZED, request.url)
        );
      }
      return NextResponse.next();
    }

    // Redirect to /unauthorized if no access
    return NextResponse.redirect(
      new URL(ROUTES.AUTH.UNAUTHORIZED, request.url)
    );
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

// Define the matcher patterns for this middleware
export const config = {
  matcher: [
    // All community routes
    "/community/:path*",
    // Super admin routes
    "/setup-organization/:path*",
    "/module-selection",
    // Common routes
    "/dashboard/:path*",
    "/configurations/:path*",
    "/settings/:path*",
    "/notifications",
    "/account",
    "/reset-password",
    "/unauthorized",
    "/verify/email",
    "/verify/success",
    "/verify/account-reset-password",
    // Module routes
    "/leave/:path*",
    "/people/:path*",
    "/timesheet/:path*",
    "/sign/:path*"
  ]
};
