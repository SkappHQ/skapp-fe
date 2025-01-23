import { sendGTMEvent } from "@next/third-parties/google";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import AttendanceDashboard from "~community/attendance/components/organisms/AttendanceDashboard/AttendanceDashboard";
import TabsContainer from "~community/common/components/molecules/Tabs/Tabs";
import VersionUpgradeModal from "~community/common/components/molecules/VersionUpgradeModal/VersionUpgradeModal";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import { useTranslator } from "~community/common/hooks/useTranslator";
import {
  AdminTypes,
  EmployeeTypes,
  ManagerTypes
} from "~community/common/types/AuthTypes";
import { ModuleTypes } from "~community/common/types/CommonTypes";
import { GoogleAnalyticsTypes } from "~community/common/types/GoogleAnalyticsTypes";
import { GoogleAnalyticsValues } from "~community/common/types/GoogleAnalyticsValues";
import LeaveAllocationSummary from "~community/leave/components/organisms/LeaveDashboard/LeaveAllocationSummary";
import LeaveDashboard from "~community/leave/components/organisms/LeaveDashboard/LeaveDashboard";
import PeopleDashboard from "~community/people/components/organisms/PeopleDashboard/PeopleDashboard";

type RoleTypes = AdminTypes | ManagerTypes | EmployeeTypes;

const Dashboard: NextPage = () => {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MODE === "enterprise") {
      sendGTMEvent({
        event: GoogleAnalyticsTypes.DASHBOARD_VIEWED,
        value: GoogleAnalyticsValues.DASHBOARD_VIEWED,
        timestamp: new Date().toISOString()
      });
    }
  }, []);

  const translateText = useTranslator("dashboard");
  const { data } = useSession();

  // Permissions map for modules
  const modulePermissions: Record<string, RoleTypes[]> = {
    TIME: [
      AdminTypes.SUPER_ADMIN,
      AdminTypes.ATTENDANCE_ADMIN,
      ManagerTypes.ATTENDANCE_MANAGER
    ],
    LEAVE: [
      AdminTypes.SUPER_ADMIN,
      AdminTypes.LEAVE_ADMIN,
      ManagerTypes.LEAVE_MANAGER
    ],
    PEOPLE: [
      AdminTypes.SUPER_ADMIN,
      AdminTypes.PEOPLE_ADMIN,
      ManagerTypes.PEOPLE_MANAGER
    ]
  };

  // Define tabs
  const tabs = [
    ...(data?.user?.roles?.includes(EmployeeTypes.ATTENDANCE_EMPLOYEE)
      ? [
          {
            label: translateText(["attendanceTab"]),
            content: <AttendanceDashboard />,
            module: ModuleTypes.TIME
          }
        ]
      : []),
    ...(data?.user?.roles?.includes(EmployeeTypes.LEAVE_EMPLOYEE)
      ? [
          {
            label: translateText(["leaveTab"]),
            content: (
              <div>
                <LeaveDashboard />
              </div>
            ),
            module: ModuleTypes.LEAVE
          }
        ]
      : []),
    {
      label: translateText(["peopleTab"]),
      content: <PeopleDashboard />,
      module: ModuleTypes.PEOPLE
    }
  ];

  // Filters tabs based on user roles.
  const getVisibleTabs = (userRoles: RoleTypes[] = []) => {
    return tabs.filter((tab) => {
      const allowedRoles = modulePermissions[tab.module];
      return userRoles.some((role) => allowedRoles?.includes(role));
    });
  };

  const userRoles: RoleTypes[] = (data?.user?.roles || []) as RoleTypes[];
  const visibleTabs = getVisibleTabs(userRoles);

  return (
    <ContentLayout
      pageHead={translateText(["pageHead"])}
      title={
        data?.user && visibleTabs.length === 0 ? "" : translateText(["title"])
      }
      isDividerVisible={data?.user && visibleTabs.length === 0 ? false : true}
    >
      <>
        {data?.user && visibleTabs.length === 0 ? (
          <div>
            <LeaveAllocationSummary />
          </div>
        ) : (
          <TabsContainer tabs={visibleTabs} />
        )}

        <VersionUpgradeModal />
      </>
    </ContentLayout>
  );
};

export default Dashboard;
