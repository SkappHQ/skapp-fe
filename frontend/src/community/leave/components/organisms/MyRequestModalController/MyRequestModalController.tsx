import { useMemo } from "react";

import ModalController from "~community/common/components/organisms/ModalController/ModalController";
import { useTranslator } from "~community/common/hooks/useTranslator";
import AddAttachmentModal from "~community/leave/components/molecules/MyLeaveRequestsModals/AddAttachmentModal/AddAttachmentModal";
import ApplyLeaveModal from "~community/leave/components/molecules/MyLeaveRequestsModals/ApplyLeaveModal/ApplyLeaveModal";
import LeaveTypeSelectionModal from "~community/leave/components/molecules/MyLeaveRequestsModals/LeaveTypeSelectionModal/LeaveTypeSelectionModal";
import TeamAvailabilityModal from "~community/leave/components/molecules/MyLeaveRequestsModals/TeamAvailabilityModal/TeamAvailabilityModal";
import { MyRequestModalEnums } from "~community/leave/enums/MyRequestEnums";
import { useLeaveStore } from "~community/leave/store/store";
import MarkOutOfOfficeModal from "~enterprise/leave/components/molecules/MyLeaveRequestModals/MarkOutOfOfficeModal";

const MyRequestModalController = () => {
  const translateText = useTranslator("leaveModule", "myRequests");

  const {
    isMyRequestModalOpen,
    myRequestModalType,
    setMyLeaveRequestModalType
  } = useLeaveStore();

  const modalTitle = useMemo(() => {
    switch (myRequestModalType) {
      case MyRequestModalEnums.APPLY_LEAVE:
      case MyRequestModalEnums.LEAVE_TYPE_SELECTION:
        return translateText(["applyLeaveModal", "title"]);
      case MyRequestModalEnums.TEAM_AVAILABILITY:
        return translateText(["teamAvailabilityCard", "title"]);
      case MyRequestModalEnums.ADD_ATTACHMENT:
        return translateText(["addAttachmentModal", "title"]);
      case MyRequestModalEnums.MARK_OUT_OF_OFFICE:
        return translateText(["applyLeaveModal", "markOutOfOfficeModalTitle"]);
      default:
        return "";
    }
  }, [myRequestModalType, translateText]);

  const modalWrapperStyles = useMemo(() => {
    switch (myRequestModalType) {
      case MyRequestModalEnums.APPLY_LEAVE:
      case MyRequestModalEnums.LEAVE_TYPE_SELECTION:
        return { width: { xs: "100%", sm: "90%" } };
      default:
        return {};
    }
  }, [myRequestModalType]);

  const modalContentStyles = useMemo(() => {
    switch (myRequestModalType) {
      case MyRequestModalEnums.APPLY_LEAVE:
      case MyRequestModalEnums.LEAVE_TYPE_SELECTION:
        return { maxWidth: { xs: "100%", sm: "1170px" } };
      default:
        return {};
    }
  }, [myRequestModalType]);

  const handleCloseModal = () => {
    switch (myRequestModalType) {
      case MyRequestModalEnums.APPLY_LEAVE:
      case MyRequestModalEnums.LEAVE_TYPE_SELECTION:
      case MyRequestModalEnums.MARK_OUT_OF_OFFICE:
        setMyLeaveRequestModalType(MyRequestModalEnums.NONE);
        break;
      case MyRequestModalEnums.TEAM_AVAILABILITY:
      case MyRequestModalEnums.ADD_ATTACHMENT:
        setMyLeaveRequestModalType(MyRequestModalEnums.APPLY_LEAVE);
        break;
      default:
        break;
    }
  };

  return (
    <ModalController
      isModalOpen={isMyRequestModalOpen}
      modalTitle={modalTitle}
      handleCloseModal={handleCloseModal}
      isClosable={true}
      modalWrapperStyles={modalWrapperStyles}
      modalContentStyles={modalContentStyles}
    >
      <>
        {myRequestModalType === MyRequestModalEnums.APPLY_LEAVE && (
          <ApplyLeaveModal />
        )}
        {myRequestModalType === MyRequestModalEnums.LEAVE_TYPE_SELECTION && (
          <LeaveTypeSelectionModal />
        )}
        {myRequestModalType === MyRequestModalEnums.TEAM_AVAILABILITY && (
          <TeamAvailabilityModal />
        )}
        {myRequestModalType === MyRequestModalEnums.ADD_ATTACHMENT && (
          <AddAttachmentModal />
        )}
        {myRequestModalType === MyRequestModalEnums.MARK_OUT_OF_OFFICE && (
          <MarkOutOfOfficeModal />
        )}
      </>
    </ModalController>
  );
};

export default MyRequestModalController;
