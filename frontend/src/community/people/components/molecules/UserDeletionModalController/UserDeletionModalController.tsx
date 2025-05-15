import { Box } from "@mui/material";
import { FC } from "react";

import { usePeopleStore } from "~community/people/store/store";

import UserDeletionConfirmationModal from "../UserDeletionConfirmationModal/UserDeletionConfirmationModal";
import UserDeletionWarningModal from "../UserDeletionWarningModal/UserDeletionWarningModal";

const UserDeletionModalController: FC = () => {
  const {
    isDeletionConfirmationModalOpen,
    isDeletionAlertOpen,
    setDeletionConfirmationModalOpen,
    setDeletionAlertOpen,
    deletionAlertMessage
  } = usePeopleStore((state) => state);

  return (
    <Box>
      <UserDeletionConfirmationModal
        isOpen={isDeletionConfirmationModalOpen}
        onClose={() => setDeletionConfirmationModalOpen(false)}
      />
      <UserDeletionWarningModal
        message={deletionAlertMessage}
        isOpen={isDeletionAlertOpen}
        onClose={() => setDeletionAlertOpen(false)}
        onClick={() => setDeletionAlertOpen(false)}
      />
    </Box>
  );
};

export default UserDeletionModalController;
