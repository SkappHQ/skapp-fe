import {withSentryConfig} from "@sentry/nextjs";
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

export default withSentryConfig(nextConfig, {
// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options

org: "rtc-1d",
project: "javascript-nextjs",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Automatically annotate React components to show their full name in breadcrumbs and session replay
reactComponentAnnotation: {
enabled: true,
},

// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
tunnelRoute: "/monitoring",

// Hides source maps from generated client bundles
hideSourceMaps: true,

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});