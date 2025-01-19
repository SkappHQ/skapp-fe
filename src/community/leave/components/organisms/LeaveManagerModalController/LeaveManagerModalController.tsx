import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import Modal from "~community/common/components/organisms/Modal/Modal";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useLeaveStore } from "~community/leave/store/store";
import {
  LeaveExtraPopupTypes,
  LeaveStatusTypes
} from "~community/leave/types/LeaveRequestTypes";

import LeaveManagerSuccessModal from "../../molecules/ManagerLeaveModalContents/LeaveManagerSuccessModal/LeaveManagerSuccessModal";
import ManagerApproveLeaveModal from "../../molecules/ManagerLeaveModalContents/ManagerApproveLeaveModal/ManagerApproveLeaveModal";
import ManagerDeclineLeaveModal from "../../molecules/ManagerLeaveModalContents/ManagerDeclineLeaveModal/ManagerDeclineLeaveModal";

const LeaveManagerModalController = () => {
  const translateText = useTranslator(
    "leaveModule",
    "leaveRequests",
    "leaveModals"
  );
  const {
    leaveRequestData,
    isManagerModalOpen,
    setIsManagerModal,
    removeLeaveRequestRowData,
    removeNewLeaveId
  } = useLeaveStore((state) => ({
    removeLeaveRequestRowData: state.removeLeaveRequestRowData,
    leaveRequestData: state.leaveRequestData,
    isManagerModalOpen: state.isManagerModalOpen,
    setIsManagerModal: state.setIsManagerModal,
    removeNewLeaveId: state.removeNewLeaveId
  }));
  const [modalTitle, setModalTitle] = useState<string>("");
  const [popupType, setPopupType] = useState<
    LeaveStatusTypes | LeaveExtraPopupTypes | string
  >("");

  const closeModel = (): void => {
    setIsManagerModal(false);
    setPopupType("");
    removeNewLeaveId();
    removeLeaveRequestRowData();
  };

  const handelManagerModal = (): void => {
    if (
      popupType !== LeaveExtraPopupTypes.APPROVED_STATUS &&
      popupType !== LeaveExtraPopupTypes.DECLINE_STATUS &&
      popupType !== LeaveExtraPopupTypes.REVOKE_SUMMARY_POPUP
    )
      setIsManagerModal(false);

    setIsManagerModal(false);
    setPopupType("");
    removeNewLeaveId();
    removeLeaveRequestRowData();
  };

  useEffect(() => {
    if (leaveRequestData.status === LeaveStatusTypes.PENDING)
      return setPopupType(LeaveStatusTypes.PENDING);
    if (leaveRequestData.status === LeaveStatusTypes.DENIED)
      return setPopupType(LeaveStatusTypes.DENIED);
    if (leaveRequestData.status === LeaveStatusTypes.APPROVED)
      return setPopupType(LeaveStatusTypes.APPROVED);
    if (leaveRequestData.status === LeaveStatusTypes.CANCELLED)
      return setPopupType(LeaveStatusTypes.CANCELLED);
    if (leaveRequestData.status === LeaveStatusTypes.REVOKED)
      return setPopupType(LeaveStatusTypes.REVOKED);
  }, [leaveRequestData, isManagerModalOpen]);

  useEffect(() => {
    if (popupType === LeaveStatusTypes.PENDING)
      setModalTitle(translateText(["approveModalTitle"]));
    else if (popupType === LeaveExtraPopupTypes.DECLINE)
      setModalTitle(translateText(["declineModalTitle"]));
    else if (popupType === LeaveStatusTypes.APPROVED)
      setModalTitle(translateText(["approvedModalTitle"]));
    else if (popupType === LeaveStatusTypes.DENIED)
      setModalTitle(translateText(["deniedModalTitle"]));
    else if (popupType === LeaveStatusTypes.REVOKED)
      setModalTitle(translateText(["revokedModalTitle"]));
    else if (popupType === LeaveStatusTypes.CANCELLED)
      setModalTitle(translateText(["cancelledModalTitle"]));
    else if (popupType === LeaveExtraPopupTypes.DECLINE_STATUS)
      setModalTitle(translateText(["deniedModalTitle"]));
    else if (popupType === LeaveExtraPopupTypes.APPROVED_STATUS)
      setModalTitle(translateText(["approvedModalTitle"]));
  }, [popupType, isManagerModalOpen]);

  return (
    <div>
      {isManagerModalOpen && popupType && (
        <Modal
          isModalOpen={isManagerModalOpen}
          onCloseModal={handelManagerModal}
          aria-labelledby="modal-title"
          title={modalTitle}
        >
          <Box
            aria-labelledby="modal-title"
            sx={{
              marginTop: "1rem"
            }}
          >
            {popupType === LeaveStatusTypes.PENDING && (
              <ManagerApproveLeaveModal setPopupType={setPopupType} />
            )}

            {(popupType === LeaveExtraPopupTypes.APPROVED_STATUS ||
              popupType === LeaveExtraPopupTypes.DECLINE_STATUS ||
              popupType === LeaveExtraPopupTypes.REVOKE_POPUP ||
              popupType === LeaveStatusTypes.DENIED ||
              popupType === LeaveStatusTypes.APPROVED ||
              popupType === LeaveStatusTypes.CANCELLED ||
              popupType === LeaveStatusTypes.REVOKED) && (
              <LeaveManagerSuccessModal
                closeModel={closeModel}
                popupType={popupType}
                setPopupType={setPopupType}
              />
            )}

            {popupType === LeaveExtraPopupTypes.DECLINE && (
              <ManagerDeclineLeaveModal
                closeModel={closeModel}
                setPopupType={setPopupType}
              />
            )}
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default LeaveManagerModalController;
