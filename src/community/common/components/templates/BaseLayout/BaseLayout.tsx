import { Stack } from "@mui/material";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

import TimeWidgetPopupController from "~community/attendance/components/organisms/TimeWidgetPopupController/TimeWidgetPopupController";
import ToastMessage from "~community/common/components/molecules/ToastMessage/ToastMessage";
import AppBar from "~community/common/components/organisms/AppBar/AppBar";
import Drawer from "~community/common/components/organisms/Drawer/Drawer";
import { appModes } from "~community/common/constants/configs";
import ROUTES from "~community/common/constants/routes";
import {
  initialState,
  useToast
} from "~community/common/providers/ToastProvider";
import { IsProtectedUrl } from "~community/common/utils/authUtils";
import { tenantID } from "~community/common/utils/axiosInterceptor";
import MyRequestModalController from "~community/leave/components/organisms/MyRequestModalController/MyRequestModalController";
import { setDeviceToken } from "~enterprise/common/api/setDeviceTokenApi";
import useFcmToken from "~enterprise/common/hooks/useFCMToken";
import { useGetEnvironment } from "~enterprise/common/hooks/useGetEnvironment";
import { useCommonEnterpriseStore } from "~enterprise/common/store/commonStore";
import { useGetGlobalLoginMethod } from "~enterprise/people/api/GlobalLoginMethodApi";

import styles from "./styles";

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  const classes = styles();

  const { toastMessage, setToastMessage } = useToast();
  const { asPath } = useRouter();

  const { token } = useFcmToken();

  const [isClient, setIsClient] = useState(false);
  const [isProtected, setIsProtected] = useState(false);

  const environment = useGetEnvironment();

  const isEnterprise = environment === appModes.ENTERPRISE;

  const { setGlobalLoginMethod } = useCommonEnterpriseStore((state) => state);

  const { data: globalLogin } = useGetGlobalLoginMethod(
    isEnterprise,
    tenantID as string
  );

  useEffect(() => {
    if (globalLogin) {
      setGlobalLoginMethod(globalLogin);
    }
  }, [globalLogin, setGlobalLoginMethod]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setIsProtected(IsProtectedUrl(asPath));
    }
  }, [asPath, isClient]);

  useEffect(() => {
    if (isProtected && token) {
      setDeviceToken(token);
    }
  }, [isProtected, token]);

  if (
    isProtected &&
    asPath !== ROUTES.SIGN.CREATE_DOCUMENT &&
    (!isEnterprise || globalLogin)
  ) {
    return (
      <>
        <Stack sx={classes.protectedWrapper}>
          <Drawer />
          <Stack sx={classes.contentWrapper}>
            <AppBar />
            {children}
          </Stack>
        </Stack>
        <ToastMessage
          key={toastMessage.key}
          open={toastMessage.open}
          title={toastMessage.title}
          description={toastMessage.description}
          toastType={toastMessage.toastType}
          autoHideDuration={toastMessage.autoHideDuration}
          handleToastClick={toastMessage.handleToastClick}
          isIcon={toastMessage.isIcon}
          onClose={() => setToastMessage(initialState)}
        />
        <TimeWidgetPopupController />
        <MyRequestModalController />
      </>
    );
  }

  return (
    <>
      <Stack sx={classes.unProtectedWrapper}>
        {children}
        <ToastMessage
          key={toastMessage.key}
          open={toastMessage.open}
          title={toastMessage.title}
          description={toastMessage.description}
          toastType={toastMessage.toastType}
          autoHideDuration={toastMessage.autoHideDuration}
          handleToastClick={toastMessage.handleToastClick}
          isIcon={toastMessage.isIcon}
          onClose={() => setToastMessage(initialState)}
        />
      </Stack>
    </>
  );
};

export default BaseLayout;
