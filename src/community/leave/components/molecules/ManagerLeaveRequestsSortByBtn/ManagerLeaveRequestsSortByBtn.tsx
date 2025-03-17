import { Box } from "@mui/material";
import { MouseEvent, useState } from "react";

import DropDownArrow from "~community/common/assets/Icons/DropdownArrow";
import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { MenuTypes } from "~community/common/types/MoleculeTypes";
import LeaveRequestMenu from "~community/leave/components/molecules/LeaveRequestMenu/LeaveRequestMenu";

interface Props {
  isDisabled: boolean;
}

const ManagerLeaveRequestsSortByBtn = ({ isDisabled }: Props) => {
  const [sortEl, setSortEl] = useState<null | HTMLElement>(null);
  const [sortOpen, setSortOpen] = useState<boolean>(false);

  const sortByOpen = sortOpen && Boolean(sortEl);
  const sortId = sortByOpen ? "sortBy-popper" : undefined;

  const handleSortClick = (event: MouseEvent<HTMLElement>): void => {
    setSortEl(event.currentTarget);
    setSortOpen((previousOpen) => !previousOpen);
  };

  const handleSortClose = (): void => {
    setSortEl(null);
    setSortOpen(false);
  };

  return (
    <Box>
      <Button
        label="Sort By"
        buttonStyle={ButtonStyle.TERTIARY}
        styles={{
          border: "0.0625rem solid",
          borderColor: "grey.500",
          py: "0.5rem",
          px: "1rem"
        }}
        endIcon={<DropDownArrow />}
        onClick={handleSortClick}
        disabled={isDisabled}
        ariaLabel="Sort by: Pressing enter on this button opens a menu where you can choose to sort by date requested or urgency."
        aria-describedby={sortId}
      />
      <LeaveRequestMenu
        anchorEl={sortEl}
        handleClose={handleSortClose}
        position="bottom-start"
        menuType={MenuTypes.SORT}
        id={sortId}
        open={sortOpen}
      />
    </Box>
  );
};

export default ManagerLeaveRequestsSortByBtn;
