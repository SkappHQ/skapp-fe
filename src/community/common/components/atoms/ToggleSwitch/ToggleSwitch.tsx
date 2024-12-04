import { Box, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { JSX } from "react";

type ToggleSwitchProps = {
  options: string[];

  setCategoryOption: (options: string) => void;
  categoryOption: string;
};

const ToggleSwitch = (props: ToggleSwitchProps): JSX.Element => {
  const theme: Theme = useTheme();
  const { options, setCategoryOption, categoryOption } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        padding: "4px",
        gap: "4px",
        backgroundColor: theme.palette.grey[200],
        borderRadius: "58px"
      }}
    >
      {/* options */}
      {options.map((option, index) => (
        <Typography
          key={index}
          sx={[
            {
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              height: "24px",
              borderRadius: "64px",
              padding: "4px 12px",
              fontWeight: 400,
              fontSize: "14px",
              color: theme.palette.grey[700],
              gap: "8px",
              userSelect: "none",
              mozUserSelect: "none",
              webkitUserSelect: "none",
              msUserSelect: "none"
            },
            categoryOption === option && {
              backgroundColor: theme.palette.grey[100],
              color: "common.black"
            }
          ]}
          onClick={() => setCategoryOption(option)}
        >
          {option}
        </Typography>
      ))}
    </Box>
  );
};

export default ToggleSwitch;
