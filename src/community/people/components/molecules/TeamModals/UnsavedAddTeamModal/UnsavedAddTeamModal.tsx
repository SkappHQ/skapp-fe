import { Dispatch, SetStateAction } from "react";

import AreYouSureModal from "~community/common/components/molecules/AreYouSureModal/AreYouSureModal";
import { usePeopleStore } from "~community/people/store/store";
import { AddTeamType, TeamModelTypes } from "~community/people/types/TeamTypes";

interface Props {
  setTempTeamDetails: Dispatch<SetStateAction<AddTeamType | undefined>>;
}

const UnsavedAddTeamModal = ({ setTempTeamDetails }: Props) => {
  const { setTeamModalType, setIsTeamModalOpen } = usePeopleStore(
    (state) => state
  );

  return (
    <AreYouSureModal
      onPrimaryBtnClick={() => setTeamModalType(TeamModelTypes.ADD_TEAM)}
      onSecondaryBtnClick={() => {
        setTempTeamDetails(undefined);
        setIsTeamModalOpen(false);
        setTeamModalType(TeamModelTypes.UNSAVED_ADD_TEAM);
      }}
    />
  );
};

export default UnsavedAddTeamModal;
