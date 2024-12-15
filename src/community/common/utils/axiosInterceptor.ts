import * as Sentry from "@sentry/react";
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

    return config;
  },
  async (error) => {
    Sentry.captureException(error);
    return await Promise.reject(error);
  }
);

//  response interceptor
authFetch.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    Sentry.captureException(error, {
      extra: {
        request: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        },
        response: {
          status: error.response?.status,
          data: error.response?.data
        }
      }
    });
    return await Promise.reject(error);
  }
);

export default authFetch;
