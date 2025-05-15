import { Box } from "@mui/material";
import { JSX } from "react";

import Popper from "~community/common/components/molecules/Popper/Popper";
import { FilterButtonTypes } from "~community/common/types/CommonTypes";
import {
  MenuTypes,
  PopperAndTooltipPositionTypes
} from "~community/common/types/MoleculeTypes";

import LALeaveRequestSortMenuItems from "../LeaveRequestSortMenuItems/LALeaveRequestSortMenuItems";
import RequestFilterMenuItems from "../RequestFilterMenuItems/RequestFilterMenuItems";

interface Props {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  position: PopperAndTooltipPositionTypes;
  menuType: MenuTypes;
  id: string | undefined;
  open: boolean;
  leaveTypeButtons?: FilterButtonTypes[];
  onReset?: (reset: boolean) => void;
}

const LeaveRequestMenu = ({
  anchorEl,
  handleClose,
  position = "bottom-start",
  menuType,
  id,
  open,
  leaveTypeButtons,
  onReset
}: Props): JSX.Element => {
  return (
    <Popper
      ariaLabelledBy="filter-icon-btn"
      anchorEl={anchorEl}
      open={open}
      position={position}
      menuType={menuType}
      id={id}
      handleClose={handleClose}
      containerStyles={{
        width: menuType === MenuTypes.SORT ? "15.5rem" : "22rem"
      }}
    >
      <Box>
        {menuType === MenuTypes.SORT ? (
          <LALeaveRequestSortMenuItems handleClose={handleClose} />
        ) : (
          <RequestFilterMenuItems
            handleClose={handleClose}
            leaveTypeButtons={leaveTypeButtons ?? []}
            onReset={onReset}
          />
        )}
      </Box>
    </Popper>
  );
};

export default LeaveRequestMenu;
