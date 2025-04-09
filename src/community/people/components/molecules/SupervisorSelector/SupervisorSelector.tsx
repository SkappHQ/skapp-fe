import { Box, Stack, Typography } from "@mui/material";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import AvatarGroup from "~community/common/components/molecules/AvatarGroup/AvatarGroup";
import Popper from "~community/common/components/molecules/Popper/Popper";
import { theme } from "~community/common/theme/theme";
import { IconName } from "~community/common/types/IconTypes";
import {
  AvatarPropTypes,
  MenuTypes
} from "~community/common/types/MoleculeTypes";
import { EmployeeDataType } from "~community/people/types/EmployeeTypes";
import {
  L1EmployeeType,
  L4ManagerType
} from "~community/people/types/PeopleTypes";

import MultiSelectManagerSearch from "../MultiSelectManagerSearch/MultiSelectManagerSearch";

interface Props {
  employee: L1EmployeeType | null;
  otherSupervisorsCount: number;
  managerSuggestions: EmployeeDataType[];
  managerSearchTerm: string;
  onmanagerSearchChange: (searchTerm: string) => Promise<void>;
  selectedManagers: L4ManagerType[];
  setSelectedManagers: Dispatch<SetStateAction<L4ManagerType[]>>;
  isInputsDisabled: boolean;
  label: string;
  filterEl: HTMLElement | null;
  setFilterEl: Dispatch<SetStateAction<HTMLElement | null>>;
}

const SupervisorSelector = ({
  employee,
  otherSupervisorsCount,
  managerSuggestions,
  managerSearchTerm,
  onmanagerSearchChange,
  selectedManagers,
  setSelectedManagers,
  isInputsDisabled,
  label,
  filterEl,
  setFilterEl
}: Props) => {
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const filterBeOpen: boolean = filterOpen && Boolean(filterEl);
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(0);
  const filterId: string | undefined = filterBeOpen
    ? "filter-popper"
    : undefined;

  useEffect(() => {
    if (boxRef.current) {
      setBoxWidth(boxRef.current.clientWidth);
    }
  }, [filterOpen]);

  const handleFilterClose = () => {
    setFilterOpen(false);
    setFilterEl(null);
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          mt: "0.3rem"
        }}
      >
        <Typography
          variant="placeholder"
          gutterBottom
          sx={{
            color: isInputsDisabled
              ? theme.palette.text.disabled
              : "common.black"
          }}
        >
          {label}
        </Typography>
      </Stack>
      <Box
        ref={boxRef}
        alignItems={"center"}
        sx={{
          backgroundColor: theme.palette.grey[100],
          height: "3rem",
          borderRadius: "0.5rem",
          flexDirection: "row",
          display: "flex",
          width: "100%",
          cursor: "pointer"
        }}
        onClick={(event: MouseEvent<HTMLElement>): void => {
          setFilterEl(event.currentTarget);
          setFilterOpen((previousOpen) => !previousOpen);
        }}
      >
        { otherSupervisorsCount < 3 ? (
          employee?.employment?.employmentDetails?.otherSupervisors?.map(
            (manager: L4ManagerType) => (
              <Box
                sx={{ height: "3.125rem", pt: "0.3125rem" }}
                key={manager?.employeeId}
              >
                <AvatarChip
                  firstName={manager?.firstName ?? ""}
                  lastName={
                    employee?.employment?.employmentDetails?.otherSupervisors
                      ?.length === 1
                      ? (manager?.lastName ?? "")
                      : ""
                  }
                  avatarUrl={manager?.authPic}
                  isResponsiveLayout={false}
                  isDeleteAvailable={true}
                  chipStyles={{
                    backgroundColor: "common.white",
                    color: "common.black",
                    height: "2.5rem",
                    "& .MuiChip-deleteIcon": {
                      mr: "0.9375rem"
                    },
                    "& .MuiChip-label": {
                      pl: "0.5rem",
                      ml: "0.25rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden !important",
                      textOverflow: "ellipsis",
                      maxWidth: "11.25rem"
                    },
                    mt: "0rem",
                    ml: "0.75rem"
                  }}
                  isDisabled={isInputsDisabled}
                />
              </Box>
            )
          )
        ) : otherSupervisorsCount === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              px: "0.75rem"
            }}
          >
            <Typography
              variant="placeholder"
              sx={{
                color: theme.palette.grey[200],
                ml: "0.5rem"
              }}
            >
              Select supervisors
            </Typography>
            <Icon name={IconName.SEARCH_ICON} />
          </Box>
        ) : (
          <AvatarGroup
            avatars={
              employee?.employment?.employmentDetails?.otherSupervisors
                ? employee?.employment?.employmentDetails?.otherSupervisors?.map(
                    (manager: L4ManagerType) =>
                      ({
                        firstName: manager?.firstName,
                        lastName: manager?.lastName,
                        image: manager?.authPic
                      }) as AvatarPropTypes
                  )
                : []
            }
            max={6}
          />
        )}
      </Box>
      <Popper
        anchorEl={filterEl}
        open={filterOpen}
        position={"bottom-end"}
        menuType={MenuTypes.FILTER}
        id={filterId}
        handleClose={handleFilterClose}
        timeout={300}
        containerStyles={{
          maxHeight: "20.25rem",
          width: `${boxWidth}px`,
          backgroundColor: theme.palette.notifyBadge.contrastText
        }}
      >
        <MultiSelectManagerSearch
          selectedManagers={selectedManagers}
          setSelectedManagers={setSelectedManagers}
          managerSuggestions={managerSuggestions}
          onManagerSearchChange={onmanagerSearchChange}
          managerSearchTerm={managerSearchTerm}
        />
      </Popper>
    </>
  );
};

export default SupervisorSelector;
