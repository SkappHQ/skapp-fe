import { Backdrop, CircularProgress } from "@mui/material";
import { Theme, ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import App, { AppContext } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { hotjar } from "react-hotjar";
import { I18nextProvider, useSSR } from "react-i18next";

import BaseLayout from "~community/common/components/templates/BaseLayout/BaseLayout";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { ToastProvider } from "~community/common/providers/ToastProvider";
import { WebSocketProvider } from "~community/common/providers/WebSocketProvider";
import { theme } from "~community/common/theme/theme";
import { themeSelector } from "~community/common/theme/themeSelector";
import { MyAppPropsType } from "~community/common/types/CommonTypes";
import { getDataFromLocalStorage } from "~community/common/utils/accessLocalStorage";
import i18n from "~i18n";
import "~styles/global.css";

import Error from "./_error";

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  initialI18nStore,
  initialLanguage
}: MyAppPropsType) {
  const [newTheme, setNewTheme] = useState<Theme>(theme);
  const [queryClient] = useState(() => new QueryClient());
  useSSR(initialI18nStore, initialLanguage);

  // added for testing purpose, should be removed once the MT setup is done
  const getRandomTenant = () => {
    const items = ["tenant1", "tenant2", "tenant3"];
    return items[Math.floor(Math.random() * items?.length)];
  };

  useEffect(() => {
    if (getDataFromLocalStorage("brandingData")) {
      const selectedTheme = themeSelector(
        getDataFromLocalStorage("brandingData")?.brand_color?.primary.main ?? ""
      );
      setNewTheme(selectedTheme);
    } else {
      setNewTheme(theme);
    }

    if (process.env.NODE_ENV === "production") {
      hotjar.initialize({
        id: Number(process.env.NEXT_PUBLIC_HOTJAR_SITE_ID),
        sv: Number(process.env.NEXT_PUBLIC_HOTJAR_VERSION)
      });

      // Retrieve tenant ID from the random function temporarily
      const tenantId = getRandomTenant() ?? "default-tenant";

      // Record tenant information in Hotjar
      if (hotjar.initialized()) {
        hotjar.identify(`tenant`, { tenantId });
      }
    }
  }, []);

  function RouteChangeLoader() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const handleStart = (url: string): void => {
        url !== router.asPath && setLoading(true);
      };

      const handleComplete = (url: string): void => {
        url === router.asPath && setLoading(false);
      };

      router.events.on("routeChangeStart", handleStart);
      router.events.on("routeChangeComplete", handleComplete);
      router.events.on("routeChangeError", handleComplete);

      return () => {
        router.events.off("routeChangeStart", handleStart);
        router.events.off("routeChangeComplete", handleComplete);
        router.events.off("routeChangeError", handleComplete);
      };
    }, [router.asPath, router.events]);

    return (
      <Backdrop
        sx={(theme) => ({
          color: theme.palette.text.whiteText,
          zIndex: ZIndexEnums.MAX
        })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <SessionProvider session={session}>
      <WebSocketProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={newTheme}>
            <I18nextProvider i18n={i18n}>
              <ToastProvider>
                <ErrorBoundary FallbackComponent={Error}>
                  <RouteChangeLoader />
                  <BaseLayout>
                    <Component {...pageProps} />
                  </BaseLayout>
                </ErrorBoundary>
              </ToastProvider>
              <ReactQueryDevtools initialIsOpen={false} position="bottom" />
            </I18nextProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </WebSocketProvider>
    </SessionProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  if (typeof window === "undefined") {
    return {
      ...appProps,
      initialI18nStore: i18n.store.data,
      initialLanguage: i18n.language
    };
  }

  return { ...appProps };
};

export default MyApp;
