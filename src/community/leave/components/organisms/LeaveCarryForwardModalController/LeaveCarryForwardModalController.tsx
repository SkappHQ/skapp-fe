import { FC, useCallback } from "react";

import ModalController from "~community/common/components/organisms/ModalController/ModalController";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useLeaveStore } from "~community/leave/store/store";
import { LeaveCarryForwardModalTypes } from "~community/leave/types/LeaveCarryForwardTypes";

import LeaveCarryForwardSyncConfirmation from "../../molecules/LeaveCarryForwardModals/LeaveCarryForwardSyncConfirmation/LeaveCarryForwardSyncConfirmation";
import LeaveCarryForwardTypeContent from "../../molecules/LeaveCarryForwardModals/LeaveCarryForwardTypeContent/LeaveCarryForwardTypeContent";
import LeaveCarryForwardUnEligible from "../../molecules/LeaveCarryForwardModals/LeaveCarryForwardUnEligible/LeaveCarryForwardUnEligible";
import NoCarryForwardLeaveTypes from "../../molecules/LeaveCarryForwardModals/NoCarryForwardLeaveTypes/NoCarryForwardLeaveTypes";

const LeaveCarryForwardModalController: FC = () => {
  const translateText = useTranslator("leaveModule", "leaveCarryForward");

  const {
    isLeaveCarryForwardModalOpen,
    setIsLeaveCarryForwardModalOpen,
    setLeaveCarryForwardModalType,
    leaveCarryForwardModalType
  } = useLeaveStore((state) => state);

  const handleCloseModal = useCallback((): void => {
    setIsLeaveCarryForwardModalOpen(false);
    setLeaveCarryForwardModalType(LeaveCarryForwardModalTypes.NONE);
  }, [setIsLeaveCarryForwardModalOpen, setLeaveCarryForwardModalType]);

  const getModalTitle = useCallback((): string => {
    switch (leaveCarryForwardModalType) {
      case LeaveCarryForwardModalTypes.CARRY_FORWARD:
        return translateText(["leaveCarryForwardTypeSelectionModalTitle"]);
      case LeaveCarryForwardModalTypes.CARRY_FORWARD_TYPES_NOT_AVAILABLE:
        return translateText([
          "leaveCarryForwardLeaveTypesNotAvailableModalTitle"
        ]);
      case LeaveCarryForwardModalTypes.CARRY_FORWARD_INELIGIBLE:
        return translateText(["leaveCarryForwardUnEligibleModalTitle"]);
      case LeaveCarryForwardModalTypes.CARRY_FORWARD_CONFIRM_SYNCHRONIZATION:
        return translateText(["leaveCarryForwardModalHeading"]);
      default:
        return "";
    }
  }, [leaveCarryForwardModalType, translateText]);
  const handleClose = () => {
    setIsLeaveCarryForwardModalOpen(false);
    setLeaveCarryForwardModalType(LeaveCarryForwardModalTypes.NONE);
  };
  return (
    <ModalController
      isModalOpen={isLeaveCarryForwardModalOpen}
      handleCloseModal={handleCloseModal}
      modalTitle={getModalTitle()}
      isClosable={
        leaveCarryForwardModalType ===
          LeaveCarryForwardModalTypes.CARRY_FORWARD ||
        leaveCarryForwardModalType ===
          LeaveCarryForwardModalTypes.CARRY_FORWARD_CONFIRM_SYNCHRONIZATION
      }
    >
      <>
        {leaveCarryForwardModalType ===
          LeaveCarryForwardModalTypes.CARRY_FORWARD && (
          <LeaveCarryForwardTypeContent handleClose={handleClose} />
        )}
        {leaveCarryForwardModalType ===
          LeaveCarryForwardModalTypes.CARRY_FORWARD_TYPES_NOT_AVAILABLE && (
          <NoCarryForwardLeaveTypes handleClose={handleClose} />
        )}
        {leaveCarryForwardModalType ===
          LeaveCarryForwardModalTypes.CARRY_FORWARD_INELIGIBLE && (
          <LeaveCarryForwardUnEligible />
        )}
        {leaveCarryForwardModalType ===
          LeaveCarryForwardModalTypes.CARRY_FORWARD_CONFIRM_SYNCHRONIZATION && (
          <LeaveCarryForwardSyncConfirmation handleClose={handleClose} />
        )}
      </>
    </ModalController>
  );
};

export default LeaveCarryForwardModalController;
