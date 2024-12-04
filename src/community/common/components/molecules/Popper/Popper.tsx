import {
  Box,
  ClickAwayListener,
  Fade,
  Popper as MuiPopper
} from "@mui/material";
import { type SxProps, type Theme, useTheme } from "@mui/material/styles";
import { CSSProperties, JSX, ReactNode, useMemo } from "react";

import {
  MenuTypes,
  PopperAndTooltipPositionTypes
} from "~community/common/types/MoleculeTypes";

import styles from "./styles";

type Props = {
  anchorEl: null | HTMLElement;
  handleClose?: (e: MouseEvent | TouchEvent) => void;
  position: PopperAndTooltipPositionTypes;
  menuType?: MenuTypes;
  isManager?: boolean;
  id: string | undefined;
  open: boolean;
  children?: ReactNode;
  disablePortal?: boolean;
  modifiers?: any;
  wrapperStyles?: Record<string, string> | CSSProperties;
  containerStyles?: Record<string, string> | SxProps;
  isFlip?: boolean;
  timeout?: number;
  ariaLabel?: string;
};

const Popper = ({
  anchorEl,
  handleClose = () => {},
  position,
  menuType,
  id,
  open,
  children,
  disablePortal,
  modifiers = [],
  wrapperStyles = {},
  containerStyles,
  isFlip = false,
  timeout = 0,
  ariaLabel
}: Props): JSX.Element => {
  const theme: Theme = useTheme();
  const classes = styles();

  const wrapperWidth = useMemo(() => {
    switch (menuType) {
      case MenuTypes.SEARCH:
        return anchorEl ? `${anchorEl.clientWidth}px` : "auto";
      default:
        return undefined;
    }
  }, [menuType, anchorEl]);

  const marginY = useMemo(() => {
    switch (menuType) {
      case MenuTypes.SEARCH || MenuTypes.SELECT:
        return "0.1875rem";
      case MenuTypes.DEFAULT:
        return "0rem !important";
      default:
        return "0.5rem !important";
    }
  }, [menuType]);

  const containerWidth = useMemo(() => {
    switch (menuType) {
      case MenuTypes.GRAPH || MenuTypes.SEARCH || MenuTypes.DEFAULT:
        return undefined;
      case MenuTypes.SORT || MenuTypes.SELECT:
        return "16.25rem";
      default:
        return "53.125rem";
    }
  }, [menuType]);

  const boxShadow = useMemo(() => {
    switch (menuType) {
      case MenuTypes.DEFAULT:
        return undefined;
      default:
        return `0rem 0.25rem 1.25rem ${theme.palette.grey.A200}`;
    }
  }, [menuType]);

  return (
    <MuiPopper
      id={id}
      open={open}
      anchorEl={anchorEl}
      placement={position}
      disablePortal={disablePortal}
      modifiers={[
        {
          name: "flip",
          enabled: isFlip,
          options: {
            altBoundary: true,
            rootBoundary: "document",
            padding: 8
          }
        },
        ...modifiers
      ]}
      transition
      style={{
        width: wrapperWidth,
        ...classes.wrapper,
        ...wrapperStyles
      }}
      role="dialog"
      aria-modal={true}
      tabIndex={0}
      aria-label={ariaLabel}
    >
      {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={handleClose}>
          <Fade {...TransitionProps} timeout={timeout}>
            <Box
              sx={{
                ...classes.container,
                marginY: marginY,
                width: containerWidth,
                boxShadow: boxShadow,
                ...containerStyles
              }}
            >
              {children}
            </Box>
          </Fade>
        </ClickAwayListener>
      )}
    </MuiPopper>
  );
};

export default Popper;
