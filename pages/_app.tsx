import { Theme } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import App, { AppContext } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSSR } from "react-i18next";

import FullScreenLoader from "~community/common/components/molecules/FullScreenLoader/FullScreenLoader";
import BaseLayout from "~community/common/components/templates/BaseLayout/BaseLayout";
import CommunityWrapper from "~community/common/components/templates/CommunityWrapper/CommunityWrapper";
import { appModes } from "~community/common/constants/configs";
import { SessionContextProvider } from "~community/common/providers/SessionProvider";
import { theme } from "~community/common/theme/theme";
import { themeSelector } from "~community/common/theme/themeSelector";
import { MyAppPropsType } from "~community/common/types/CommonTypes";
import { getDataFromLocalStorage } from "~community/common/utils/accessLocalStorage";
import "~enterprise/common/components/atoms/driverJsPopover/styles.css";
import EnterpriseWrapper from "~enterprise/common/components/templates/EnterpriseWrapper/EnterpriseWrapper";
import { useGetEnvironment } from "~enterprise/common/hooks/useGetEnvironment";
import { initializeHotjar } from "~enterprise/common/utils/monitoring";
import i18n from "~i18n";
import "~styles/global.css";

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  initialI18nStore,
  initialLanguage
}: MyAppPropsType) {
  const [newTheme, setNewTheme] = useState<Theme>(theme);
  useSSR(initialI18nStore, initialLanguage);

  useEffect(() => {
    if (getDataFromLocalStorage("brandingData")) {
      const selectedTheme = themeSelector(
        getDataFromLocalStorage("brandingData")?.brand_color?.primary.main ?? ""
      );
      setNewTheme(selectedTheme);
    } else {
      setNewTheme(theme);
    }

    if (process.env.NEXT_PUBLIC_MODE === appModes.ENTERPRISE) {
      initializeHotjar();
    }
  }, []);

  function RouteChangeLoader() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const handleStart = (url: string): void => {
        url !== router.asPath && setLoading(true);
      };

      const handleComplete = (): void => {
        setLoading(false);
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

    return <>{loading && <FullScreenLoader />}</>;
  }

  const isCommunityMode = useGetEnvironment() !== appModes.COMMUNITY;

  const appContent = (
    <>
      <RouteChangeLoader />
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </>
  );

  return (
    <SessionProvider session={session}>
      <SessionContextProvider>
        {isCommunityMode ? (
          <CommunityWrapper theme={newTheme}>{appContent}</CommunityWrapper>
        ) : (
          <EnterpriseWrapper theme={newTheme}>{appContent}</EnterpriseWrapper>
        )}
      </SessionContextProvider>
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
