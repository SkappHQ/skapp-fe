/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/welcome",
        destination: "/community/welcome"
      },
      {
        source: "/signup",
        destination: "/community/signup"
      },
      {
        source: "/setup-organization",
        destination: "/community/setup-organization"
      },
      {
        source: "/dashboard",
        destination: "/community/dashboard"
      },
      {
        source: "/dashboard/attendance/clock-in-summary",
        destination: "/community/dashboard/attendance/clock-in-summary"
      },
      {
        source: "/dashboard/attendance/late-arrivals-summary",
        destination: "/community/dashboard/attendance/late-arrivals-summary"
      },
      {
        source: "/dashboard/leave/resource-availability",
        destination: "/community/dashboard/leave/resource-availability"
      },
      {
        source: "/signin",
        destination: "/community/signin"
      },
      {
        source: "/settings",
        destination: "/community/settings"
      },
      {
        source: "/notifications",
        destination: "/community/notifications"
      },
      {
        source: "/account",
        destination: "/community/account"
      },
      {
        source: "/unauthorized",
        destination: "/community/unauthorized"
      },
      {
        source: "/timesheet/my-timesheet",
        destination: "/community/timesheet/my-timesheet"
      },
      {
        source: "/timesheet/all-timesheets",
        destination: "/community/timesheet/all-timesheets"
      },
      {
        source: "/timesheet/timesheet-requests",
        destination: "/community/timesheet/timesheet-requests"
      },
      {
        source: "/reset-password",
        destination: "/community/reset-password"
      },
      {
        source: "/leave/leave-analytics",
        destination: "/community/leave/leave-analytics"
      },
      {
        source: "/people/directory",
        destination: "/community/people/directory"
      },
      {
        source: "/people/job-family",
        destination: "/community/people/job-family"
      },
      {
        source: "/people/teams",
        destination: "/community/people/teams"
      },
      {
        source: "/people/holidays",
        destination: "/community/people/holidays"
      },
      {
        source: "/people/individual",
        destination: "/community/people/individual"
      },
      {
        source: "/people/directory/add-new-resource",
        destination: "/community/people/directory/add-new-resource"
      },
      {
        source: "/people/directory/pending",
        destination: "/community/people/directory/pending"
      },
      {
        source: "/people/directory/edit-all-information/:id",
        destination: "/community/people/directory/edit-all-information/:id"
      },
      {
        source: "/leave/my-requests",
        destination: "/community/leave/my-requests"
      },
      {
        source: "/leave/leave-requests",
        destination: "/community/leave/leave-requests"
      },
      {
        source: "/leave/types",
        destination: "/community/leave/types"
      },
      {
        source: "/leave/types/add-edit",
        destination: "/community/leave/types/add-edit"
      },
      {
        source: "/leave/leave-entitlements",
        destination: "/community/leave/leave-entitlements"
      },
      {
        source: "/leave/types/add",
        destination: "/community/leave/types/add"
      },
      {
        source: "/leave/types/edit",
        destination: "/community/leave/types/edit"
      },
      {
        source: "/leave/entitlements/leave-entitlements",
        destination: "/community/leave/entitlements/leave-entitlements"
      },
      {
        source: "/leave/pending-leave",
        destination: "/community/leave/pending-leave"
      },
      {
        source: "/leave/analytics/:id",
        destination: "/community/leave/analytics/:id"
      },
      {
        source: "/timesheet/analytics/:id",
        destination: "/community/timesheet/analytics/:id"
      },
      {
        source: "/leave/carry-forward-balances",
        destination: "/community/leave/entitlements/carry-forward-balances"
      },
      {
        source: "/leave/analytics/reports",
        destination: "/community/leave/analytics/reports"
      },
      {
        source: "/configurations/attendance",
        destination: "/community/configurations/attendance"
      },
      {
        source: "/configurations/time",
        destination: "/community/configurations/time"
      },
      {
        source: "/configurations/user-roles",
        destination: "/community/configurations/user-roles"
      },
      {
        source: "/configurations/user-roles/attendance",
        destination: "/community/configurations/user-roles/attendance"
      },
      {
        source: "/configurations/user-roles/leave",
        destination: "/community/configurations/user-roles/leave"
      },
      {
        source: "/configurations/user-roles/people",
        destination: "/community/configurations/user-roles/people"
      },
      {
        source: "/leave/analytics/:id",
        destination: "/community/leave/analytics/:id"
      }
    ];
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;