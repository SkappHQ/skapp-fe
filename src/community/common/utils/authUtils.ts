import { config } from "~middleware";

import ROUTES from "../constants/routes";

export const drawerHiddenProtectedRoutes = [
  ROUTES.ORGANIZATION.SETUP,
  ROUTES.AUTH.RESET_PASSWORD,
  ROUTES.AUTH.VERIFY,
  ROUTES.AUTH.VERIFY_SUCCESS,
  ROUTES.AUTH.VERIFY_ACCOUNT_RESET_PASSWORD,
  ROUTES.SETTINGS.PAYMENT,
  ROUTES.REMOVE_PEOPLE,
  ROUTES.CHANGE_SUPERVISORS,
  ROUTES.SUBSCRIPTION,
  ROUTES.SIGN.CREATE_DOCUMENT,
  ROUTES.SIGN.SIGN
];

export const IsAProtectedUrlWithDrawer = (asPath: string): boolean => {
  const protectedPaths = config.matcher
    .map((path) => path.replace(/\/:path\*$/, ""))
    .filter((path) => !drawerHiddenProtectedRoutes.includes(path));

  return protectedPaths.some(
    (path) =>
      !asPath.includes(ROUTES.AUTH.SIGNIN) &&
      !asPath.includes(ROUTES.AUTH.SIGNUP) &&
      asPath.includes(path)
  );
};

export const decodeJWTToken = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decodedToken = JSON.parse(atob(base64));
  return decodedToken;
};
