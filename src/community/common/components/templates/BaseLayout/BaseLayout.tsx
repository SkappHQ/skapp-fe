import { Stack } from "@mui/material";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

import TimeWidgetPopupController from "~community/attendance/components/organisms/TimeWidgetPopupController/TimeWidgetPopupController";
import ToastMessage from "~community/common/components/molecules/ToastMessage/ToastMessage";
import AppBar from "~community/common/components/organisms/AppBar/AppBar";
import Drawer from "~community/common/components/organisms/Drawer/Drawer";
import {
  initialState,
  useToast
} from "~community/common/providers/ToastProvider";
import { IsProtectedUrl } from "~community/common/utils/authUtils";
import MyRequestModalController from "~community/leave/components/organisms/MyRequestModalController/MyRequestModalController";

import styles from "./styles";

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  const { asPath } = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setIsProtected(IsProtectedUrl(asPath));
    }
  }, [asPath, isClient]);

  const classes = styles();

  const { toastMessage, setToastMessage } = useToast();

  if (isProtected) {
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