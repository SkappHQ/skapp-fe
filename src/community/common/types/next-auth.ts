import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

import {
  AdminTypes,
  AuthEmployeeType,
  EmployeeTypes,
  ManagerTypes,
  SuperAdminType
} from "~community/common/types/AuthTypes";

declare module "next-auth" {
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
  }
}
