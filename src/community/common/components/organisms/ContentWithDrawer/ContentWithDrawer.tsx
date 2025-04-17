import { Stack } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";

import TimeWidgetPopupController from "~community/attendance/components/organisms/TimeWidgetPopupController/TimeWidgetPopupController";
import ToastMessage from "~community/common/components/molecules/ToastMessage/ToastMessage";
import AppBar from "~community/common/components/organisms/AppBar/AppBar";
import Drawer from "~community/common/components/organisms/Drawer/Drawer";
import {
  initialState,
  useToast
} from "~community/common/providers/ToastProvider";
import { handleMainContentFocus } from "~community/common/utils/keyboardUtils";
import MyRequestModalController from "~community/leave/components/organisms/MyRequestModalController/MyRequestModalController";
import QuickSetupModalController from "~enterprise/common/components/organisms/QuickSetupModalController/QuickSetupModalController";

import styles from "./styles";

interface Props {
  children: ReactNode;
}

const ContentWithDrawer = ({ children }: Props) => {
  const classes = styles();

  const { toastMessage, setToastMessage } = useToast();

  return (
    <>
      <Link href="#main-content" onClick={handleMainContentFocus} />
      <Stack sx={classes.protectedWrapper}>
        <Drawer />
        <Stack sx={classes.contentWrapper}>
          <AppBar />
          <main id="main-content">{children}</main>
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
      <QuickSetupModalController />
    </>
  );
};

export default ContentWithDrawer;
