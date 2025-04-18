import { Stack, Typography } from "@mui/material";
import { SxProps, type Theme, useTheme } from "@mui/material/styles";
import { ChangeEvent, FC } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import StyledSwitch from "./StyledSwitch";
import styles from "./styles";

interface SwitchComponentProps {
  label?: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>, type?: string) => void;
  type?: string;
  disabled?: boolean;
  error?: string;
  wrapperStyles?: SxProps<Theme>;
  name?: string;
  icon?: IconName;
  labelId: string;
}

const SwitchRow: FC<SwitchComponentProps> = ({
  label,
  checked,
  type,
  onChange = null,
  disabled = false,
  error,
  wrapperStyles,
  name,
  icon,
  labelId
}) => {
  const translateAria = useTranslator("commonAria", "components", "switch");

  const theme: Theme = useTheme();
  const classes = styles(theme);

  return (
    <Stack sx={mergeSx([classes.wrapper, wrapperStyles])}>
      {!!label && (
        <Typography
          sx={{
            ...classes.label,
            color: disabled
              ? theme.palette.grey.A100
              : theme.palette.common.black
          }}
          id={labelId}
          component="label"
        >
          {label}
          {!!icon && <Icon name={icon} />}
        </Typography>
      )}
      <StyledSwitch
        disableRipple
        checked={checked}
        onChange={(e) => onChange?.(e, type)}
        disabled={disabled}
        name={name}
        slotProps={{
          input: {
            "aria-labelledby": labelId,
            "aria-label": label
              ? `${translateAria(["ariaLabel"])} ${label.toLowerCase()}`
              : translateAria(["ariaLabel"]),
            title: label
              ? `${translateAria(["ariaLabel"])} ${label.toLowerCase()}`
              : translateAria(["ariaLabel"])
          }
        }}
      />
      {!!error && (
        <Typography variant="body2" sx={classes.error}>
          {error}
        </Typography>
      )}
    </Stack>
  );
};

export default SwitchRow;
