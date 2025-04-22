import ROUTES from "~community/common/constants/routes";
import { config } from "~middleware";

//Dynamic routes like /sign/sent/:id
export const drawerHiddenDynamicProtectedRoutes = [ROUTES.SIGN.SENT_DETAIL];

export const drawerHiddenProtectedRoutes = [
  ROUTES.ORGANIZATION.SETUP,
  ROUTES.AUTH.RESET_PASSWORD,
  ROUTES.AUTH.VERIFY,
  ROUTES.AUTH.VERIFY_SUCCESS,
  ROUTES.AUTH.VERIFY_RESET_PASSWORD,
  ROUTES.AUTH.VERIFY_ACCOUNT_RESET_PASSWORD,
  ROUTES.SETTINGS.PAYMENT,
  ROUTES.REMOVE_PEOPLE,
  ROUTES.CHANGE_SUPERVISORS,
  ROUTES.SUBSCRIPTION,
  ROUTES.SIGN.SIGN,
  ROUTES.SIGN.CREATE_DOCUMENT,
  ...drawerHiddenDynamicProtectedRoutes
];

const getDrawerHiddenStatus = (asPath: string): boolean => {
  return drawerHiddenProtectedRoutes.some((route) => {
    if (typeof route === "string") {
      return route === asPath;
    } else if (typeof route === "function") {
      try {
        const samplePath = route(123);
        const basePathPattern = samplePath.substring(
          0,
          samplePath.lastIndexOf("/") + 1
        );
        return asPath.startsWith(basePathPattern);
      } catch {
        return false;
      }
    }
    return false;
  });
};

export const IsAProtectedUrlWithDrawer = (asPath: string): boolean => {
  const isADrawerHiddenProtectedRoute = getDrawerHiddenStatus(asPath);

  if (!isADrawerHiddenProtectedRoute) {
    const formattedProtectedPaths = config.matcher.map((path) =>
      path.replace(/\/:path\*$/, "")
    );

    return formattedProtectedPaths.some((path) => {
      return (
        asPath.substring(1).split("/")[0].split("?")[0] === path.split("/")[1]
      );
    });
  }

  return false;
};

export const decodeJWTToken = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decodedToken = JSON.parse(atob(base64));
  return decodedToken;
};
