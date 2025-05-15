import { Box, Stack, Theme, Typography, useTheme } from "@mui/material";
import * as React from "react";
import { useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import MenuItem from "~community/common/components/atoms/MenuItem/MenuItem";
import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import Popper from "~community/common/components/molecules/Popper/Popper";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { MenuTypes } from "~community/common/types/MoleculeTypes";
import { useGetAllTeams } from "~community/people/api/TeamApi";
import { usePeopleStore } from "~community/people/store/store";
import { EmployeeType } from "~community/people/types/EmployeeTypes";
import { TeamNamesType } from "~community/people/types/TeamTypes";

import styles from "./styles";

interface Props {
  teamMember: EmployeeType;
  setTeamId?: (teamId: number) => void;
}

const ReassignMemberRow = ({ teamMember, setTeamId }: Props) => {
  const theme: Theme = useTheme();

  const classes = styles();

  const translateText = useTranslator("peopleModule", "teams");
  const { currentDeletingTeam } = usePeopleStore((state) => state);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamNamesType | undefined>();
  const [teamIds, setTeamIds] = useState<number[]>([]);

  const handleMenuItemClick = (team: TeamNamesType) => {
    setSelectedTeam(team);
    setShowOverlay(false);
    setTeamIds((prevTeamIds) => [...prevTeamIds, Number(team.teamId)]);
    setTeamId && setTeamId(Number(team.teamId));
  };

  const { data: allTeams } = useGetAllTeams();
  const filteredTeams = allTeams?.filter(
    (team) => team?.teamId !== currentDeletingTeam?.teamId
  );

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <AvatarChip
        firstName={teamMember?.firstName}
        lastName={teamMember?.lastName}
        avatarUrl={teamMember?.avatarUrl}
        isResponsiveLayout={true}
        chipStyles={classes.avatarChip}
      />
      <Typography
        variant="body2"
        color={theme.palette.primary.dark}
        fontSize="0.75rem"
        lineHeight="1rem"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        sx={classes.jobTitle}
      >
        {`${teamMember?.jobLevel?.name ?? ""} ${teamMember?.jobRole?.name ?? ""}`}
      </Typography>
      <Box sx={classes.btnWrapper}>
        <Button
          label={selectedTeam?.teamName || translateText(["notAssigned"])}
          buttonStyle={ButtonStyle.TERTIARY}
          endIcon={<Icon name={IconName.DROPDOWN_ARROW_ICON} />}
          isFullWidth={false}
          styles={classes.dropDownBtn}
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
            setShowOverlay(true);
          }}
          size={ButtonSizes.MEDIUM}
          disabled={filteredTeams?.length === 0}
        />
      </Box>
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
        containerStyles={classes.popper}
      >
        <Box sx={{ backgroundColor: theme.palette.common.white }}>
          {filteredTeams?.map((team, index: number) => (
            <MenuItem
              key={index}
              text={team?.teamName}
              selected={selectedTeam?.teamId === team?.teamId}
              onClick={() => handleMenuItemClick(team)}
            />
          ))}
        </Box>
      </Popper>
    </Stack>
  );
};

export default ReassignMemberRow;
