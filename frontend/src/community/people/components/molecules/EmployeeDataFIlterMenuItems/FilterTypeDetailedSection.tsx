import { Box } from "@mui/material";
import { RefObject } from "react";

import { useMediaQuery } from "~community/common/hooks/useMediaQuery";
import { FilterButtonTypes } from "~community/common/types/filterTypes";
import { PeopleFilterHeadings } from "~community/people/types/CommonTypes";

import DemographicsSection from "../ExpandedFilerSections/DemographicsSection";
import EmploymentSection from "../ExpandedFilerSections/EmploymentSection";
import JobFamiliesSection from "../ExpandedFilerSections/JobFamiliesSection";
import TeamSection from "../ExpandedFilerSections/TeamSection";
import UserRolesSection from "../ExpandedFilerSections/UserRolesSection";

const FilterTypeDetailedSection = ({
  basicChipRef,
  selected,
  teams,
  jobFamilies
}: {
  basicChipRef: RefObject<{ [key: string]: HTMLDivElement | null }>;
  selected: PeopleFilterHeadings;
  teams?: FilterButtonTypes[] | undefined;
  jobFamilies?: FilterButtonTypes[] | undefined;
}) => {
  const queryMatches = useMediaQuery();
  const isSmallScreen = queryMatches(`(max-width: 1150px)`);
  const renderSelectedSection = () => {
    switch (selected) {
      case PeopleFilterHeadings.DEMOGRAPICS:
        return (
          <DemographicsSection
            basicChipRef={basicChipRef}
            selected={selected}
          />
        );
      case PeopleFilterHeadings.EMPLOYMENTS:
        return (
          <EmploymentSection basicChipRef={basicChipRef} selected={selected} />
        );
      case PeopleFilterHeadings.JOB_FAMILIES:
        return (
          <JobFamiliesSection
            jobFamilies={jobFamilies}
            basicChipRef={basicChipRef}
            selected={selected}
          />
        );
      case PeopleFilterHeadings.TEAMS:
        return (
          <TeamSection
            teams={teams}
            basicChipRef={basicChipRef}
            selected={selected}
          />
        );
      case PeopleFilterHeadings.USER_ROLES:
        return (
          <UserRolesSection basicChipRef={basicChipRef} selected={selected} />
        );
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
