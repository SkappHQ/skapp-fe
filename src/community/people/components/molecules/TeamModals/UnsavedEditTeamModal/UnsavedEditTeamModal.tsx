import { Box, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { useUpdateTeam } from "~community/people/api/TeamApi";
import { usePeopleStore } from "~community/people/store/store";
import { AddTeamType, TeamModelTypes } from "~community/people/types/TeamTypes";

interface Props {
  tempTeamDetails: AddTeamType | undefined;
  setTempTeamDetails: Dispatch<SetStateAction<AddTeamType | undefined>>;
}

const UnsavedEditTeamModal = ({
  tempTeamDetails,
  setTempTeamDetails
}: Props) => {
  const translateText = useTranslator("peopleModule", "teams");
  const {
    currentEditingTeam,
    setTeamModalType,
    setIsTeamModalOpen,
    setCurrentEditingTeam
  } = usePeopleStore((state) => state);

  const onUpdateSuccess = () => {
    setIsTeamModalOpen(false);
    setTeamModalType(TeamModelTypes.EDIT_TEAM);
    // TODO: show toast
  };

  const onUpdateError = () => {
    // TODO: show toast
  };

  const { mutate: updateTeamMutate } = useUpdateTeam(
    onUpdateSuccess,
    onUpdateError
  );

  return (
    <Box>
      <Typography sx={{ mt: "1rem" }}>
        {translateText(["unsavedChangesEditModalDes"])}
      </Typography>
      <Box>
        <Button
          label={translateText(["saveChanges"])}
          styles={{
            mt: "1rem"
          }}
          buttonStyle={ButtonStyle.PRIMARY}
          endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
          onClick={() => {
            if (
              !tempTeamDetails?.teamName ||
              tempTeamDetails.teamSupervisors?.length === 0
            ) {
              setTeamModalType(TeamModelTypes.EDIT_TEAM);
            } else {
              updateTeamMutate({
                teamId: currentEditingTeam?.teamId as number,
                teamName: tempTeamDetails.teamName,
                teamSupervisors: tempTeamDetails.teamSupervisors,
                teamMembers: tempTeamDetails.teamMembers
              });
              setTempTeamDetails(undefined);
              setCurrentEditingTeam(undefined);
              setIsTeamModalOpen(false);
              setTeamModalType(TeamModelTypes.NONE);
            }
          }}
        />
        <Button
          label={translateText(["discard"])}
          styles={{
            mt: "1rem"
          }}
          buttonStyle={ButtonStyle.TERTIARY}
          endIcon={<Icon name={IconName.CLOSE_ICON} />}
          onClick={() => {
            setIsTeamModalOpen(false);
            setTeamModalType(TeamModelTypes.NONE);
            setCurrentEditingTeam(undefined);
            setTempTeamDetails(undefined);
          }}
        />
      </Box>
    </Box>
  );
};

export default UnsavedEditTeamModal;
