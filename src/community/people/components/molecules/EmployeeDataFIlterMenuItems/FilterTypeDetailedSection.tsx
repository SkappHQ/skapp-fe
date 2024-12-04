import { Box } from "@mui/material";

import { useMediaQuery } from "~community/common/hooks/useMediaQuery";
import { FilterButtonTypes } from "~community/common/types/filterTypes";
import { PeopleFilterHeadings } from "~community/people/types/CommonTypes";

import DemograpicsSection from "../ExpandedFilerSections/DemograpicsSection";
import EmployementSection from "../ExpandedFilerSections/EmployementSection";
import JobFamiliesSection from "../ExpandedFilerSections/JobFamiliesSection";
import TeamSection from "../ExpandedFilerSections/TeamSection";
import UserRolesSection from "../ExpandedFilerSections/UserRolesSection";

const FilterTypeDetailedSection = ({
  selected,
  teams,
  jobFamilies
}: {
  selected: PeopleFilterHeadings;
  teams?: FilterButtonTypes[] | undefined;
  jobFamilies?: FilterButtonTypes[] | undefined;
}) => {
  const queryMatches = useMediaQuery();
  const isSmallScreen = queryMatches(`(max-width: 1150px)`);
  const renderSelectedSection = () => {
    switch (selected) {
      case PeopleFilterHeadings.DEMOGRAPICS:
        return <DemograpicsSection />;
      case PeopleFilterHeadings.EMPLOYMENTS:
        return <EmployementSection />;
      case PeopleFilterHeadings.JOB_FAMILIES:
        return <JobFamiliesSection jobFamilies={jobFamilies} />;
      case PeopleFilterHeadings.TEAMS:
        return <TeamSection teams={teams} />;
      case PeopleFilterHeadings.USER_ROLES:
        return <UserRolesSection />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ paddingX: isSmallScreen ? 1 : 3 }}>
      {renderSelectedSection()}
    </Box>
  );
};

export default FilterTypeDetailedSection;
