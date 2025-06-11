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
import { useTranslator } from "~community/common/hooks/useTranslator";
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
  customCloseComponent?: JSX.Element;
  customCloseIcon?: JSX.Element;
  modalHeaderStyles?: SxProps;
  modalChildrenStyles?: SxProps;
  dividerStyles?: SxProps;
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
  customCloseComponent,
  customCloseIcon,
  modalHeaderStyles,
  modalChildrenStyles,
  dividerStyles
}) => {
  const translateAria = useTranslator("commonAria", "components", "modal");

  const classes = styles();

  return (
    <BasicModal
      open={isModalOpen}
      onClose={onCloseModal}
      sx={mergeSx([classes.modalWrapper, modalWrapperStyles])}
    >
      <Stack
        sx={mergeSx([classes.modelContentWrapper, modalContentStyles])}
        role="dialog"
        aria-label={translateAria(["modal"], { title })}
      >
        <Stack sx={mergeSx([classes.modalHeader, modalHeaderStyles])}>
          <Stack sx={classes.modalHeaderIconContainer}>
            {isIconVisible && <Box sx={classes.titleIcon}>{icon}</Box>}
            <Typography sx={classes.modalHeaderTitle}>{title}</Typography>
          </Stack>
          {isClosable && customCloseComponent ? (
            customCloseComponent
          ) : isClosable ? (
            <IconButton
              sx={classes.closeIconBtn}
              onClick={(event) => onCloseModal(event, "backdropClick")}
              aria-label={translateAria(["closeIconBtn"], { title })}
            >
              {customCloseIcon ? (
                customCloseIcon
              ) : (
                <Icon name={IconName.CLOSE_STATUS_POPUP_ICON} />
              )}
            </IconButton>
          ) : null}
        </Stack>
        {isDividerVisible && <Divider sx={dividerStyles} />}
        <Stack
          sx={mergeSx([
            classes.childrenWrapper,
            {
              "::-webkit-scrollbar": {
                display: "none"
              }
            },
            modalChildrenStyles
          ])}
        >
          {children}
        </Stack>
      </Stack>
    </BasicModal>
  );
};

export default Modal;
