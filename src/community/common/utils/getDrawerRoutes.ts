import ROUTES from "~community/common/constants/routes";
import {
  AdminTypes,
  EmployeeTypes,
  ManagerTypes,
  SuperAdminType
} from "~community/common/types/AuthTypes";

import routes from "./data/routes";

type Role = AdminTypes | ManagerTypes | EmployeeTypes | SuperAdminType;

const getDrawerRoutes = (userRoles: Role[] | undefined) => {
  const userSpecificRoutes = routes
    .map((route) => {
      const isAuthorized = route?.requiredAuthLevel?.some((requiredRole) =>
        userRoles?.includes(requiredRole)
      );

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
        const isOnlyEmployee = userRoles?.every((role) =>
          Object.values(EmployeeTypes).includes(role as EmployeeTypes)
        );

        if (isOnlyEmployee) {
          return {
            id: route.id,
            name: "Leave Requests",
            url: ROUTES.LEAVE.MY_REQUESTS,
            icon: route.icon,
            hasSubTree: false
          };
        }
      }

      if (isAuthorized && route?.hasSubTree) {
        const subRoutes = route.subTree?.filter((subRoute) =>
          subRoute.requiredAuthLevel?.some((requiredRole) =>
            userRoles?.includes(requiredRole)
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
