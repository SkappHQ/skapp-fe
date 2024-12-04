import CheckIcon from "@mui/icons-material/Check";
import { Box, useTheme } from "@mui/material";
import { FC, MouseEventHandler } from "react";

import { styles } from "./styles";

interface Props {
  color: string;
  onClick: MouseEventHandler<HTMLDivElement>;
  isSelected: boolean;
  dataTestId?: string;
}
const ColoredCircle: FC<Props> = ({
  color,
  onClick,
  isSelected,
  dataTestId
}) => {
  const theme = useTheme();
  const classes = styles(theme, color);
  return (
    <Box
      sx={classes.container}
      onClick={onClick}
      component={"div"}
      data-testid={dataTestId}
    >
      {isSelected ? (
        <CheckIcon data-testid="checkIcon" color="secondary" fontSize="large" />
      ) : (
        <></>
      )}
    </Box>
  );
};

export default ColoredCircle;
