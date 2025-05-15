import { Stack, Typography, useTheme } from "@mui/material";
import { RefObject, useState } from "react";

import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import Icon from "~community/common/components/atoms/Icon/Icon";
import FilterSearch from "~community/common/components/molecules/FilterSearch/FilterSearch";
import { useMediaQuery } from "~community/common/hooks/useMediaQuery";
import { useTranslator } from "~community/common/hooks/useTranslator";
import {
  FilterButtonTypes,
  FilterSearchSuggestionsType
} from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import { usePeopleStore } from "~community/people/store/store";

const TeamSection = ({
  teams,
  selected,
  basicChipRef
}: {
  teams?: FilterButtonTypes[] | undefined;
  selected: string;
  basicChipRef: RefObject<{ [key: string]: HTMLDivElement | null }>;
}) => {
  const theme = useTheme();
  const queryMatches = useMediaQuery();
  const isSmallScreen = queryMatches(`(max-width: 1150px)`);

  const translateText = useTranslator("peopleModule", "peoples.filters");

  const [searchTerm, setSearchTerm] = useState("");
  const [isPopperOpen, setIsPopperOpen] = useState<boolean>(false);

  const [searchErrors, _setSearchErrors] = useState<string | undefined>(
    undefined
  );
  const { employeeDataFilter, setEmployeeDataFilter, removeEmployeeFilter } =
    usePeopleStore((state) => state);

  const handleTeamSelect = (team: FilterButtonTypes) => {
    if (!employeeDataFilter.team.some((item) => item.id === team.id)) {
      setEmployeeDataFilter("team", [...employeeDataFilter.team, team]);
    } else {
      setEmployeeDataFilter(
        "team",
        employeeDataFilter.team.filter(
          (currentFilter) => currentFilter.id !== team.id
        )
      );
    }
  };

  const onSelectOption = (value: FilterButtonTypes): void => {
    setSearchTerm("");
    if (!employeeDataFilter.team.includes(value)) {
      handleTeamSelect(value);
    }
  };

  return (
    <Stack>
      <Stack>
        <Typography
          variant={isSmallScreen ? "caption" : "body2"}
          sx={{
            fontWeight: "600",
            marginBottom: 2
          }}
        >
          {translateText(["teams"])}
        </Typography>

        <Stack>
          {teams && teams?.length > 8 ? (
            <Stack>
              <FilterSearch
                id="search-team-input"
                setIsPopperOpen={setIsPopperOpen}
                isPopperOpen={isPopperOpen}
                labelStyles={{ mb: "0.25rem" }}
                componentStyles={{ mr: "1.25rem", my: 2 }}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                error={searchErrors}
                onSelectOption={(result) =>
                  onSelectOption(result as FilterButtonTypes)
                }
                popperStyles={{
                  width: "100%"
                }}
                filterSearchResult={true}
                suggestions={teams}
                selectedOptions={
                  employeeDataFilter?.team as FilterSearchSuggestionsType[]
                }
              />
              <Stack
                flexDirection={"row"}
                sx={{
                  gap: 0.5,
                  flexWrap: "wrap"
                }}
              >
                {employeeDataFilter?.team?.map((chip, index) => (
                  <Stack key={index}>
                    <IconChip
                      ref={(el: HTMLDivElement | null) => {
                        if (el && basicChipRef.current) {
                          basicChipRef.current[selected + index] = el;
                        }
                      }}
                      label={chip.text}
                      icon={
                        <Icon
                          name={IconName.SELECTED_ICON}
                          fill={theme.palette.primary.dark}
                        />
                      }
                      chipStyles={{
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.primary.dark,
                        padding: "8px 12px"
                      }}
                      onClick={() => {
                        setEmployeeDataFilter(
                          "team",
                          employeeDataFilter.role.filter(
                            (currentFilter) => currentFilter !== chip
                          )
                        );
                      }}
                    />
                  </Stack>
                ))}
              </Stack>
            </Stack>
          ) : (
            <Stack
              flexDirection={"row"}
              sx={{
                gap: 0.5,
                flexWrap: "wrap"
              }}
            >
              {teams?.map((team, index) => (
                <Stack key={index}>
                  <IconChip
                    ref={(el: HTMLDivElement | null) => {
                      if (el && basicChipRef.current) {
                        basicChipRef.current[selected + index] = el;
                      }
                    }}
                    label={team.text}
                    onClick={() => handleTeamSelect(team as FilterButtonTypes)}
                    icon={
                      employeeDataFilter.team.find(
                        (teamItem) => teamItem.id === team.id
                      ) ? (
                        <Icon
                          name={IconName.SELECTED_ICON}
                          fill={theme.palette.primary.dark}
                        />
                      ) : undefined
                    }
                    chipStyles={{
                      backgroundColor: employeeDataFilter.team.find(
                        (teamItem) => teamItem.id === team.id
                      )
                        ? theme.palette.secondary.main
                        : theme.palette.grey[100],
                      color: employeeDataFilter.team.find(
                        (teamItem) => teamItem.id === team.id
                      )
                        ? theme.palette.primary.dark
                        : "black",
                      padding: "8px 12px",
                      fontSize: isSmallScreen ? "0.75rem" : "0.875rem"
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TeamSection;
