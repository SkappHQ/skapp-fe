import {
  QueryCache,
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { ReactNode, useState } from "react";

import {
  COMMON_ERROR_INVALID_TOKEN,
  COMMON_ERROR_SYSTEM_VERSION_MISMATCH,
  COMMON_ERROR_TOKEN_EXPIRED,
  COMMON_ERROR_USER_VERSION_MISMATCH
} from "../constants/errorMessageKeys";

const TanStackProvider = ({ children }: { children: ReactNode }) => {
  const { update } = useSession();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: async (error: any) => {
            if (
              error?.response?.data?.results?.[0]?.messageKey ===
                COMMON_ERROR_INVALID_TOKEN ||
              error?.response?.data?.results?.[0]?.messageKey ===
                COMMON_ERROR_TOKEN_EXPIRED ||
              error?.response?.data?.results?.[0]?.messageKey ===
                COMMON_ERROR_SYSTEM_VERSION_MISMATCH ||
              error?.response?.data?.results?.[0]?.messageKey ===
                COMMON_ERROR_USER_VERSION_MISMATCH
            ) {
              try {
                await update();
              } catch (updateError) {
                await signOut({
                  redirect: true,
                  callbackUrl: "/system-update"
                });
                console.error("Failed to update session:", updateError);
              }
            }
          }
        })
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanStackProvider;
