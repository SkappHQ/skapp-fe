import {
  Box,
  Divider,
  IconButton,
  Stack,
  SxProps,
  Typography
} from "@mui/material";
import { FC, JSX, MouseEvent, ReactElement } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import BasicModal from "~community/common/components/organisms/BasicModal/BasicModal";
import { IconName } from "~community/common/types/IconTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import styles from "./styles";

interface Props {
  isModalOpen: boolean;
  isClosable?: boolean;
  isDividerVisible?: boolean;
  isIconVisible?: boolean;
  onCloseModal: (_event: MouseEvent<HTMLButtonElement>, reason: string) => void;
  title: string;
  children: ReactElement;
  icon?: JSX.Element;
  modalContentStyles?: SxProps;
  modalWrapperStyles?: SxProps;
  customCloseIcon?: JSX.Element;
  modalHeaderStyles?: SxProps;
  modalChildrenStyles?: SxProps;
}

const Modal: FC<Props> = ({
  isModalOpen = false,
  isClosable = true,
  isDividerVisible = true,
  isIconVisible = false,
  onCloseModal,
  title = "",
  children,
  icon,
  modalContentStyles,
  modalWrapperStyles,
  customCloseIcon,
  modalHeaderStyles,
  modalChildrenStyles
}) => {
  const classes = styles();

  return (
    <BasicModal
      open={isModalOpen}
      onClose={onCloseModal}
      sx={mergeSx([classes.modalWrapper, modalWrapperStyles])}
    >
      <Stack sx={mergeSx([classes.modelContentWrapper, modalContentStyles])}>
        <Stack sx={mergeSx([classes.modalHeader, modalHeaderStyles])}>
          <Stack sx={classes.modalHeaderIconContainer}>
            {isIconVisible && <Box sx={classes.titleIcon}>{icon}</Box>}
            <Typography sx={classes.modalHeaderTitle}>{title}</Typography>
          </Stack>
          {isClosable && (
            <IconButton
              sx={classes.closeIconBtn}
              onClick={(event) => onCloseModal(event, "backdropClick")}
            >
              {customCloseIcon ? (
                customCloseIcon
              ) : (
                <Icon name={IconName.CLOSE_STATUS_POPUP_ICON} />
              )}
            </IconButton>
          )}
        </Stack>
        {isDividerVisible && <Divider />}
        <Stack
          sx={{
            ...classes.childrenWrapper,
            "::-webkit-scrollbar": {
              display: "none"
            },
            ...modalChildrenStyles
          }}
        >
          {children}
        </Stack>
      </Stack>
    </BasicModal>
  );
};

export default Modal;
