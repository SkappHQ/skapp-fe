import { config } from "~middleware";

import ROUTES from "../constants/routes";
import ENTERPRISE_ROUTES from "~enterprise/common/constants/enterpriseRoutes";

export const IsProtectedUrl = (asPath: string): boolean => {
  const drawerHiddenProtectedRoutes = [
    ROUTES.ORGANIZATION.SETUP,
    ROUTES.AUTH.RESET_PASSWORD,
    ROUTES.AUTH.VERIFY,
    ROUTES.AUTH.VERIFY_SUCCESS,
    ROUTES.AUTH.VERIFY_ACCOUNT_RESET_PASSWORD,
    ENTERPRISE_ROUTES.REMOVE_PEOPLE,
    ENTERPRISE_ROUTES.CHANGE_SUPERVISORS,
    ENTERPRISE_ROUTES.SUBSCRIPTION
  ];

  const protectedPaths = config.matcher
    .map((path) => path.replace(/\/:path\*$/, ""))
    .filter((path) => !drawerHiddenProtectedRoutes.includes(path));

  return protectedPaths.some(
    (path) =>
      !asPath.includes("/signin") &&
      !asPath.includes("/signup") &&
      asPath.includes(path)
  );
};

export const decodeJWTToken = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decodedToken = JSON.parse(atob(base64));
  return decodedToken;
};
