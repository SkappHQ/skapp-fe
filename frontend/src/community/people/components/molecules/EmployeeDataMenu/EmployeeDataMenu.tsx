import { Box } from "@mui/material";
import { JSX } from "react";

import Popper from "~community/common/components/molecules/Popper/Popper";
import { useMediaQuery } from "~community/common/hooks/useMediaQuery";
import {
  MenuTypes,
  PopperAndTooltipPositionTypes
} from "~community/common/types/MoleculeTypes";
import { FilterButtonTypes } from "~community/common/types/filterTypes";
import { JobRole } from "~community/people/types/EmployeeTypes";

import EmployeeDataFIlterMenuItems from "../EmployeeDataFIlterMenuItems/EmployeeDataFIlterMenuItems";
import EmployeeDataSortMenuItems from "../EmployeeDataSortMenuItems/EmployeeDataSortMenuItems";

interface Props {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  position: PopperAndTooltipPositionTypes;
  menuType: MenuTypes;
  id: string | undefined;
  open: boolean;
  teamData?: { teams: FilterButtonTypes[] | undefined; isTeamLoading: boolean };
  roleData?: { roles: JobRole[] | undefined; isRoleLoading: boolean };
  scrollToTop: () => void;
  teams?: FilterButtonTypes[] | undefined;
  jobFamilies?: FilterButtonTypes[] | undefined;
}

const EmployeeDataMenu = ({
  anchorEl,
  handleClose,
  position,
  menuType,
  id,
  open,
  scrollToTop,
  teams,
  jobFamilies
}: Props): JSX.Element => {
  const queryMatches = useMediaQuery();
  const isSmallScreen = queryMatches(`(max-width: 1150px)`);
  return (
    <Popper
      anchorEl={anchorEl}
      open={open}
      position={position}
      menuType={menuType}
      id={id}
      handleClose={handleClose}
      containerStyles={{
        width: isSmallScreen
          ? "23.75rem"
          : menuType === MenuTypes.SORT
            ? "22.0625rem"
            : "53.125rem"
      }}
    >
      <Box>
        {menuType === MenuTypes.SORT ? (
          <EmployeeDataSortMenuItems
            handleClose={handleClose}
            scrollToTop={scrollToTop}
          />
        ) : (
          <EmployeeDataFIlterMenuItems
            handleClose={handleClose}
            scrollToTop={scrollToTop}
            teams={teams}
            jobFamilies={jobFamilies}
          />
        )}
      </Box>
    </Popper>
  );
};

export default EmployeeDataMenu;
