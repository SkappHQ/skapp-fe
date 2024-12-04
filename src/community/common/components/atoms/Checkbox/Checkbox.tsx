import {
  FormControlLabel,
  Checkbox as MuiCheckbox,
  useTheme
} from "@mui/material";

interface Props {
  checked: boolean;
  name: string;
  onChange: () => void;
  disabled?: boolean;
  label: string;
  size?: "small" | "medium" | "large";
}

const Checkbox = ({
  checked,
  onChange,
  name,
  disabled = false,
  label,
  size = "medium"
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
            color: theme.palette.primary.main
          }}
          size={size}
        />
      }
      label={label}
    />
  );
};

export default Checkbox;
