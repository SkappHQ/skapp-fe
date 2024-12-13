import axios, { InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

import { getApiUrl } from "./getConstants";

const getSubDomain = (url: string, multipleValues: boolean = false) => {
  const subdomain = multipleValues ? url.split(".") : url.split(".")[0];
  return subdomain;
};

export const tenantID =
  typeof window !== "undefined" ? getSubDomain(window.location.hostname) : "";

const authFetch = axios.create({
  baseURL: getApiUrl()
});

//  request interceptor
authFetch.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession();

    if (
      session?.user.accessToken &&
      !config.url?.includes("/refresh-token") &&
      !config.url?.includes("/app-setup-status") &&
      !config.url?.includes("/ep/auth/signup/super-admin/sso/google")
    ) {
      config.headers.Authorization = `Bearer ${session?.user.accessToken}`;
    }

    if (
      !config.url?.includes("/app-setup-status") &&
      !config.url?.includes("/ep/auth/signup/super-admin/sso/google") &&
      !config.url?.includes("/ep/auth/signup/super-admin") &&
      !config.url?.includes("/ep/auth/otp/generate") &&
      !config.url?.includes("/ep/auth/otp/verify") &&
      !config.url?.includes("/ep/auth/otp/resend") &&
      !config.url?.includes("/ep/auth/domain/verify") &&
      !config.url?.includes("/ep/organization") &&
      tenantID
    ) {
      config.headers["X-Tenant-ID"] = tenantID;
    }

    return config;
  },
  async (error) => {
    return await Promise.reject(error);
  }
);

//  response interceptor
authFetch.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    return await Promise.reject(error);
  }
);

export default authFetch;
