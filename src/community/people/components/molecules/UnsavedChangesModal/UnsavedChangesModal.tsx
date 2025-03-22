import { Stack } from "@mui/material";
import React from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import UserPromptModal from "~community/common/components/molecules/UserPromptModal/UserPromptModal";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { IconName } from "~community/common/types/IconTypes";

interface Props {
  isOpen: boolean;
  onDiscard: () => void;
  onSave: () => void;
}

const UnsavedChangesModal: React.FC<Props> = ({
  isOpen,
  onDiscard,
  onSave
}) => {
  return (
    <Modal
      isModalOpen={isOpen}
      onCloseModal={onDiscard}
      isClosable={false}
      title={"Unsaved changes"}
      icon={<Icon name={IconName.CLOSE_STATUS_POPUP_ICON} />}
    >
      <Stack spacing={2}>
        <UserPromptModal
          description={
            "You have unsaved changes. To proceed, would you like to save or discard them?"
          }
          primaryBtn={{
            label: "Save Changes ",
            buttonStyle: ButtonStyle.PRIMARY,
            endIcon: IconName.RIGHT_MARK,
            styles: { mt: "1rem" },
            onClick: onSave
          }}
          secondaryBtn={{
            label: "Discard",
            buttonStyle: ButtonStyle.TERTIARY,
            endIcon: IconName.CLOSE_ICON,
            styles: { mt: "1rem" },
            onClick: onDiscard
          }}
        />
      </Stack>
    </Modal>
  );
};

export default UnsavedChangesModal;
