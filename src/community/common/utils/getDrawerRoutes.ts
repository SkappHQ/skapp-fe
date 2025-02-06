import ROUTES from "~community/common/constants/routes";
import {
  AdminTypes,
  EmployeeTypes,
  ManagerTypes,
  SenderRoleTypes,
  SuperAdminType
} from "~community/common/types/AuthTypes";
import enterpriseRoutes from "~enterprise/common/utils/data/enterpriseRoutes";

import routes from "./data/routes";

type Role = AdminTypes | ManagerTypes | EmployeeTypes | SuperAdminType;

const getDrawerRoutes = (
  userRoles: Role[] | undefined,
  isEnterprise: boolean,
  globalLoginMethod?: string
) => {
  const allRoutes = isEnterprise ? enterpriseRoutes : routes;
  const userSpecificRoutes = allRoutes
    ?.map((route) => {
      const isAuthorized = route?.requiredAuthLevel?.some((requiredRole) =>
        userRoles?.includes(requiredRole as Role)
      );

      if (route.name === "Dashboard") {
        if (
          !userRoles?.includes(EmployeeTypes.LEAVE_EMPLOYEE) &&
          !userRoles?.includes(ManagerTypes.PEOPLE_MANAGER) &&
          !userRoles?.includes(ManagerTypes.ATTENDANCE_MANAGER)
        ) {
          return null;
        }
        const isLeaveEmployeeWithoutManagerOrAdminRole =
          userRoles?.includes(EmployeeTypes.LEAVE_EMPLOYEE) &&
          !userRoles?.some((role) =>
            [ManagerTypes.LEAVE_MANAGER, AdminTypes.LEAVE_ADMIN].includes(
              role as ManagerTypes | AdminTypes
            )
          );

        if (isLeaveEmployeeWithoutManagerOrAdminRole) {
          const hasAdditionalRolesForLeaveEmployee = userRoles?.some((role) =>
            [
              ManagerTypes.PEOPLE_MANAGER,
              ManagerTypes.ATTENDANCE_MANAGER,
              EmployeeTypes.LEAVE_EMPLOYEE
            ].includes(role as ManagerTypes)
          );

          if (hasAdditionalRolesForLeaveEmployee) {
            return {
              id: route.id,
              name: route.name,
              url: ROUTES.DASHBOARD.BASE,
              icon: route.icon,
              hasSubTree: false
            };
          }

          return;
        }
      }

      if (route.name === "People") {
        const isNotPeopleEmployee = userRoles?.some((role) =>
          [AdminTypes.PEOPLE_ADMIN, ManagerTypes.PEOPLE_MANAGER].includes(
            role as AdminTypes | ManagerTypes
          )
        );

        if (
          !isNotPeopleEmployee &&
          userRoles?.includes(EmployeeTypes.PEOPLE_EMPLOYEE)
        ) {
          return {
            id: route.id,
            name: route.name,
            url: ROUTES.PEOPLE.DIRECTORY,
            icon: route.icon,
            hasSubTree: false
          };
        }
      }

      if (route.name === "Timesheet") {
        if (!userRoles?.includes(EmployeeTypes.ATTENDANCE_EMPLOYEE)) {
          return null;
        }

        const isNotAttendanceEmployee = userRoles?.some((role) =>
          [
            AdminTypes.ATTENDANCE_ADMIN,
            ManagerTypes.ATTENDANCE_MANAGER
          ].includes(role as AdminTypes | ManagerTypes)
        );

        if (
          !isNotAttendanceEmployee &&
          userRoles?.includes(EmployeeTypes.ATTENDANCE_EMPLOYEE)
        ) {
          return {
            id: route.id,
            name: route.name,
            url: ROUTES.TIMESHEET.MY_TIMESHEET,
            icon: route.icon,
            hasSubTree: false
          };
        }
      }

      if (route.name === "Leave") {
        if (!userRoles?.includes(EmployeeTypes.LEAVE_EMPLOYEE)) {
          return null;
        }
        const isLeaveEmployeeWithoutManagerOrAdminRole =
          userRoles?.includes(EmployeeTypes.LEAVE_EMPLOYEE) &&
          !userRoles?.some((role) =>
            [ManagerTypes.LEAVE_MANAGER, AdminTypes.LEAVE_ADMIN].includes(
              role as ManagerTypes | AdminTypes
            )
          );

        if (isLeaveEmployeeWithoutManagerOrAdminRole) {
          const hasAdditionalRolesForLeaveEmployee =
            userRoles?.includes(EmployeeTypes.LEAVE_EMPLOYEE) &&
            userRoles?.some((role) =>
              [
                ManagerTypes.PEOPLE_MANAGER,
                ManagerTypes.ATTENDANCE_MANAGER,
                AdminTypes.PEOPLE_ADMIN,
                AdminTypes.ATTENDANCE_ADMIN
              ].includes(role as ManagerTypes | AdminTypes)
            );

          if (hasAdditionalRolesForLeaveEmployee) {
            return {
              id: route.id,
              name: "Leave Requests",
              url: ROUTES.LEAVE.MY_REQUESTS,
              icon: route.icon,
              hasSubTree: false
            };
          }

          return;
        }
      }

      if (route.name === "Settings") {
        const isEmployee = userRoles?.every((role) =>
          Object.values(EmployeeTypes).includes(role as EmployeeTypes)
        );

        const isSuperAdmin = userRoles?.includes(AdminTypes.SUPER_ADMIN);

        const isGoogle = globalLoginMethod === "GOOGLE";

        if (isEmployee && isGoogle) {
          return null;
        }

        if (!isSuperAdmin) {
          return {
            id: route.id,
            name: route.name,
            url: ROUTES.SETTINGS.ACCOUNT,
            icon: route.icon,
            hasSubTree: false
          };
        }
      }

      if (route.name === "Configurations") {
        const isSuperAdmin = userRoles?.some((role) =>
          [AdminTypes.SUPER_ADMIN].includes(role as AdminTypes)
        );

        if (isSuperAdmin) {
          const subRoutes = route.subTree?.filter((subRoute) => {
            if (
              subRoute.name === "Attendance" &&
              !userRoles?.includes(EmployeeTypes.ATTENDANCE_EMPLOYEE)
            ) {
              return false;
            }
            return subRoute.requiredAuthLevel?.some((requiredRole) =>
              userRoles?.includes(requiredRole as Role)
            );
          });

          return {
            id: route.id,
            name: route.name,
            url: ROUTES.CONFIGURATIONS.BASE,
            icon: route.icon,
            hasSubTree: route.hasSubTree,
            subTree: subRoutes
          };
        }
      }

      if (route.name === "Sign") {
        const isFeatureEnabled =
          process.env.NEXT_PUBLIC_ESIGN_FEATURE_TOGGLE === "true";
        if (isFeatureEnabled) {
          const isEsignEmployeeWithoutManagerOrAdminRole = userRoles?.some(
            (role) =>
              [SenderRoleTypes.ESIGN_SENDER, AdminTypes.ESIGN_ADMIN].includes(
                role as AdminTypes | SenderRoleTypes
              )
          );

          if (!isEsignEmployeeWithoutManagerOrAdminRole) {
            return {
              id: route.id,
              name: route.name,
              url: ROUTES.SIGN.INBOX,
              icon: route.icon,
              hasSubTree: false
            };
          }
        } else {
          return null;
        }
      }

      if (isAuthorized && route?.hasSubTree) {
        const subRoutes = route.subTree?.filter((subRoute) =>
          subRoute.requiredAuthLevel?.some((requiredRole) =>
            userRoles?.includes(requiredRole as Role)
          )
        );

        if (subRoutes && subRoutes?.length > 0) {
          return {
            id: route.id,
            name: route.name,
            url: route.url,
            icon: route.icon,
            hasSubTree: route.hasSubTree,
            subTree: subRoutes
          };
        }
      } else if (isAuthorized) {
        return {
          id: route.id,
          name: route.name,
          url: route.url,
          icon: route.icon,
          hasSubTree: route.hasSubTree
        };
      }
    })
    .filter(Boolean);

  return userSpecificRoutes;
};

export default getDrawerRoutes;
