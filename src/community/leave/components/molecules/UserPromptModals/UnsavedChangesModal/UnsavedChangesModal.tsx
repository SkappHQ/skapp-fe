import { useRouter } from "next/navigation";

import AreYouSureModal from "~community/common/components/molecules/AreYouSureModal/AreYouSureModal";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { LeaveTypeModalEnums } from "~community/leave/enums/LeaveTypeEnums";
import { useLeaveStore } from "~community/leave/store/store";

const ExitModal = () => {
  const router = useRouter();

  const translateText = useTranslator(
    "commonComponents",
    "userPromptModal",
    "unsavedChangesModal"
  );

  const {
    leaveTypeModalType,
    pendingNavigation,
    setLeaveTypeModalType,
    resetEditingLeaveType
  } = useLeaveStore((state) => state);

  return (
    <Modal
      isModalOpen={
        leaveTypeModalType === LeaveTypeModalEnums.UNSAVED_CHANGES_MODAL
      }
      onCloseModal={() => setLeaveTypeModalType(LeaveTypeModalEnums.NONE)}
      title={translateText(["title"])}
      isClosable={false}
      isDividerVisible={true}
      modalWrapperStyles={{
        zIndex: ZIndexEnums.MODAL
      }}
    >
      <AreYouSureModal
        onPrimaryBtnClick={() =>
          setLeaveTypeModalType(LeaveTypeModalEnums.NONE)
        }
        onSecondaryBtnClick={async () => {
          setLeaveTypeModalType(LeaveTypeModalEnums.NONE);
          await router.push(pendingNavigation);
          resetEditingLeaveType();
        }}
      />
    </Modal>
  );
};

export default ExitModal;
