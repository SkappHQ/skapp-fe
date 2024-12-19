import { Box, Stack, Theme, Typography, useTheme } from "@mui/material";
import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import * as React from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import MenuItem from "~community/common/components/atoms/MenuItem/MenuItem";
import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import Popper from "~community/common/components/molecules/Popper/Popper";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { AdminTypes } from "~community/common/types/AuthTypes";
import { IconName } from "~community/common/types/IconTypes";
import { MenuTypes } from "~community/common/types/MoleculeTypes";
import { MAX_NUM_OF_SUPERVISORS_PER_TEAM } from "~community/people/constants/configs";
import { MemberTypes } from "~community/people/enums/TeamEnums";
import { EmployeeType } from "~community/people/types/EmployeeTypes";
import { TeamMemberTypes } from "~community/people/types/TeamTypes";

import styles from "./styles";

interface Props {
  id: string;
  employeeData: EmployeeType;
  userType: MemberTypes.MEMBER | MemberTypes.SUPERVISOR;
  teamMembers: TeamMemberTypes;
  setTeamMembers: (teamMembers: TeamMemberTypes) => void;
}

const AddTeamMemberRow: FC<Props> = ({
  id,
  employeeData,
  userType,
  teamMembers,
  setTeamMembers
}) => {
  const translateText = useTranslator("peopleModule", "teams");

  const theme: Theme = useTheme();
  const classes = styles(theme);

  const { setToastMessage } = useToast();

  const { data: session } = useSession();

  const isAdmin = session?.user?.roles?.includes(AdminTypes.PEOPLE_ADMIN);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedUserType, setSelectedUserType] =
    useState<MemberTypes>(userType);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  const itemList = [
    { label: MemberTypes.MEMBER, value: MemberTypes.MEMBER },
    {
      label: MemberTypes.SUPERVISOR,
      value: MemberTypes.SUPERVISOR
    }
  ];

  const setUserType = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const newValue: MemberTypes = e.currentTarget.innerText as MemberTypes;

    const updatedMembers = teamMembers?.members?.filter(
      (user: EmployeeType) => user?.employeeId !== employeeData?.employeeId
    );
    const updatedSupervisors = teamMembers?.supervisor?.filter(
      (user: EmployeeType) => user?.employeeId !== employeeData?.employeeId
    );

    if (newValue === MemberTypes.SUPERVISOR) {
      const isAlreadySupervisor =
        teamMembers?.supervisor.length !== updatedSupervisors?.length;
      if (!isAlreadySupervisor && updatedSupervisors?.length < 3) {
        setTeamMembers({
          ...teamMembers,
          supervisor: [...updatedSupervisors, employeeData],
          members: updatedMembers
        });
        setSelectedUserType(newValue);
      } else if (updatedSupervisors?.length >= 3) {
        setToastMessage({
          open: true,
          title: translateText(["noOfSupervisorsExceedingToastMessageTitle"]),
          description: translateText([
            "noOfSupervisorsExceedingToastMessageDescription"
          ]),
          toastType: "error"
        });
      }
    } else {
      const isAlreadyMember =
        teamMembers?.members?.length !== updatedMembers?.length;
      if (!isAlreadyMember) {
        setTeamMembers({
          ...teamMembers,
          members: [...updatedMembers, employeeData],
          supervisor: updatedSupervisors
        });
        setSelectedUserType(newValue);
      }
    }
    setShowOverlay(false);
  };

  useEffect(() => {
    setSelectedUserType(userType);
  }, [userType]);

  return (
    <Stack
      width={"100%"}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
    >
      <Stack
        component="div"
        direction="row"
        justifyContent="start"
        alignItems="center"
        maxWidth="72%"
      >
        <Box width="100%">
          <AvatarChip
            firstName={employeeData?.firstName}
            lastName={employeeData?.lastName}
            avatarUrl={employeeData?.authPic}
            chipStyles={{
              color: "common.black",
              maxWidth: "fit-content"
            }}
          />
        </Box>
        <Typography sx={classes.jobTitle}>
          {`${employeeData?.jobLevel?.name ?? ""} ${employeeData?.jobRole?.name ?? ""}`}
        </Typography>
      </Stack>
      <Button
        label={selectedUserType}
        buttonStyle={ButtonStyle.TERTIARY}
        endIcon={<Icon name={IconName.DROPDOWN_ARROW_ICON} />}
        isFullWidth={false}
        styles={classes.dropDownBtn}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
          setShowOverlay(true);
        }}
        disabled={!isAdmin}
      />
      <Popper
        anchorEl={anchorEl}
        open={Boolean(showOverlay)}
        position={"bottom-end"}
        handleClose={() => {
          setShowOverlay(false);
        }}
        menuType={MenuTypes.SORT}
        isManager={true}
        id={"popper"}
        isFlip={true}
        timeout={300}
      >
        <Box sx={{ backgroundColor: theme.palette.common.white }}>
          {itemList?.map((item, index: number) => (
            <MenuItem
              id={"dropdown-button-id-"
                .concat(id)
                .concat("-button-")
                .concat(index.toString())}
              key={index}
              text={item?.value}
              selected={selectedUserType === item?.value}
              onClick={setUserType}
              isSoftDisabled={
                teamMembers?.supervisor?.length >=
                  MAX_NUM_OF_SUPERVISORS_PER_TEAM &&
                selectedUserType !== MemberTypes.SUPERVISOR &&
                item.value === MemberTypes.SUPERVISOR
              }
            />
          ))}
        </Box>
      </Popper>
    </Stack>
  );
};

export default AddTeamMemberRow;
