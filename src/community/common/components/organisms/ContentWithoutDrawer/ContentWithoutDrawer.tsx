import { Stack } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";

import ToastMessage from "~community/common/components/molecules/ToastMessage/ToastMessage";
import {
  initialState,
  useToast
} from "~community/common/providers/ToastProvider";
import { handleMainContentFocus } from "~community/common/utils/keyboardUtils";

import styles from "./styles";

interface Props {
  children: ReactNode;
}

const ContentWithoutDrawer = ({ children }: Props) => {
  const classes = styles();

  const { toastMessage, setToastMessage } = useToast();

  return (
    <>
      <Link href="#main-content" onClick={handleMainContentFocus} />
      <Stack sx={classes.unProtectedWrapper}>
        <main id="main-content">{children}</main>
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

export default ContentWithoutDrawer;
