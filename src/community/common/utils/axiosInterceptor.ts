import axios, { InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

import { getApiUrl } from "./getConstants";

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
      !config.url?.includes("/app-setup-status")
    ) {
      config.headers.Authorization = `Bearer ${session?.user.accessToken}`;
    }

    config.headers["X-Tenant-ID"] = "abcd";

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
