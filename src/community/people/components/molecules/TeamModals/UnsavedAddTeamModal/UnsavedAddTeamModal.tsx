import { Box, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { usePeopleStore } from "~community/people/store/store";
import { AddTeamType, TeamModelTypes } from "~community/people/types/TeamTypes";

interface Props {
  setTempTeamDetails: Dispatch<SetStateAction<AddTeamType | undefined>>;
}

const UnsavedAddTeamModal = ({ setTempTeamDetails }: Props) => {
  const translateText = useTranslator("peopleModule", "teams");
  const { setTeamModalType, setIsTeamModalOpen } = usePeopleStore(
    (state) => state
  );

  return (
    <Box>
      <Typography sx={{ mt: "1rem" }}>
        {translateText(["unsavedChangesAddModalDes"])}
      </Typography>
      <Box>
        <Button
          label={translateText(["resumeTask"])}
          styles={{
            mt: "1rem"
          }}
          buttonStyle={ButtonStyle.PRIMARY}
          onClick={() => {
            setTeamModalType(TeamModelTypes.ADD_TEAM);
          }}
        />
        <Button
          label={translateText(["leaveAnyway"])}
          styles={{
            mt: "1rem"
          }}
          buttonStyle={ButtonStyle.ERROR}
          onClick={() => {
            setTempTeamDetails(undefined);
            setIsTeamModalOpen(false);
            setTeamModalType(TeamModelTypes.UNSAVED_ADD_TEAM);
          }}
        />
      </Box>
    </Box>
  );
};

export default UnsavedAddTeamModal;
