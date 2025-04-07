import { Stack } from "@mui/material";
import { Box, type Theme, useTheme } from "@mui/system";
import { Dispatch, JSX, SetStateAction } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import SearchBox from "~community/common/components/molecules/SearchBox/SearchBox";
import { IconName } from "~community/common/types/IconTypes";
import { usePeopleStore } from "~community/people/store/store";
import { EmployeeDataType } from "~community/people/types/EmployeeTypes";

interface Props {
  selectedManagers: number[];
  setSelectedManagers: Dispatch<SetStateAction<number[]>>;
  managerSuggestions: EmployeeDataType[];
  setManagers: Dispatch<SetStateAction<EmployeeDataType[]>>;
  hasAllSelector?: boolean;
  onManagerSearchChange: (searchTerm: string) => Promise<void>;
  managerSearchTerm: string;
  setManagerSearchTerm: Dispatch<SetStateAction<string>>;
}

const MultiSelectManagerSearch = ({
  selectedManagers,
  setSelectedManagers,
  managerSuggestions,
  setManagers,
  onManagerSearchChange,
  managerSearchTerm,
  setManagerSearchTerm
}: Props): JSX.Element => {
  const theme: Theme = useTheme();

  const getSelectedToTop = (employeeId: number) => {
    const index = selectedManagers.indexOf(employeeId);
    const memberIndex = managerSuggestions.findIndex(
      (item) => Number(item.employeeId) === employeeId
    );
    const recordToMove = managerSuggestions[memberIndex];
    const newTeamMemberArray = [...managerSuggestions];
    newTeamMemberArray.splice(memberIndex, 1);
    index === -1
      ? newTeamMemberArray.unshift(recordToMove)
      : newTeamMemberArray.push(recordToMove);
    setManagers(newTeamMemberArray);
  };

  const {
    employee: currentEmployee,
    setEmploymentDetails,
    projectTeamNames
  } = usePeopleStore((state) => state);

  const updateSelectedMembers = (employeeId: number) => {
    getSelectedToTop(employeeId);
    setSelectedManagers((prevMembers) => {
      const index = prevMembers.indexOf(employeeId);
      if (index === -1) {
        return [...prevMembers, employeeId];
      } else {
        const updatedMembers = [...prevMembers];
        updatedMembers.splice(index, 1);
        return updatedMembers;
      }
    });
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.grey[100], height: "100%" }}>
      <Box sx={{ p: "0.5rem" }}>
        <SearchBox
          label={""}
          value={managerSearchTerm}
          setSearchTerm={(value: string) => {
            setManagerSearchTerm(value.trimStart());
            onManagerSearchChange(value.trimStart());
          }}
          paperStyles={{
            height: "2.375rem",
            backgroundColor: "white"
          }}
        />
      </Box>
      <Box
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
          maxHeight: "15rem",
          mt: "0.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start"
        }}
      >
        {managerSuggestions?.map((employee: EmployeeDataType) => {
          return (
            <Stack
              key={employee.employeeId}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              onClick={() => {
                setEmploymentDetails({
                  employmentDetails: {
                    ...employee,
                    otherSupervisors: [
                      ...(currentEmployee?.employment?.employmentDetails
                        ?.otherSupervisors ?? []),
                      employee
                    ]
                  }
                });
                updateSelectedMembers(Number(employee.employeeId));
              }}
              sx={{
                width: "100%",
                px: "0.75rem",
                backgroundColor: !selectedManagers.includes(
                  Number(employee.employeeId)
                )
                  ? theme.palette.grey[100]
                  : theme.palette.secondary.main
              }}
            >
              <AvatarChip
                key={employee.employeeId}
                firstName={employee.firstName}
                lastName={employee.lastName}
                avatarUrl={employee.authPic}
                isResponsiveLayout={true}
                chipStyles={{
                  color: "common.black",
                  height: "3rem",
                  border: selectedManagers.includes(Number(employee.employeeId))
                    ? `.0625rem solid ${theme.palette.secondary.dark}`
                    : null,
                  my: ".75rem",
                  py: "0.75rem"
                }}
                onClickChip={() =>
                  updateSelectedMembers(Number(employee.employeeId))
                }
              />
              <Box>
                {selectedManagers.includes(Number(employee.employeeId)) && (
                  <Icon
                    name={IconName.CHECK_CIRCLE_ICON}
                    fill={theme.palette.primary.dark}
                  />
                )}
              </Box>
            </Stack>
          );
        })}
      </Box>
    </Box>
  );
};

export default MultiSelectManagerSearch;
