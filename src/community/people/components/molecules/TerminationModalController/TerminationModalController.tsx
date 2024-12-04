import { Box } from "@mui/material";
import { FC } from "react";

import { usePeopleStore } from "~community/people/store/store";

import TerminateConfirmationModal from "../TerminateConfirmationModal/TerminateConfirmationModal";
import TerminationWarningModal from "../TerminationWarningModal/TerminationWarningModal";

const TerminationModalController: FC = () => {
  const {
    isTerminationConfirmationModalOpen,
    alertMessage,
    setTerminationConfirmationModalOpen,
    setTerminationAlertModalOpen,
    isTerminationAlertModalOpen
  } = usePeopleStore((state) => state);

  return (
    <Box>
      <TerminateConfirmationModal
        isOpen={isTerminationConfirmationModalOpen}
        onClose={() => setTerminationConfirmationModalOpen(false)}
      />
      <TerminationWarningModal
        message={alertMessage}
        isOpen={isTerminationAlertModalOpen}
        onClose={() => setTerminationAlertModalOpen(false)}
        onClick={() => setTerminationAlertModalOpen(false)}
      />
    </Box>
  );
};

export default TerminationModalController;
