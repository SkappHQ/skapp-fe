import { Stack, Theme, Typography, useTheme } from "@mui/material";
import {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState
} from "react";

import Popper from "~community/common/components/molecules/Popper/Popper";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import {
  shouldActivateButton,
  shouldCollapseDropdown
} from "~community/common/utils/keyboardUtils";

import styles from "./styles";

const SkipToContentPopup = ({ id }: { id: string }) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const translateAria = useTranslator("commonAria", "skipToContent");

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPopperOpen, setIsPopperOpen] = useState<boolean>(false);
  const [pendingFocus, setPendingFocus] = useState<string | null>(null);

  const handleOpenPopper = (target: HTMLElement) => {
    setAnchorEl(target);
    setIsPopperOpen(true);
  };

  const handleClosePopper = () => {
    setAnchorEl(null);
    setIsPopperOpen(false);
  };

  useEffect(() => {
    if (!isPopperOpen && pendingFocus) {
      const mainContent = document.querySelector(pendingFocus);
      if (mainContent) {
        mainContent.setAttribute("tabindex", "-1");
        mainContent.focus({ preventScroll: true });

        mainContent.addEventListener(
          "blur",
          () => mainContent.removeAttribute("tabindex"),
          { once: true }
        );
      }

      setPendingFocus(null);
    }
  }, [isPopperOpen, pendingFocus]);

  const handleOnButtonBlur = (event: FocusEvent<HTMLButtonElement>) => {
    if (
      !event.relatedTarget ||
      !event.relatedTarget.closest("#skip-to-content-popup")
    ) {
      handleClosePopper();
    }
  };

  const handleOnButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isPopperOpen && shouldCollapseDropdown(event.key)) {
      event.stopPropagation();
      handleClosePopper();
    }
  };

  const handleLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    event.preventDefault();

    if (href) {
      setPendingFocus(href);
    }
    handleClosePopper();
  };

  const handleOnLinkKeyDown = (
    event: KeyboardEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (shouldActivateButton(event.key)) {
      event.preventDefault();
      if (href) {
        setPendingFocus(href);
      }
      handleClosePopper();
    }
  };

  const listItems = [{ label: translateAria(["mainContent"]), href: `#${id}` }];

  return (
    <>
      <button
        ref={buttonRef}
        role="button"
        aria-label={translateAria(["label"])}
        aria-haspopup="dialog"
        aria-expanded={isPopperOpen}
        aria-controls={isPopperOpen ? "skip-to-content-popup" : undefined}
        onFocus={(event: FocusEvent<HTMLButtonElement>) =>
          handleOpenPopper(event.currentTarget)
        }
        onBlur={(event: FocusEvent<HTMLButtonElement>) =>
          handleOnButtonBlur(event)
        }
        onKeyDown={handleOnButtonKeyDown}
        style={{
          position: "absolute",
          left: "0px",
          top: "0px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          zIndex: ZIndexEnums.MAX,
          border: "none"
        }}
      >
        {translateAria(["label"])}
      </button>
      <Popper
        id={isPopperOpen ? "skip-to-content-popup" : undefined}
        open={isPopperOpen}
        anchorEl={anchorEl}
        position="bottom-end"
        handleClose={handleClosePopper}
        containerStyles={classes.popperContainer}
        ariaRole="dialog"
        ariaLabel={translateAria(["skipTo"])}
      >
        <Stack>
          <Typography variant="label">{translateAria(["skipTo"])}</Typography>
          {listItems.map((item) => (
            <Typography
              key={item.label}
              tabIndex={0}
              role="link"
              component="a"
              variant="body2"
              href={item.href || undefined}
              onClick={(event: MouseEvent<HTMLAnchorElement>) =>
                handleLinkClick(event, item.href)
              }
              onKeyDown={(event: KeyboardEvent<HTMLAnchorElement>) =>
                handleOnLinkKeyDown(event, item.href)
              }
              sx={classes.linkText}
            >
              {item.label}
            </Typography>
          ))}
        </Stack>
      </Popper>
    </>
  );
};

export default SkipToContentPopup;
