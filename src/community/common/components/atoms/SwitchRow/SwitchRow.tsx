import { Stack, Typography } from "@mui/material";
import { SxProps, type Theme, useTheme } from "@mui/material/styles";
import { ChangeEvent, FC } from "react";

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
}

const SwitchRow: FC<SwitchComponentProps> = ({
  label,
  checked,
  type,
  onChange = null,
  disabled = false,
  error,
  wrapperStyles,
  name
}) => {
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
        >
          {label}
        </Typography>
      )}
      <StyledSwitch
        disableRipple
        checked={checked}
        onChange={(e) => onChange?.(e, type)}
        disabled={disabled}
        name={name}
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
