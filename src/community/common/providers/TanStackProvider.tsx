import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getSession, signOut, useSession } from "next-auth/react";
import { ReactNode, useEffect, useRef, useState } from "react";

import {
  COMMON_ERROR_INVALID_TOKEN,
  COMMON_ERROR_SYSTEM_VERSION_MISMATCH,
  COMMON_ERROR_TOKEN_EXPIRED,
  COMMON_ERROR_USER_VERSION_MISMATCH
} from "~community/common/constants/errorMessageKeys";
import authFetch, { tenantID } from "~community/common/utils/axiosInterceptor";

import { unitConversion } from "../constants/configs";
import ROUTES from "../constants/routes";

const TanStackProvider = ({ children }: { children: ReactNode }) => {
  const { update, data: session } = useSession();
  const refreshPromiseRef = useRef<Promise<void> | null>(null);

  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        mutations: {
          onMutate: async () => {
            if (!navigator.onLine) {
              throw new Error("Network error: No internet connection");
            }
          }
        }
      }
    });
  });

  const handleTokenRefresh = async () => {
    if (!refreshPromiseRef.current) {
      refreshPromiseRef.current = (async () => {
        try {
          await update();
          queryClient.invalidateQueries();
        } catch (error) {
          console.error("Token refresh failed:", error);
          await signOut({
            redirect: true,
            callbackUrl: ROUTES.AUTH.SYSTEM_UPDATE
          });
        } finally {
          setTimeout(() => {
            refreshPromiseRef.current = null;
          }, 5000);
        }
      })();
    }

    return refreshPromiseRef.current;
  };

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = authFetch.interceptors.request.use(
      async (config) => {
        const session = await getSession();

        const isTokenExpired =
          session?.user?.tokenDuration &&
          Date.now() >
            (session.user.tokenDuration as number) *
              unitConversion.MILLISECONDS_PER_SECOND;

        if (isTokenExpired && !config.url?.includes("/signin")) {
          await handleTokenRefresh();

          const freshSession = await getSession();
          if (freshSession?.user.accessToken) {
            config.headers.Authorization = `Bearer ${freshSession.user.accessToken}`;
          }
        } else if (
          session?.user.accessToken &&
          !config.url?.includes("/refresh-token") &&
          !config.url?.includes("/app-setup-status")
        ) {
          config.headers.Authorization = `Bearer ${session.user.accessToken}`;
        }

        const isEnterpriseMode = process.env.NEXT_PUBLIC_MODE === "enterprise";
        if (isEnterpriseMode && tenantID) {
          config.headers["X-Tenant-ID"] = tenantID;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    const responseInterceptor = authFetch.interceptors.response.use(
      (response) => response,
      async (error) => {
        const errorMessageKey = error?.response?.data?.results?.[0]?.messageKey;

        if (
          errorMessageKey === COMMON_ERROR_SYSTEM_VERSION_MISMATCH ||
          errorMessageKey === COMMON_ERROR_USER_VERSION_MISMATCH ||
          errorMessageKey === COMMON_ERROR_TOKEN_EXPIRED
        ) {
          await handleTokenRefresh();

          const originalRequest = error.config;
          const freshSession = await getSession();
          if (freshSession?.user.accessToken) {
            originalRequest.headers.Authorization = `Bearer ${freshSession.user.accessToken}`;
            return authFetch(originalRequest);
          }
        }

        if (errorMessageKey === COMMON_ERROR_INVALID_TOKEN) {
          await signOut();
        }

        if (error?.response?.status === 401) {
          return;
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Clean up both interceptors
      authFetch.interceptors.request.eject(requestInterceptor);
      authFetch.interceptors.response.eject(responseInterceptor);
    };
  }, [session, update]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanStackProvider;
