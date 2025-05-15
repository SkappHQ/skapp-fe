import { DefaultSession, DefaultUser } from "~community/common/types/next-auth";
import { DefaultJWT } from "next-auth/jwt";

import {
  AdminTypes,
  AuthEmployeeType,
  EmployeeTypes,
  ManagerTypes,
  SuperAdminType
} from "~community/common/types/AuthTypes";
import { TenantStatusEnums, TierEnum } from "~enterprise/common/enums/Common";

declare module "~community/common/types/next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      roles?: (AdminTypes | ManagerTypes | EmployeeTypes | SuperAdminType)[];
      accessToken?: string;
      refreshToken?: string;
      tokenDuration?: number;
      isPasswordChangedForTheFirstTime?: boolean;
      email?: string;
      employee?: AuthEmployeeType;
      provider?: string;
      authPic?: string;
      idToken?: string;
      tier?: TierEnum;
      tenantId?: string;
      tenantStatus?: TenantStatusEnums;
      userId?: number;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    id: string;
    name: string;
    username: string;
    password: string;
    roles?: (AdminTypes | ManagerTypes | EmployeeTypes | SuperAdminType)[];
    accessToken?: string;
    refreshToken?: string;
    tokenDuration?: number;
    email?: string;
    employee?: AuthEmployeeType;
    isPasswordChangedForTheFirstTime?: boolean;
    provider?: string;
    authPic?: string;
    idToken?: string;
    tenantId?: string;
    tier?: TierEnum;
    tenantStatus?: TenantStatusEnums;
    userId?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    roles?: (AdminTypes | ManagerTypes | EmployeeTypes | SuperAdminType)[];
    accessToken?: string;
    refreshToken?: string;
    tokenDuration?: number;
    isPasswordChangedForTheFirstTime?: boolean;
    employee?: AuthEmployeeType;
    email?: string;
    provider?: string;
    authPic?: string;
    idToken?: string;
    tenantId?: string;
    tier?: TierEnum;
    tenantStatus?: TenantStatusEnums;
    userId?: number;
  }
}
