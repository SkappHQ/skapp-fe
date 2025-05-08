import { Theme, ThemeProvider } from "@mui/material/styles";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";

import TanStackProvider from "~community/common/providers/TanStackProvider";
import { ToastProvider } from "~community/common/providers/ToastProvider";
import { WebSocketProvider } from "~community/common/providers/WebSocketProvider";
import i18n from "~i18n";

import Error from "../../../../../../pages/_error";

interface CommunityWrapperProps {
  children: ReactNode;
  theme: Theme;
}

const CommunityWrapper = ({ children, theme }: CommunityWrapperProps) => {
  return (
    <WebSocketProvider>
      <TanStackProvider>
        <ThemeProvider theme={theme}>
          <I18nextProvider i18n={i18n}>
            <ToastProvider>
              <ErrorBoundary FallbackComponent={Error}>
                {children}
              </ErrorBoundary>
            </ToastProvider>
            <ReactQueryDevtools initialIsOpen={false} position="bottom" />
          </I18nextProvider>
        </ThemeProvider>
      </TanStackProvider>
    </WebSocketProvider>
  );
};

export default CommunityWrapper;
