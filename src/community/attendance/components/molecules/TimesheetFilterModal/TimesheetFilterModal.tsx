import { Box, ClickAwayListener, Fade, Popper } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { JSX } from "react";

import TimesheetFilterModalBody from "~community/attendance/components/molecules/TimesheetFilterModalBody/TimesheetFilterModalBody";
import useAutoFocusMenuListener from "~community/common/utils/hooks/useAutoFocusMenuListeners";

import styles from "./styles";

interface Props {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  id: string | undefined;
  open: boolean;
  position?: "bottom-start" | "bottom-end";
  onApply: (
    selectedFilters: Record<string, string[]>,
    selectedFilterLabels: string[]
  ) => void;
  onReset: () => void;
  isManager?: boolean;
}

const TimesheetFilterModal = ({
  anchorEl,
  handleClose,
  id,
  open,
  position = "bottom-end",
  onApply,
  onReset,
  isManager = false
}: Props): JSX.Element => {
  const theme: Theme = useTheme();
  const classes = styles(theme);
  useAutoFocusMenuListener(anchorEl, id ?? "", handleClose);
  return (
    <Box sx={classes.boxContainer} component="div">
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement={position}
        modifiers={[
          {
            name: "flip",
            enabled: false,
            options: {
              altBoundary: true,
              rootBoundary: "document",
              padding: 8
            }
          }
        ]}
        transition
        disablePortal
        role="dialog"
        aria-label={"dialog"}
        aria-modal={true}
        tabIndex={0}
        style={classes.popperStyle}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Fade {...TransitionProps} timeout={350}>
              <Box sx={classes.boxBodyStyle}>
                <TimesheetFilterModalBody
                  onApply={onApply}
                  onReset={onReset}
                  isManager={isManager}
                />
              </Box>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
    </Box>
  );
};

export default TimesheetFilterModal;
