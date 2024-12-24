import { Stack } from "@mui/material";
import React from "react";

import UserPromptModal from "~community/common/components/molecules/UserPromptModal/UserPromptModal";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";

interface UnsavedTimeConfigChangesModalProps {
  isOpen: boolean;
  onLeave: () => void;
  onResume: () => void;
  title: string;
  content: string;
}

const UnsavedTimeConfigChangesModal: React.FC<
  UnsavedTimeConfigChangesModalProps
> = ({ isOpen, onLeave, onResume, title, content }) => {
  const translateText = useTranslator("configurations", "times");

  return (
    <Modal
      isModalOpen={isOpen}
      onCloseModal={onResume}
      title={title}
      isClosable={false}
      modalWrapperStyles={{
        zIndex: ZIndexEnums.MAX
      }}
    >
      <Stack spacing={2}>
        <UserPromptModal
          description={content}
          primaryBtn={{
            label: translateText(["unsavedModalResumeButtonText"]),
            buttonStyle: ButtonStyle.PRIMARY,
            styles: { mt: "1rem" },
            onClick: onResume
          }}
          secondaryBtn={{
            label: translateText(["unsavedModalLeaveAnywayButtonText"]),
            buttonStyle: ButtonStyle.ERROR,
            styles: { mt: "1rem" },
            onClick: onLeave
          }}
        />
      </Stack>
    </Modal>
  );
};

export default UnsavedTimeConfigChangesModal;
