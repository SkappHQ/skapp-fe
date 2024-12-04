import ROUTES from "~community/common/constants/routes";
import {
  AdminTypes,
  EmployeeTypes,
  ManagerTypes
} from "~community/common/types/AuthTypes";
import getDrawerRoutes from "~community/common/utils/getDrawerRoutes";

describe("getDrawerRoutes", () => {
  // Test Super Admin (should have full access)
  it("should return all routes for Super Admin", () => {
    const superAdminRoles = [AdminTypes.SUPER_ADMIN];
    const routes = getDrawerRoutes(superAdminRoles);

    expect(routes.length).toBeGreaterThan(4); // Expect multiple routes
    expect(routes.some((route) => route?.name === "Dashboard")).toBeTruthy();
    expect(
      routes.some((route) => route?.name === "Configurations")
    ).toBeTruthy();
  });

  // Test People Employee without Admin/Manager
  it("should return People route with Directory path for People Employee", () => {
    const peopleEmployeeRoles = [EmployeeTypes.PEOPLE_EMPLOYEE];
    const routes = getDrawerRoutes(peopleEmployeeRoles);

    const peopleRoute = routes.find((route) => route?.name === "People");
    expect(peopleRoute).toBeTruthy();
    expect(peopleRoute?.url).toBe(ROUTES.PEOPLE.DIRECTORY);
    expect(peopleRoute?.hasSubTree).toBeFalsy();
  });

  // Test Attendance Employee without Admin/Manager
  it("should return Timesheet route with My Timesheet path for Attendance Employee", () => {
    const attendanceEmployeeRoles = [EmployeeTypes.ATTENDANCE_EMPLOYEE];
    const routes = getDrawerRoutes(attendanceEmployeeRoles);

    const timesheetRoute = routes.find((route) => route?.name === "Timesheet");
    expect(timesheetRoute).toBeTruthy();
    expect(timesheetRoute?.url).toBe(ROUTES.TIMESHEET.MY_TIMESHEET);
    expect(timesheetRoute?.hasSubTree).toBeFalsy();
  });

  // Test People Manager (should have full People route with subtrees)
  it("should return full People route for People Manager", () => {
    const peopleManagerRoles = [ManagerTypes.PEOPLE_MANAGER];
    const routes = getDrawerRoutes(peopleManagerRoles);

    const peopleRoute = routes.find((route) => route?.name === "People");
    expect(peopleRoute).toBeTruthy();
    expect(peopleRoute?.hasSubTree).toBeTruthy();
    expect(peopleRoute?.subTree?.length).toBeGreaterThan(1);
  });

  // Test mixed roles
  it("should handle multiple roles correctly", () => {
    const mixedRoles = [
      EmployeeTypes.PEOPLE_EMPLOYEE,
      EmployeeTypes.ATTENDANCE_EMPLOYEE
    ];
    const routes = getDrawerRoutes(mixedRoles);

    const peopleRoute = routes.find((route) => route?.name === "People");
    const timesheetRoute = routes.find((route) => route?.name === "Timesheet");

    expect(peopleRoute).toBeTruthy();
    expect(timesheetRoute).toBeTruthy();
    expect(peopleRoute?.url).toBe(ROUTES.PEOPLE.DIRECTORY);
    expect(timesheetRoute?.url).toBe(ROUTES.TIMESHEET.MY_TIMESHEET);
  });

  // Test Leave Admin (should have full Leave route)
  it("should return full Leave route for Leave Admin", () => {
    const leaveAdminRoles = [AdminTypes.LEAVE_ADMIN];
    const routes = getDrawerRoutes(leaveAdminRoles);

    const leaveRoute = routes.find((route) => route?.name === "Leave");
    expect(leaveRoute).toBeTruthy();
    expect(leaveRoute?.hasSubTree).toBeTruthy();
    expect(leaveRoute?.subTree?.length).toBeGreaterThan(1);
  });

  // Test undefined or empty roles
  it("should handle undefined roles", () => {
    const routes = getDrawerRoutes(undefined);
    expect(routes.length).toBe(0);
  });

  it("should handle empty roles array", () => {
    const routes = getDrawerRoutes([]);
    expect(routes.length).toBe(0);
  });
});

// Additional edge case tests
describe("getDrawerRoutes Edge Cases", () => {
  // Test when user has both employee and manager roles
  it("should prioritize manager routes when multiple roles exist", () => {
    const mixedManagerEmployeeRoles = [
      EmployeeTypes.PEOPLE_EMPLOYEE,
      ManagerTypes.PEOPLE_MANAGER
    ];
    const routes = getDrawerRoutes(mixedManagerEmployeeRoles);

    const peopleRoute = routes.find((route) => route?.name === "People");
    expect(peopleRoute).toBeTruthy();
    expect(peopleRoute?.hasSubTree).toBeTruthy(); // Should have full subtree
    expect(peopleRoute?.subTree?.length).toBeGreaterThan(1);
  });
});
