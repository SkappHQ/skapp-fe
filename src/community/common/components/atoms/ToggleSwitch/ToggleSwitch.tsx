import { Box, Typography } from "@mui/material";
import { SxProps, type Theme, useTheme } from "@mui/material/styles";
import { JSX } from "react";

import { mergeSx } from "~community/common/utils/commonUtil";

import styles from "./styles";

type ToggleSwitchProps = {
  options: string[];
  setCategoryOption: (options: string) => void;
  categoryOption: string;
  containerStyles?: SxProps;
  textStyles?: (isSelected?: boolean) => SxProps;
};

const ToggleSwitch = (props: ToggleSwitchProps): JSX.Element => {
  const theme: Theme = useTheme();
  const classes = styles(theme);
  const {
    options,
    setCategoryOption,
    categoryOption,
    containerStyles,
    textStyles
  } = props;
  return (
    <Box sx={mergeSx([classes.container, containerStyles])}>
      {/* options */}
      {options.map((option, index) => (
        <Typography
          key={index}
          sx={mergeSx([
            classes.text(categoryOption === option),
            textStyles ? textStyles(categoryOption === option) : {}
          ])}
          onClick={() => setCategoryOption(option)}
        >
          {option}
        </Typography>
      ))}
    </Box>
  );
};

export default ToggleSwitch;
