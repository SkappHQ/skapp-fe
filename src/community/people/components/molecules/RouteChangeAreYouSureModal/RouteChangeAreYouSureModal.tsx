import React, { useState } from "react";
import AreYouSureModal from "~community/common/components/molecules/AreYouSureModal/AreYouSureModal";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import useFormChangeDetector from "~community/people/hooks/useFormChangeDetector";
import useNavigationGuard from "~community/people/hooks/useNavigationGuard";

const RouteChangeAreYouSureModal: React.FC = () => {
  const [isAreYouSureModalOpen, setIsAreYouSureModalOpen] = useState(false);


  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "commonText"
  );
  const { hasChanged } = useFormChangeDetector();

  const { proceedWithRouteChange } = useNavigationGuard({
    hasChanged,
    isUnsavedChangesModalOpen: isAreYouSureModalOpen,
    setIsUnsavedChangesModalOpen: setIsAreYouSureModalOpen
  });

  const handleModalResume = () => {
    setIsAreYouSureModalOpen(false);
  };

  const handleModalLeave = async () => {
    setIsAreYouSureModalOpen(false);
    await proceedWithRouteChange();
  };

  return (
    <Modal
      isModalOpen={isAreYouSureModalOpen}
      onCloseModal={() => {
        setIsAreYouSureModalOpen(false);
      }}
      title={translateText(["areYouSureModalTitle"])}
      isClosable={false}
      modalWrapperStyles={{
        zIndex: ZIndexEnums.MODAL
      }}
    >
      <AreYouSureModal
        onPrimaryBtnClick={handleModalResume}
        onSecondaryBtnClick={handleModalLeave}
      />
    </Modal>
  );
};

export default RouteChangeAreYouSureModal;
