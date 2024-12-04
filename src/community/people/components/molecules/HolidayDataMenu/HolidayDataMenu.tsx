import { JSX } from "react";

import Popper from "~community/common/components/molecules/Popper/Popper";
import { MenuTypes } from "~community/common/types/MoleculeTypes";
import HolidayDataSortMenuItems from "~community/people/components/molecules/HolidayDataSortMenuItems/HolidayDataSortMenuItems";

interface Props {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  position: "bottom-end" | "bottom-start";
  menuType: MenuTypes;
  id: string | undefined;
  open: boolean;
  scrollToTop?: () => void | undefined;
}

const HolidayDataMenu = ({
  anchorEl,
  handleClose,
  position,
  menuType,
  id,
  open,
  scrollToTop
}: Props): JSX.Element => {
  return (
    <Popper
      anchorEl={anchorEl}
      open={open}
      position={position}
      menuType={menuType}
      id={id}
      handleClose={handleClose}
    >
      <HolidayDataSortMenuItems
        handleClose={handleClose}
        scrollToTop={scrollToTop}
      />
    </Popper>
  );
};

export default HolidayDataMenu;
