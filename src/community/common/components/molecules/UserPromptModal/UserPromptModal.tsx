import { Box, SxProps, Typography } from "@mui/material";
import { JSX } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { IconName } from "~community/common/types/IconTypes";

import styles from "./styles";

interface Props {
  description: string | JSX.Element;
  primaryBtn: {
    label: string;
    onClick: () => void;
    isDisabled?: boolean;
    buttonStyle?: ButtonStyle;
    startIcon?: IconName;
    endIcon?: IconName;
    styles?: SxProps;
  };
  secondaryBtn?: {
    label: string;
    onClick: () => void;
    isDisabled?: boolean;
    buttonStyle?: ButtonStyle;
    startIcon?: IconName;
    endIcon?: IconName;
    styles?: SxProps;
  };
}

const UserPromptModal = ({ description, primaryBtn, secondaryBtn }: Props) => {
  const classes = styles();

  return (
    <Box component="div">
      <Typography>{description}</Typography>
      <Button
        label={primaryBtn.label}
        styles={{ ...classes.btn, ...primaryBtn.styles } as SxProps}
        buttonStyle={primaryBtn.buttonStyle ?? ButtonStyle.PRIMARY}
        startIcon={secondaryBtn?.startIcon}
        endIcon={primaryBtn.endIcon}
        disabled={primaryBtn.isDisabled ?? false}
        onClick={primaryBtn.onClick}
      />
      {secondaryBtn && (
        <Button
          label={secondaryBtn?.label}
          styles={{ ...classes.btn, ...secondaryBtn?.styles } as SxProps}
          buttonStyle={secondaryBtn?.buttonStyle ?? ButtonStyle.TERTIARY}
          startIcon={secondaryBtn?.startIcon}
          endIcon={secondaryBtn?.endIcon}
          disabled={secondaryBtn?.isDisabled ?? false}
          onClick={secondaryBtn?.onClick}
        />
      )}
    </Box>
  );
};

export default UserPromptModal;
