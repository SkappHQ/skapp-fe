import { Stack } from "@mui/material";
import React from "react";

import UserPromptModal from "~community/common/components/molecules/UserPromptModal/UserPromptModal";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { usePeopleStore } from "~community/people/store/store";

interface ReinviteConfirmationModalProps {
  onClose: () => void;
  onClick: () => void;
  title: string;
  description: string;
}

const ReinviteConfirmationModal: React.FC<ReinviteConfirmationModalProps> = ({
  onClose,
  onClick,
  title,
  description
}) => {
  const translateText = useTranslator("peopleModule", "peoples");

  const { isReinviteConfirmationModalOpen } = usePeopleStore((state) => state);
  return (
    <Modal
      isModalOpen={isReinviteConfirmationModalOpen}
      onCloseModal={onClose}
      title={title}
      isClosable={false}
    >
      <Stack spacing={2}>
        <UserPromptModal
          description={description}
          primaryBtn={{
            label: translateText(["confirmAndInviteButtonTitle"]),
            buttonStyle: ButtonStyle.PRIMARY,
            endIcon: IconName.TICK_ICON,
            styles: { mt: "1rem" },
            onClick: () => {
              onClick();
            }
          }}
          secondaryBtn={{
            label: translateText(["confirmAndInviteCancelButtonTitle"]),
            buttonStyle: ButtonStyle.TERTIARY,
            endIcon: IconName.CLOSE_ICON,
            onClick: onClose
          }}
        />
      </Stack>
    </Modal>
  );
};

export default ReinviteConfirmationModal;
