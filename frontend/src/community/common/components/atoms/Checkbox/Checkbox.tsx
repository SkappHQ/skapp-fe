import {
  FormControlLabel,
  Checkbox as MuiCheckbox,
  SxProps,
  useTheme
} from "@mui/material";
import { JSX } from "react";

interface Props {
  checked: boolean;
  name: string;
  onChange: () => void;
  disabled?: boolean;
  label: string | JSX.Element;
  size?: "small" | "medium" | "large"; // TODO: create an enum for this
  labelStyles?: SxProps;
  customStyles?: SxProps;
}

const Checkbox = ({
  checked,
  onChange,
  name,
  disabled = false,
  label,
  size = "medium",
  labelStyles,
  customStyles
}: Props) => {
  const theme = useTheme();

  return (
    <FormControlLabel
      control={
        <MuiCheckbox
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          sx={{
            color: theme.palette.primary.main,
            ...customStyles
          }}
          size={size}
        />
      }
      label={label}
      sx={labelStyles}
    />
  );
};

export default Checkbox;
