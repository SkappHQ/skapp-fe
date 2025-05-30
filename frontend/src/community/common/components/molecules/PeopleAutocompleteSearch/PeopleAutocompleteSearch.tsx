import { Stack, SxProps, Theme, Typography, useTheme } from "@mui/material";
import Autocomplete, {
  AutocompleteRenderInputParams
} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { HTMLAttributes, SyntheticEvent, useMemo } from "react";

import { mergeSx } from "~community/common/utils/commonUtil";
import { EmployeeType } from "~community/people/types/EmployeeTypes";

import AvatarChip from "../AvatarChip/AvatarChip";
import styles from "./styles";

interface Props {
  id: {
    autocomplete: string;
    textField: string;
  };
  name: string;
  options: EmployeeType[];
  value?: number;
  onChange?: (event: SyntheticEvent, value: EmployeeType | null) => void;
  placeholder?: string;
  error?: string;
  isDisabled?: boolean;
  required?: boolean;
  label?: string;
  customStyles?: {
    label: SxProps<Theme>;
  };
}

const PeopleAutocompleteSearch = ({
  id,
  options,
  name,
  value,
  onChange,
  placeholder = "Search people",
  error,
  isDisabled = false,
  required = false,
  label,
  customStyles
}: Props) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const getTextColor = () => {
    if (error) {
      return theme.palette.error.contrastText;
    } else if (isDisabled) {
      return theme.palette.text.disabled;
    }
    return theme.palette.common.black;
  };

  const employeeTypeValue = useMemo(() => {
    return options.find((option) => option.employeeId === value) || null;
  }, [options, value]);

  return (
    <Autocomplete
      id={id.autocomplete}
      options={options}
      autoHighlight
      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
      value={employeeTypeValue}
      onChange={onChange}
      disabled={isDisabled}
      renderOption={(
        props: HTMLAttributes<HTMLLIElement> & {
          key: any;
        },
        option: EmployeeType
      ) => {
        const { key, ...optionProps } = props;
        return (
          <AvatarChip
            {...optionProps}
            key={key}
            firstName={option?.firstName}
            lastName={option?.lastName}
            avatarUrl={option?.avatarUrl}
            chipStyles={classes.chip}
          />
        );
      }}
      renderInput={(params: AutocompleteRenderInputParams) => {
        return (
          <Stack sx={classes.wrapper}>
            {label && (
              <Typography
                variant="h5"
                gutterBottom
                color={getTextColor()}
                sx={mergeSx([classes.label, customStyles?.label])}
              >
                {label}{" "}
                {required && (
                  <Typography component="span" sx={classes.asterisk}>
                    *
                  </Typography>
                )}
              </Typography>
            )}
            <TextField
              {...params}
              id={id.textField}
              label={label}
              placeholder={placeholder}
              error={!!error}
              name={name}
            />
            {!!error && (
              <Typography variant="body2" sx={classes.error}>
                {error}
              </Typography>
            )}
          </Stack>
        );
      }}
    />
  );
};

export default PeopleAutocompleteSearch;
