import { Stack, Theme, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { FocusEvent, KeyboardEvent, useRef, useState } from "react";

import Popper from "~community/common/components/molecules/Popper/Popper";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import {
  handleMainContentFocus,
  shouldActivateButton,
  shouldCollapseDropdown
} from "~community/common/utils/keyboardUtils";

import styles from "./styles";

const SkipToContentPopup = ({ id }: { id: string }) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const translateAria = useTranslator("commonAria", "skipToContent");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPopperOpen, setIsPopperOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOpenPopper = (target: HTMLElement) => {
    setAnchorEl(target);
    setIsPopperOpen(true);
  };

  const handleClosePopper = () => {
    setIsPopperOpen(false);
  };

  const handleOnButtonFocus = (event: FocusEvent<HTMLButtonElement>) => {
    handleOpenPopper(event.currentTarget);
  };

  const handleOnButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isPopperOpen && shouldCollapseDropdown(event.key)) {
      event.stopPropagation();
      handleClosePopper();
    }
  };

  const handleOnLinkKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (shouldActivateButton(event.key)) {
      handleClosePopper();
      handleMainContentFocus(event, id);
    }
  };

  const handleCloseFromPopper = () => {
    setIsPopperOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        role="button"
        aria-label={translateAria(["label"])}
        aria-haspopup="dialog"
        aria-expanded={isPopperOpen}
        aria-controls={isPopperOpen ? "skip-to-content-popup" : undefined}
        onFocus={handleOnButtonFocus}
        onKeyDown={handleOnButtonKeyDown}
        style={{
          position: "absolute",
          left: "0px",
          top: "0px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          zIndex: ZIndexEnums.MAX,
          outline: "none"
        }}
      >
        {translateAria(["label"])}
      </button>
      <Popper
        id={isPopperOpen ? "skip-to-content-popup" : undefined}
        open={isPopperOpen}
        anchorEl={anchorEl}
        position="bottom-end"
        handleClose={handleCloseFromPopper}
        containerStyles={classes.popperContainer}
        ariaRole="dialog"
        ariaLabel={translateAria(["skipTo"])}
      >
        <Stack>
          <Typography variant="label">{translateAria(["skipTo"])}</Typography>
          <Link href={`#${id}`}>
            <Typography
              component="a"
              variant="body2"
              onKeyDown={handleOnLinkKeyDown}
              sx={classes.linkText}
            >
              {translateAria(["mainContent"])}
            </Typography>
          </Link>
        </Stack>
      </Popper>
    </>
  );
};

export default SkipToContentPopup;
