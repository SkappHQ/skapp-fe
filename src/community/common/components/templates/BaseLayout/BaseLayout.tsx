import { useRouter } from "next/router";
import { ReactNode, useEffect, useMemo, useState } from "react";

import FullScreenLoader from "~community/common/components/molecules/FullScreenLoader/FullScreenLoader";
import ProtectedContent from "~community/common/components/organisms/ProtectedContent/ProtectedContent";
import UnProtectedContent from "~community/common/components/organisms/UnProtectedContent/UnProtectedContent";
import { appModes } from "~community/common/constants/configs";
import useSessionData from "~community/common/hooks/useSessionData";
import { IsAProtectedUrlWithDrawer } from "~community/common/utils/authUtils";
import { tenantID } from "~community/common/utils/axiosInterceptor";
import { setDeviceToken } from "~enterprise/common/api/setDeviceTokenApi";
import useFcmToken from "~enterprise/common/hooks/useFCMToken";
import { useGetEnvironment } from "~enterprise/common/hooks/useGetEnvironment";
import { useCommonEnterpriseStore } from "~enterprise/common/store/commonStore";
import { useGetGlobalLoginMethod } from "~enterprise/people/api/GlobalLoginMethodApi";

interface Props {
  children: ReactNode;
}

const BaseLayout = ({ children }: Props) => {
  const { asPath } = useRouter();

  const { sessionStatus } = useSessionData();

  const { token } = useFcmToken();

  const environment = useGetEnvironment();
  const isEnterprise = environment === appModes.ENTERPRISE;

  const [isClient, setIsClient] = useState<boolean>(false);

  const { setGlobalLoginMethod } = useCommonEnterpriseStore((state) => ({
    setGlobalLoginMethod: state.setGlobalLoginMethod
  }));

  const { data: globalLogin, isLoading: isGlobalLoginMethodLoading } =
    useGetGlobalLoginMethod(isEnterprise, tenantID as string);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (globalLogin) {
      setGlobalLoginMethod(globalLogin);
    }
  }, [globalLogin]);

  const isProtectedRouteWithDrawer = useMemo(() => {
    return isClient ? IsAProtectedUrlWithDrawer(asPath) : false;
  }, [asPath, isClient]);

  useEffect(() => {
    if (isProtectedRouteWithDrawer && token) {
      setDeviceToken(token);
    }
  }, [isProtectedRouteWithDrawer, token]);

  const renderComponent = useMemo(() => {
    switch (sessionStatus) {
      case "loading":
        return <FullScreenLoader />;
      case "authenticated": {
        if (isEnterprise && isGlobalLoginMethodLoading) {
          return <FullScreenLoader />;
        }

        if (isProtectedRouteWithDrawer) {
          return <ProtectedContent>{children}</ProtectedContent>;
        }

        return <UnProtectedContent>{children}</UnProtectedContent>;
      }
      case "unauthenticated":
        return <UnProtectedContent>{children}</UnProtectedContent>;
      default:
        return <></>;
    }
  }, [
    sessionStatus,
    children,
    isEnterprise,
    isGlobalLoginMethodLoading,
    isProtectedRouteWithDrawer
  ]);

  return renderComponent;
};

export default BaseLayout;
