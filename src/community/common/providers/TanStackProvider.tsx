import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getSession, signOut } from "next-auth/react";
import { ReactNode, useEffect, useRef } from "react";

import {
  COMMON_ERROR_INVALID_TOKEN,
  COMMON_ERROR_SYSTEM_VERSION_MISMATCH,
  COMMON_ERROR_TOKEN_EXPIRED,
  COMMON_ERROR_USER_VERSION_MISMATCH
} from "~community/common/constants/errorMessageKeys";
import authFetch, { tenantID } from "~community/common/utils/axiosInterceptor";

import { unitConversion } from "../constants/configs";
import ROUTES from "../constants/routes";
import { useAppSession } from "./SessionProvider";

// Global refresh token state (outside component to be accessible across renders)
let globalRefreshPromise: Promise<boolean> | null = null;
let lastRefreshTime = 0;
const MIN_REFRESH_INTERVAL = 1000; // Minimum 1 second between refresh attempts

const TanStackProvider = ({ children }: { children: ReactNode }) => {
  const { update } = useAppSession();
  // Use a query client ref to persist across renders and access in async functions
  const queryClientRef = useRef<QueryClient>();

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
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
  }

  /**
   * Handles token refresh with proper locking to prevent multiple concurrent refreshes
   * Returns true if refresh was successful, false otherwise
   */
  const handleTokenRefresh = async (): Promise<boolean> => {
    const currentTime = Date.now();

    // If a refresh is already in progress, return the existing promise
    if (globalRefreshPromise) {
      return globalRefreshPromise;
    }

    // Throttle refresh attempts to prevent hammering the server
    if (currentTime - lastRefreshTime < MIN_REFRESH_INTERVAL) {
      await new Promise((resolve) => setTimeout(resolve, MIN_REFRESH_INTERVAL));
    }

    // Create a new refresh promise
    globalRefreshPromise = (async () => {
      try {
        // Update session which will trigger the NextAuth update callback
        const updatedSession = await update();
        // Verify that we actually got a new token
        if (!updatedSession?.user?.accessToken) {
          console.error(
            "Token refresh failed: No access token in updated session"
          );
          await signOut({
            redirect: true,
            callbackUrl: ROUTES.AUTH.SIGNIN
          });
          return false;
        }

        // Invalidate queries to refetch with new token
        if (queryClientRef.current) {
          queryClientRef.current.invalidateQueries();
        }

        lastRefreshTime = Date.now();
        return true;
      } catch (error) {
        console.error("Token refresh failed:", error);
        await signOut({
          redirect: true,
          callbackUrl: ROUTES.AUTH.SYSTEM_UPDATE
        });
        return false;
      } finally {
        // Clear the global promise reference
        setTimeout(() => {
          globalRefreshPromise = null;
        }, MIN_REFRESH_INTERVAL);
      }
    })();

    return globalRefreshPromise;
  };

  const { data: session } = useAppSession();

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = authFetch.interceptors.request.use(
      async (config) => {
        // Skip authentication for certain routes
        const isAuthRoute =
          config.url?.includes("/refresh-token") ||
          config.url?.includes("/app-setup-status");

        if (isAuthRoute) {
          // Don't add auth headers to auth routes
          return config;
        }

        // Check if token is expired
        const tokenExpiration = session?.user?.tokenDuration as number;
        const currentTime = Date.now() / unitConversion.MILLISECONDS_PER_SECOND;
        const isTokenExpired = tokenExpiration && currentTime > tokenExpiration;

        // If token is expired, refresh before proceeding
        if (isTokenExpired) {
          const refreshSuccessful = await handleTokenRefresh();

          if (!refreshSuccessful) {
            throw new Error("Token refresh failed, request aborted");
          }

          // Get fresh session with new token
          const freshSession = await getSession();
          if (freshSession?.user?.accessToken) {
            config.headers.Authorization = `Bearer ${freshSession.user.accessToken}`;
          } else {
            // Shouldn't reach here if refresh was successful, but just in case
            throw new Error("Missing access token after successful refresh");
          }
        } else if (session?.user?.accessToken) {
          // Token is still valid, use it
          config.headers.Authorization = `Bearer ${session.user.accessToken}`;
        }

        // Add tenant ID header for enterprise mode
        const isEnterpriseMode = process.env.NEXT_PUBLIC_MODE === "enterprise";
        if (isEnterpriseMode && tenantID) {
          config.headers["X-Tenant-ID"] = tenantID;
        } else if (session?.user?.tenantId) {
          // Use tenant ID from session if available
          config.headers["X-Tenant-ID"] = session.user.tenantId;
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
        // Don't retry if request was canceled
        if (error?.message === "canceled") {
          return Promise.reject(error);
        }

        const originalRequest = error.config;
        // Prevent infinite retry loops
        if (originalRequest?._isRetry) {
          return Promise.reject(error);
        }

        const errorKey = error?.response?.data?.results?.[0]?.messageKey;
        const status = error?.response?.status;

        // Handle token related errors
        const isAuthError =
          errorKey === COMMON_ERROR_TOKEN_EXPIRED ||
          errorKey === COMMON_ERROR_INVALID_TOKEN ||
          errorKey === COMMON_ERROR_SYSTEM_VERSION_MISMATCH ||
          errorKey === COMMON_ERROR_USER_VERSION_MISMATCH ||
          status === 401;

        if (isAuthError && !originalRequest?._isRetry) {
          originalRequest._isRetry = true;

          // For invalid token, just sign out
          if (
            errorKey === COMMON_ERROR_INVALID_TOKEN ||
            errorKey === COMMON_ERROR_TOKEN_EXPIRED
          ) {
            await signOut({
              redirect: true,
              callbackUrl: ROUTES.AUTH.SIGNIN
            });
            return Promise.reject(error);
          }

          // For other auth errors, try to refresh the token
          try {
            const refreshSuccessful = await handleTokenRefresh();

            if (refreshSuccessful) {
              // Get fresh session with new token
              if (session?.user?.accessToken) {
                // Update the original request with new token
                originalRequest.headers.Authorization = `Bearer ${session.user.accessToken}`;
                // Retry the original request
                return authFetch(originalRequest);
              }
            }

            // If refresh failed, the signOut has already been called in handleTokenRefresh
            return Promise.reject(error);
          } catch (refreshError) {
            console.error("Error during refresh and retry:", refreshError);
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      // Clean up interceptors on unmount
      authFetch.interceptors.request.eject(requestInterceptor);
      authFetch.interceptors.response.eject(responseInterceptor);
    };
  }, [update]);

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
    </QueryClientProvider>
  );
};

export default TanStackProvider;
