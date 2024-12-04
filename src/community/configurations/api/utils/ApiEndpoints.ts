import { moduleAPIPath } from "~community/common/constants/configs";
import { Modules } from "~community/common/enums/CommonEnums";

export const timeConfigurationEndPoints = {
  GET_DEFAULT_CAPACITY: () => `${moduleAPIPath.TIME}/config`
};

export const userRolesEndPoints = {
  GET_USER_ROLES: `${moduleAPIPath.ROLES}/system`,
  GET_USER_ROLE_RESTRICTIONS: (module: Modules) =>
    `${moduleAPIPath.ROLES}/restrictions/${module}`,
  UPDATE_USER_ROLE_RESTRICTIONS: `${moduleAPIPath.ROLES}/restrictions`,
  SUPER_ADMIN_COUNT: `${moduleAPIPath.ROLES}/super-admin-count`,
  GET_ALLOWED_GRANTABLE_PERMISSIONS: `${moduleAPIPath.ROLES}`
};
