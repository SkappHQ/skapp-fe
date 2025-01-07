import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const isEnterpriseMode = process.env.NEXT_PUBLIC_MODE === "enterprise";

let hasReplaced = false

// Define groups of paths that need to be replaced
const replacementGroups = {
  auth: [
    {
      community: 'src/community/auth/authOptions.ts',
      enterprise: 'src/enterprise/auth/authOptions.ts'
    }
  ],
  languages: [
    {
      community: 'src/community/common/assets/languages/english/english.ts',
      enterprise: 'src/enterprise/common/assets/languages/english/english.ts'
    }
  ],
  constants: [
    {
      community: 'src/community/common/constants/dbKeys.ts',
      enterprise: 'src/enterprise/common/constants/dbKeys.ts'
    }
  ],
  utils: [
    {
      community: 'src/community/common/utils/monitoring.ts',
      enterprise: 'src/enterprise/common/utils/monitoring.ts'
    },
    {
      community: 'src/community/common/utils/awsS3ServiceFunctions.ts',
      enterprise: 'src/enterprise/common/utils/awsS3ServiceFunctions.ts'
    }
  ],
  configs: [
    {
      community: 'src/community/common/configs/firebase.ts',
      enterprise: 'src/enterprise/common/configs/firebase.ts'
    },
  ],
  hooks: [
    {
      community: 'src/community/common/hooks/useFCMToken.ts',
      enterprise: 'src/enterprise/common/hooks/useFCMToken.ts'
    },
    {
      community: 'src/community/common/hooks/useS3Download.ts"',
      enterprise: 'src/enterprise/common/hooks/useS3Download.ts"'
    }
  ],
  types: [
    {
      community: 'src/community/common/types/s3Types.ts',
      enterprise: 'src/enterprise/common/types/s3Types.ts'
    },
  ],
  apis: [
    {
      community: 'src/community/common/api/setDeviceTokenApi.ts',
      enterprise: 'src/enterprise/common/api/setDeviceTokenApi.ts'
    },
    {
      community: 'src/community/people/api/CheckUserLimitApi.ts',
      enterprise: 'src/enterprise/people/api/CheckUserLimitApi.ts'
    },
  ],
  components: [
    {
      community: 'src/community/people/components/molecules/UserLimitBanner/UserLimitBanner.tsx',
      enterprise: 'src/enterprise/people/components/molecules/UserLimitBanner/UserLimitBanner.tsx'
    },
  ],
  stores: [
    {
      community: 'src/community/people/store/userLimitStore.ts',
      enterprise: 'src/enterprise/people/store/userLimitStore.ts'
    },
  ]
  // Add more groups as needed
}

const replaceFile = (communityPath, enterprisePath) => {
  const fullCommunityPath = join(__dirname, communityPath)
  const fullEnterprisePath = join(__dirname, enterprisePath)
  const communityDir = dirname(fullCommunityPath)

  if (fs.existsSync(fullEnterprisePath)) {
    if (!fs.existsSync(communityDir)) {
      fs.mkdirSync(communityDir, { recursive: true })
    }
    fs.copyFileSync(fullEnterprisePath, fullCommunityPath)
  }
}

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
        destination: isEnterpriseMode
          ? "/enterprise/signup"
          : "/community/signup"
      },
      {
        source: "/setup-organization",
        destination: isEnterpriseMode
          ? "/enterprise/setup-organization"
          : "/community/setup-organization"
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
        destination: isEnterpriseMode
          ? "/enterprise/signin"
          : "/community/signin"
      },
      {
        source: "/settings/account",
        destination: "/community/settings/account"
      },
      {
        source: "/settings/billing",
        destination: "/enterprise/settings/billing"
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
        destination: isEnterpriseMode
          ? "/enterprise/reset-password"
          : "/community/reset-password"
      },
      {
        source: "/leave/leave-analytics",
        destination: "/community/leave/leave-analytics"
      },
      {
        source: "/people/directory",
        destination: isEnterpriseMode
          ? "/enterprise/people/directory"
          : "/community/people/directory"
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
      },
      {
        source: "/verify/email",
        destination: "/enterprise/verify/email"
      },
      {
        source: "/verify/success",
        destination: "/enterprise/verify/success"
      },
      {
        source: "/redirect",
        destination: "/enterprise/redirect"
      },
      {
        source: "/verify/reset-password",
        destination: "/enterprise/verify/reset-password"
      },
      {
        source: "/forget-password",
        destination: "/enterprise/forget-password"
      },
      {
        source: "/maintenance",
        destination: "/enterprise/maintenance"
      }
    ];
  },
  webpack: (config) => {
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.beforeCompile.tap('ReplaceImplementations', () => { 
          if (isEnterpriseMode && !hasReplaced) {
            // Replace only auth and specific other files
            const groupsToReplace = ['auth', 'languages', 'constants', 'utils', 'configs', 'hooks', 'types', 'apis'] // Add other groups as needed
            
            groupsToReplace.forEach(group => {
              if (replacementGroups[group]) {
                replacementGroups[group].forEach(({ community, enterprise }) => {
                  replaceFile(community, enterprise)
                })
              }
            })
            // Set the flag to prevent further replacements
            hasReplaced = true
          }
        })
      }
    })

    return config
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;