import { Stack, Theme, Typography, useTheme } from "@mui/material";
import { ChangeEvent } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import { IconName } from "~community/common/types/IconTypes";

import StyledTextArea from "./StyledTextArea";
import styles from "./styles";

interface Props<T> {
  label: string;
  name: string;
  placeholder?: string;
  isRequired?: boolean;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: {
    comment?: string | undefined;
    attachment?: string | undefined;
  };
  isAttachmentRequired?: boolean;
  maxLength: number;
  iconName?: IconName;
  onIconClick?: () => void;
}

const TextArea = <T,>({
  label,
  name,
  placeholder = "",
  isRequired = true,
  value,
  onChange,
  error,
  maxLength,
  isAttachmentRequired = false,
  iconName,
  onIconClick
}: Props<T>) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  return (
    <Stack sx={classes.wrapper}>
      <Stack sx={classes.container}>
        <Typography variant="body1" sx={error?.comment ? classes.error : {}}>
          {label} &nbsp;
          {isRequired && (
            <Typography component="span" sx={classes.asterisk}>
              *
            </Typography>
          )}
        </Typography>
        <Stack sx={classes.field}>
          <StyledTextArea
            maxLength={maxLength}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
          {iconName ? (
            <Icon
              name={iconName}
              onClick={onIconClick}
              fill={
                isAttachmentRequired && error?.attachment
                  ? theme.palette.error.contrastText
                  : theme.palette.common.black
              }
            />
          ) : (
            <></>
          )}
        </Stack>
      </Stack>
      {!!error && (
        <Typography variant="caption" sx={classes.error}>
          {error.comment || error.attachment}
        </Typography>
      )}
    </Stack>
  );
};

export default TextArea;
