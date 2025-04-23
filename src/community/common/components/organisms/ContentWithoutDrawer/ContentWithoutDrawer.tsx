import { Stack } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";

import ToastMessage from "~community/common/components/molecules/ToastMessage/ToastMessage";
import { useTranslator } from "~community/common/hooks/useTranslator";
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

  const translateAria = useTranslator("commonAria");

  const { toastMessage, setToastMessage } = useToast();

  return (
    <>
      <Link
        href="#content-without-drawer-main-content"
        onClick={(e) =>
          handleMainContentFocus(e, "content-without-drawer-main-content")
        }
        style={{
          opacity: "0",
          cursor: "default"
        }}
      >
        {translateAria(["skipToMainContent"])}
      </Link>
      <Stack sx={classes.unProtectedWrapper}>
        <main
          id="content-without-drawer-main-content"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%"
          }}
        >
          {children}
        </main>
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
