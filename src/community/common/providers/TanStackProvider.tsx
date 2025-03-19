import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";

import {
  COMMON_ERROR_INVALID_TOKEN,
  COMMON_ERROR_SYSTEM_VERSION_MISMATCH,
  COMMON_ERROR_TOKEN_EXPIRED,
  COMMON_ERROR_USER_VERSION_MISMATCH
} from "../constants/errorMessageKeys";
import authFetch from "../utils/axiosInterceptor";

const TanStackProvider = ({ children }: { children: ReactNode }) => {
  const { update, data: session } = useSession();

  const [queryClient] = useState(() => new QueryClient());

  const handleTokenRefresh = async () => {
    try {
      await update();
      queryClient.invalidateQueries();
    } catch (error) {
      console.error("Token refresh failed:", error);
      await signOut({
        redirect: true,
        callbackUrl: "/system-update"
      });
    }
  };

  useEffect(() => {
    const interceptor = authFetch.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error?.response?.data?.results?.[0]?.messageKey ===
            COMMON_ERROR_TOKEN_EXPIRED ||
          error?.response?.data?.results?.[0]?.messageKey ===
            COMMON_ERROR_SYSTEM_VERSION_MISMATCH ||
          error?.response?.data?.results?.[0]?.messageKey ===
            COMMON_ERROR_USER_VERSION_MISMATCH
        ) {
          await handleTokenRefresh();
        }

        if (
          error?.response?.data?.results?.[0]?.messageKey ===
          COMMON_ERROR_INVALID_TOKEN
        ) {
          await signOut({
            redirect: true,
            callbackUrl: "/system-update"
          });
        }

        if (error?.response?.status === 401) {
          return;
        }
        return Promise.reject(error);
      }
    );

    return () => {
      authFetch.interceptors.response.eject(interceptor);
    };
  }, [session, update]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanStackProvider;
