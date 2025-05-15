import { Stack, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";

import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { usePeopleStore } from "~community/people/store/store";

const SelectedFiltersSection = () => {
  const theme = useTheme();
  const translateText = useTranslator("peopleModule", "peoples.filters");
  const { employeeDataFilter } = usePeopleStore((state) => state);

  const getFilterCount = useMemo(() => {
    let count = 0;
    if (employeeDataFilter.gender) count += 1;
    count += employeeDataFilter.nationality.length;
    count += employeeDataFilter.employmentTypes.length;
    count += employeeDataFilter.employmentAllocations.length;
    count += employeeDataFilter.accountStatus.length;
    count += employeeDataFilter.role.length;
    count += employeeDataFilter.team.length;
    count += employeeDataFilter.permission.length;
    return count;
  }, [employeeDataFilter]);

  const getJobFamilyNames = useMemo(() => {
    return employeeDataFilter.role.map((jobFamily) => jobFamily.text);
  }, [employeeDataFilter.role]);

  const getTeamNames = useMemo(() => {
    return employeeDataFilter.team.map((team) => team.text);
  }, [employeeDataFilter.team]);

  const getTranslation = (term: string) => {
    return translateText([`selectedFiltersFilterItems.${term.toLowerCase()}`]);
  };
  const renderIconChip = (label: string) => (
    <Stack>
      <IconChip
        label={
          !getTranslation(label).includes("peopleModule")
            ? getTranslation(label)
            : label
        }
        chipStyles={{
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.primary.dark,
          padding: "8px 12px",
          border: `1px solid ${theme.palette.primary.dark}`
        }}
      />
    </Stack>
  );

  const renderSection = (title: string, items: string[]) => {
    if (!items.length) return null;

    return (
      <Stack sx={{ marginBottom: 2 }}>
        <Typography
          sx={{ fontSize: "12px", fontWeight: "600", marginBottom: 2 }}
        >
          {translateText([title])}
        </Typography>
        <Stack flexDirection="row" gap={0.5} sx={{ flexWrap: "wrap" }}>
          {items.map(renderIconChip)}
        </Stack>
      </Stack>
    );
  };

  return (
    <Stack sx={{ paddingX: 3, flexDirection: "column", overflowY: "auto" }}>
      {getFilterCount > 0 ? (
        <>
          <Typography
            sx={{ fontSize: "14px", fontWeight: "600", marginBottom: 2 }}
          >
            {translateText(["selectedFilters"], { count: getFilterCount })}
          </Typography>

          {renderSection("demographics", [
            ...(employeeDataFilter.gender ? [employeeDataFilter.gender] : []),
            ...employeeDataFilter.nationality
          ])}

          {renderSection("employements", [
            ...employeeDataFilter.employmentTypes,
            ...employeeDataFilter.employmentAllocations,
            ...employeeDataFilter.accountStatus
          ])}

          {renderSection("jobFamilies", getJobFamilyNames as string[])}
          {renderSection("teams", getTeamNames as string[])}

          {renderSection(
            "userRoles",
            employeeDataFilter.permission as string[]
          )}
        </>
      ) : (
        <Typography
          sx={{ fontSize: "14px", fontWeight: "600", marginBottom: 2 }}
        >
          {translateText(["noFIlters"])}
        </Typography>
      )}
    </Stack>
  );
};

export default SelectedFiltersSection;
